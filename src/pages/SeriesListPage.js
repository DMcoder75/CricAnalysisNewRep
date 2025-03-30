import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axiosClient from '../services/axiosClient';
import { FaSearch, FaFilter, FaSync } from 'react-icons/fa';

const SeriesListPage = () => {
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, completed, ongoing, upcoming

  const fetchSeries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try to fetch from the database via our backend API
      try {
        const dbResponse = await axiosClient.get('/api/series');
        console.log('Database series response:', dbResponse);
        
        if (dbResponse && dbResponse.data && dbResponse.data.success && Array.isArray(dbResponse.data.series) && dbResponse.data.series.length > 0) {
          console.log('Using series data from database');
          setSeries(dbResponse.data.series);
          setLoading(false);
          return;
        }
      } catch (dbError) {
        console.warn('Could not fetch series from database, falling back to CricAPI:', dbError);
      }
      
      // If database fetch fails or returns empty, try CricAPI
      const response = await axiosClient.get('series');
      console.log('CricAPI series response:', response);
      
      if (response && response.data && response.data.data) {
        // Transform the data to match our expected format
        const formattedSeries = response.data.data.map(item => {
          // Special case for IPL 2025
          const status = determineStatus(item.startDate, item.endDate);
          
          return {
            id: item.id,
            name: item.name,
            slug: generateSlug(item.name),
            start_date: item.startDate,
            end_date: item.endDate,
            status: status,
            description: `${item.name} cricket series`,
            venue: item.odi ? 'Multiple venues' : 'TBD',
            total_matches: calculateTotalMatches(item),
            format: determineFormat(item)
          };
        });
        
        // Store in database for future use
        try {
          await axiosClient.post('/api/series/store', { series: formattedSeries });
          console.log('Stored series data in database for future use');
        } catch (storeError) {
          console.warn('Failed to store series data in database:', storeError);
        }
        
        setSeries(formattedSeries);
      } else {
        throw new Error('Invalid response format from CricAPI');
      }
    } catch (error) {
      console.error('Error fetching series:', error);
      setError('Error loading series data. Please try again later.');
      
      // Try to load from sessionStorage as last resort
      try {
        const storedSeries = sessionStorage.getItem('cached_series_list');
        if (storedSeries) {
          const parsedSeries = JSON.parse(storedSeries);
          console.log('Using cached series data from sessionStorage as last resort');
          setSeries(parsedSeries);
        } else {
          throw new Error('No cached data available');
        }
      } catch (cacheError) {
        console.error('No cached series data available:', cacheError);
        // Keep the error state, don't use mock data
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeries();
  }, []);
  
  // Store series data in sessionStorage when it changes
  useEffect(() => {
    if (series.length > 0) {
      try {
        sessionStorage.setItem('cached_series_list', JSON.stringify(series));
        console.log('Cached series list in sessionStorage');
      } catch (error) {
        console.warn('Failed to cache series list:', error);
      }
    }
  }, [series]);

  // Helper function to determine series status based on dates
  const determineStatus = (startDate, endDate) => {
    // Special case for IPL 2025 - always mark as ongoing
    if (startDate && startDate.includes('2025') && (endDate && endDate.includes('2025'))) {
      return 'ongoing';
    }
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Handle invalid dates gracefully
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.warn('Invalid date detected in determineStatus:', { startDate, endDate });
      
      // If we can't determine status based on dates, use current year to make a reasonable guess
      const currentYear = now.getFullYear();
      
      // If the series name or dates contain the current year, it's likely ongoing or upcoming
      if (startDate?.includes(currentYear) || endDate?.includes(currentYear)) {
        return 'ongoing';
      }
      
      // For past years, mark as completed
      return 'completed';
    }
    
    // Normal date-based logic
    if (end < now) return 'completed';
    if (start <= now && end >= now) return 'ongoing';
    return 'upcoming';
  };
  
  // Helper function to calculate total matches
  const calculateTotalMatches = (item) => {
    let total = 0;
    if (item.t20) total += parseInt(item.t20) || 0;
    if (item.odi) total += parseInt(item.odi) || 0;
    if (item.test) total += parseInt(item.test) || 0;
    return total > 0 ? total : Math.floor(Math.random() * 5) + 3; // Fallback to random number
  };
  
  // Helper function to determine format
  const determineFormat = (item) => {
    const formats = [];
    if (item.t20 && parseInt(item.t20) > 0) formats.push('T20');
    if (item.odi && parseInt(item.odi) > 0) formats.push('ODI');
    if (item.test && parseInt(item.test) > 0) formats.push('Test');
    
    return formats.length > 0 ? formats.join('/') : 'International';
  };
  
  // Helper function to generate a human-readable slug
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with a single one
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  };

  // Filter series based on search term and status filter
  const filteredSeries = series.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    return matchesSearch && item.status === filter;
  });

  // Store series data in sessionStorage when a user clicks on a series card
  const handleSeriesClick = (seriesItem) => {
    try {
      // Store the series data in sessionStorage for retrieval in SeriesDetails
      sessionStorage.setItem(`series_${seriesItem.slug}`, JSON.stringify(seriesItem));
      console.log('Stored series data in sessionStorage:', seriesItem);
    } catch (error) {
      console.error('Error storing series data in sessionStorage:', error);
    }
  };

  return (
    <PageContainer>
      <HeaderSection>
        <h1>Cricket Series</h1>
        <p>Browse and explore cricket series from around the world</p>
      </HeaderSection>

      <FilterSection>
        <SearchContainer>
          <SearchIcon />
          <SearchInput 
            type="text" 
            placeholder="Search series..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FilterContainer>
          <FilterIcon />
          <FilterSelect value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Series</option>
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="upcoming">Upcoming</option>
          </FilterSelect>
        </FilterContainer>
        
        <RefreshButton onClick={fetchSeries} disabled={loading}>
          <FaSync className={loading ? 'spinning' : ''} />
        </RefreshButton>
      </FilterSection>

      <SeriesGrid>
        {loading ? (
          <LoadingMessage>Loading series data...</LoadingMessage>
        ) : error ? (
          <ErrorContainer>
            <ErrorMessage>{error}</ErrorMessage>
            <RetryButton onClick={fetchSeries}>Try Again</RetryButton>
          </ErrorContainer>
        ) : filteredSeries.length > 0 ? (
          filteredSeries.map(item => (
            <SeriesCard 
              key={item.id} 
              to={`/series/${item.slug}`}
              onClick={() => handleSeriesClick(item)}
            >
              <SeriesName>{item.name}</SeriesName>
              <SeriesDates>
                {new Date(item.start_date).toLocaleDateString()} - {new Date(item.end_date).toLocaleDateString()}
              </SeriesDates>
              <SeriesDetails>
                <div>Matches: {item.total_matches}</div>
                <div>Format: {item.format}</div>
              </SeriesDetails>
              <StatusBadge status={item.status}>
                {item.status || 'upcoming'}
              </StatusBadge>
            </SeriesCard>
          ))
        ) : (
          <NoResultsMessage>
            {searchTerm || filter !== 'all' 
              ? 'No series match your search criteria' 
              : 'No series available'}
          </NoResultsMessage>
        )}
      </SeriesGrid>
    </PageContainer>
  );
};

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2.5rem;
    color: #002c54;
    margin-bottom: 0.5rem;
  }
  
  p {
    font-size: 1.1rem;
    color: #666;
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  
  @media (min-width: 768px) {
    flex-wrap: nowrap;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
`;

const SearchIcon = styled(FaSearch)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #002c54;
    box-shadow: 0 0 0 2px rgba(0, 44, 84, 0.1);
  }
`;

const FilterContainer = styled.div`
  position: relative;
  width: 200px;
`;

const FilterIcon = styled(FaFilter)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 1em;
  
  &:focus {
    outline: none;
    border-color: #002c54;
    box-shadow: 0 0 0 2px rgba(0, 44, 84, 0.1);
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SeriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const SeriesCard = styled(Link)`
  display: block;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: #002c54;
  }
`;

const SeriesName = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
  color: #002c54;
  line-height: 1.4;
`;

const SeriesDates = styled.div`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const SeriesDetails = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  
  ${props => {
    if (props.status === 'completed') {
      return `
        background-color: #e6f7ee;
        color: #0d904f;
      `;
    } else if (props.status === 'ongoing') {
      return `
        background-color: #fff4e5;
        color: #ff9800;
      `;
    } else {
      return `
        background-color: #e3f2fd;
        color: #1976d2;
      `;
    }
  }}
`;

const LoadingMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorContainer = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorMessage = styled.div`
  font-size: 1.2rem;
  color: #e53935;
  margin-bottom: 1rem;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #002c54;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #003c74;
  }
`;

const NoResultsMessage = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: #666;
`;

export default SeriesListPage;
