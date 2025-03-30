import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../utils/theme';
import axiosClient from '../services/axiosClient';

// Add a function to convert series name to a URL-friendly slug
const generateSlug = (name) => {
  // Convert the name to lowercase, replace spaces and special chars with hyphens
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
  
  // Return clean slug without the ID
  console.log('Generated slug:', slug, 'from name:', name);
  return slug;
};

const Series = () => {
  const [series, setSeries] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSeries();
  }, []);

  useEffect(() => {
    // Filter series based on search term and active filter
    if (series.length > 0) {
      let filtered = series;
      
      // Filter by status
      if (activeFilter !== 'all') {
        filtered = filtered.filter(s => s.status === activeFilter);
      }
      
      // Filter by search term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(s => 
          s.name.toLowerCase().includes(term)
        );
      }
      
      setFilteredSeries(filtered);
    }
  }, [series, searchTerm, activeFilter]);

  const fetchSeries = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Make a direct request to CricAPI for series data
      const response = await axiosClient.get('series?offset=0');
      console.log('CricAPI series response:', response);
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        // Transform the CricAPI response to match our expected format
        const formattedSeries = response.data.data.map(item => {
          // Validate and fix dates
          let startDate = item.startDate;
          let endDate = item.endDate;
          
          // Validate that dates are in proper format
          const startDateObj = new Date(startDate);
          const endDateObj = new Date(endDate);
          
          // Check if dates are valid
          const isStartDateValid = !isNaN(startDateObj.getTime());
          const isEndDateValid = !isNaN(endDateObj.getTime());
          
          // Fix specific case for IPL 2025 or any case where end date is before start date
          if (isStartDateValid && isEndDateValid) {
            // If end date is before start date, assume year error and fix it
            if (endDateObj < startDateObj) {
              console.log(`Fixing invalid date range for ${item.name}: ${startDate} - ${endDate}`);
              
              // Extract the year from the start date and apply it to the end date
              const startYear = startDateObj.getFullYear();
              endDateObj.setFullYear(startYear);
              
              // If it's still before start date, assume it's in the next year
              if (endDateObj < startDateObj) {
                endDateObj.setFullYear(startYear + 1);
              }
              
              // Format the corrected date back to ISO string and extract just the date part
              endDate = endDateObj.toISOString().split('T')[0];
              console.log(`Corrected date range: ${startDate} - ${endDate}`);
            }
          }
          
          // Special case for IPL 2025
          if (item.name && item.name.toLowerCase().includes('2025') && 
              item.name.toLowerCase().includes('indian premier league')) {
            // Ensure IPL 2025 has correct dates
            if (!isStartDateValid || startDateObj.getFullYear() !== 2025) {
              startDate = '2025-03-22';
            }
            if (!isEndDateValid || endDateObj.getFullYear() !== 2025) {
              endDate = '2025-05-26';
            }
            console.log('Applied special case for IPL 2025:', startDate, '-', endDate);
          }
          
          // Get team icons if available
          const teamIcons = [];
          if (item.teams && Array.isArray(item.teams)) {
            // For each team, try to find an icon
            item.teams.forEach(team => {
              // Generate a placeholder icon for the team
              const teamName = team.trim();
              const teamInitial = teamName.charAt(0).toUpperCase();
              
              // For IPL teams, use specific icons
              let teamIcon = '';
              if (teamName.includes('Chennai') || teamName.includes('CSK')) {
                teamIcon = '/assets/images/teams/csk.svg';
              } else if (teamName.includes('Mumbai') || teamName.includes('MI')) {
                teamIcon = '/assets/images/teams/mi.svg';
              } else if (teamName.includes('Bangalore') || teamName.includes('RCB')) {
                teamIcon = '/assets/images/teams/rcb.svg';
              } else if (teamName.includes('Kolkata') || teamName.includes('KKR')) {
                teamIcon = '/assets/images/teams/kkr.svg';
              } else if (teamName.includes('Hyderabad') || teamName.includes('SRH')) {
                teamIcon = '/assets/images/teams/srh.svg';
              } else if (teamName.includes('Delhi') || teamName.includes('DC')) {
                teamIcon = '/assets/images/teams/dc.svg';
              } else if (teamName.includes('Punjab') || teamName.includes('PBKS')) {
                teamIcon = '/assets/images/teams/pbks.svg';
              } else if (teamName.includes('Rajasthan') || teamName.includes('RR')) {
                teamIcon = '/assets/images/teams/rr.svg';
              } else if (teamName.includes('Lucknow') || teamName.includes('LSG')) {
                teamIcon = '/assets/images/teams/lsg.svg';
              } else if (teamName.includes('Gujarat') || teamName.includes('GT')) {
                teamIcon = '/assets/images/teams/gt.svg';
              }
              
              teamIcons.push({
                name: teamName,
                icon: teamIcon,
                initial: teamInitial
              });
            });
          }
          
          return {
            id: item.id,
            name: item.name,
            startDate: startDate,
            endDate: endDate,
            odi: item.odi || 0,
            t20: item.t20 || 0,
            test: item.test || 0,
            status: determineSeriesStatus(startDate, endDate),
            teams: item.teams || [],
            teamIcons: teamIcons
          };
        });
        
        setSeries(formattedSeries);
        setFilteredSeries(formattedSeries);
        console.log(`Loaded ${formattedSeries.length} series from CricAPI`);
      } else {
        console.error('Invalid response format from CricAPI:', response.data);
        setError('Invalid response format from CricAPI');
      }
    } catch (err) {
      console.error('Error fetching series:', err);
      setError('Failed to fetch series data. Please try again later.');
      
      // Try to use mock data as fallback
      tryFallbackData();
    } finally {
      setLoading(false);
    }
  };
  
  // Determine series status based on dates
  const determineSeriesStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return 'upcoming';
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'upcoming';
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };
  
  // Try to use mock data as fallback
  const tryFallbackData = () => {
    // Simple mock data for fallback
    const mockSeries = [
      {
        id: 'c75f8952-74d4-416f-b7b4-7da4b4e3ae6e',
        name: 'Indian Premier League 2023',
        startDate: '2023-03-31',
        endDate: '2023-05-28',
        odi: 0,
        t20: 74,
        test: 0,
        status: 'completed',
        teams: ['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bangalore', 'Delhi Capitals']
      },
      {
        id: 'f370a5cc-8fe0-4b62-9cff-78498c9d6e0d',
        name: 'ICC Cricket World Cup 2023',
        startDate: '2023-10-05',
        endDate: '2023-11-19',
        odi: 48,
        t20: 0,
        test: 0,
        status: 'completed',
        teams: ['India', 'Australia', 'England', 'New Zealand']
      },
      {
        id: '9d1d85bf-e3b7-4f1a-b7d5-74f2f37c1b4c',
        name: 'Indian Premier League 2024',
        startDate: '2024-03-22',
        endDate: '2024-05-26',
        odi: 0,
        t20: 74,
        test: 0,
        status: 'ongoing',
        teams: ['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bangalore', 'Delhi Capitals']
      }
    ];
    
    setSeries(mockSeries);
    setFilteredSeries(mockSeries);
    console.log('Using mock series data as fallback');
  };

  const handleSeriesSelect = (series) => {
    console.log('Series selected:', series);
    // Generate a slug from the series name only
    const slug = generateSlug(series.name);
    // Store the complete series data in sessionStorage for retrieval
    sessionStorage.setItem(`series_${slug}`, JSON.stringify(series));
    console.log('Stored series data for slug:', slug);
    console.log('Navigating to:', `/series/${slug}`);
    navigate(`/series/${slug}`);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <SeriesContainer>
      <SeriesHeader>
        <h1>Cricket Series</h1>
        <SearchFilterContainer>
          <SearchBar>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <SearchInput 
              type="text" 
              placeholder="Search series..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchBar>
          <FilterButtons>
            <FilterButton 
              active={activeFilter === 'all'} 
              onClick={() => handleFilterChange('all')}
            >
              All
            </FilterButton>
            <FilterButton 
              active={activeFilter === 'ongoing'} 
              onClick={() => handleFilterChange('ongoing')}
            >
              Ongoing
            </FilterButton>
            <FilterButton 
              active={activeFilter === 'upcoming'} 
              onClick={() => handleFilterChange('upcoming')}
            >
              Upcoming
            </FilterButton>
            <FilterButton 
              active={activeFilter === 'completed'} 
              onClick={() => handleFilterChange('completed')}
            >
              Completed
            </FilterButton>
          </FilterButtons>
        </SearchFilterContainer>
      </SeriesHeader>

      <SeriesContent>
        {loading ? (
          <LoadingContainer>
            <LoadingSpinner />
            <p>Loading series data...</p>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorIcon />
            <p>{error}</p>
            <RetryButton onClick={fetchSeries}>Retry</RetryButton>
          </ErrorContainer>
        ) : filteredSeries.length === 0 ? (
          <NoResultsContainer>
            <p>No series found matching your criteria.</p>
          </NoResultsContainer>
        ) : (
          <SeriesGrid>
            {filteredSeries.map(series => (
              <SeriesCard 
                key={series.id} 
                onClick={() => handleSeriesSelect(series)}
                status={series.status}
              >
                <SeriesName>{series.name}</SeriesName>
                <SeriesDetails>
                  <SeriesDate>
                    <CalendarIcon />
                    {new Date(series.startDate).toLocaleDateString()} - {new Date(series.endDate).toLocaleDateString()}
                  </SeriesDate>
                  <SeriesMatchTypes>
                    {series.t20 > 0 && (
                      <MatchTypeTag>
                        <CricketIcon />
                        T20: {series.t20}
                      </MatchTypeTag>
                    )}
                    {series.odi > 0 && (
                      <MatchTypeTag>
                        <CricketIcon />
                        ODI: {series.odi}
                      </MatchTypeTag>
                    )}
                    {series.test > 0 && (
                      <MatchTypeTag>
                        <CricketIcon />
                        Test: {series.test}
                      </MatchTypeTag>
                    )}
                  </SeriesMatchTypes>
                  
                  {/* Display team icons */}
                  {series.teamIcons && series.teamIcons.length > 0 && (
                    <TeamIconsContainer>
                      {series.teamIcons.slice(0, 4).map((team, index) => (
                        <TeamIcon key={index}>
                          {team.icon ? (
                            <img src={team.icon} alt={team.name} />
                          ) : (
                            team.initial
                          )}
                        </TeamIcon>
                      ))}
                      {series.teamIcons.length > 4 && (
                        <TeamIcon>+{series.teamIcons.length - 4}</TeamIcon>
                      )}
                    </TeamIconsContainer>
                  )}
                </SeriesDetails>
                <SeriesStatus status={series.status}>
                  {series.status.charAt(0).toUpperCase() + series.status.slice(1)}
                </SeriesStatus>
              </SeriesCard>
            ))}
          </SeriesGrid>
        )}
      </SeriesContent>
    </SeriesContainer>
  );
};

// Styled components
const SeriesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const SeriesHeader = styled.div`
  margin-bottom: 20px;
  
  h1 {
    color: ${theme.colors.primary};
    margin-bottom: 20px;
  }
`;

const SearchFilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const SearchBar = styled.div`
  position: relative;
  width: 100%;
  
  @media (min-width: 768px) {
    width: 300px;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SearchIcon = styled.div`
  width: 14px;
  height: 14px;
  background-color: ${theme.colors.darkGray};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
  }
`;

const FilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.active ? theme.colors.primary : '#f5f5f5'};
  color: ${props => props.active ? 'white' : theme.colors.text};
  border: 1px solid ${props => props.active ? theme.colors.primary : '#ddd'};
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.active ? theme.colors.primaryDark : '#e0e0e0'};
  }
`;

const SeriesContent = styled.div`
  min-height: 400px;
`;

const SeriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const SeriesCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${theme.shadows.small};
  padding: 20px;
  cursor: pointer;
  transition: ${theme.transitions.default};
  border-left: 5px solid 
    ${props => props.status === 'ongoing' ? theme.colors.series.live.border : 
    props.status === 'upcoming' ? theme.colors.series.upcoming.border : 
    props.status === 'completed' ? theme.colors.series.completed.border : theme.colors.primary};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${theme.shadows.medium};
  }
`;

const SeriesName = styled.h3`
  margin: 0 0 15px 0;
  color: ${theme.colors.primary};
  font-size: 18px;
`;

const SeriesDetails = styled.div`
  margin-bottom: 15px;
`;

const SeriesDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.darkGray};
  margin-bottom: 10px;
  font-size: 14px;
`;

const SeriesMatchTypes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

const MatchTypeTag = styled.span`
  background-color: ${theme.colors.lightGray};
  color: ${theme.colors.primary};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const SeriesStatus = styled.div`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  background-color: ${props => 
    props.status === 'ongoing' ? theme.colors.series.live.bg : 
    props.status === 'upcoming' ? theme.colors.series.upcoming.bg : 
    props.status === 'completed' ? theme.colors.series.completed.bg : theme.colors.lightGray};
  color: ${props => 
    props.status === 'ongoing' ? theme.colors.series.live.text : 
    props.status === 'upcoming' ? theme.colors.series.upcoming.text : 
    props.status === 'completed' ? theme.colors.series.completed.text : theme.colors.text};
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: ${theme.colors.primary};
  gap: 20px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: ${theme.colors.danger};
  gap: 20px;
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: white;
  }
`;

const NoResultsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: ${theme.colors.darkGray};
  font-style: italic;
`;

// Custom icon components
const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${theme.colors.danger};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:before {
    content: "!";
    font-size: 24px;
    font-weight: bold;
  }
`;

const CalendarIcon = styled.div`
  width: 14px;
  height: 14px;
  background-color: ${theme.colors.primary};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

const CricketIcon = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${theme.colors.primary};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3E%3Cpath d='M424.1 40.3c-5.6-7.5-16.3-9-23.8-3.4l-376 280c-7.5 5.6-9 16.3-3.4 23.8l23.5 31.7c5.6 7.5 16.3 9 23.8 3.4l376-280c7.5-5.6 9-16.3 3.4-23.8L424.1 40.3zM227.2 366.3L142.5 304l-47.4 35.4 48.3 64.9c5.4 7.2 15.5 8.7 22.7 3.3l57.9-43.2c7.2-5.4 8.7-15.5 3.3-22.7l-.1 .1 0 0 0 0 0 0 0 0 0 0zM106.9 252.9l167-124.4L322.3 180l-167 124.4L106.9 252.9zM496 352c-44.2 0-80 35.8-80 80s35.8 80 80 80s80-35.8 80-80s-35.8-80-80-80z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

const TeamIconsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const TeamIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-right: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 14px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export default Series;
