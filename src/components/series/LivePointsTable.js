import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import apiService from '../../services/api';
import axiosClient from '../../services/axiosClient';
import { FaSpinner, FaSync } from 'react-icons/fa';

const LivePointsTableContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background-color: #0f3e82; /* IPL blue color */
  padding: 15px;
  border-radius: 6px;
  color: white;
`;

const TableTitle = styled.h2`
  font-size: 1.5rem;
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IPLLogo = styled.img`
  height: 32px;
  width: auto;
`;

const RefreshSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RefreshButton = styled.button`
  background-color: #ffffff;
  color: #0f3e82;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  font-weight: bold;
  
  &:hover {
    background-color: #f0f0f0;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    color: #666666;
  }
`;

const LastUpdated = styled.span`
  font-size: 0.8rem;
  color: #e0e0e0;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background-color: #f4f4f4;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &:hover {
    background-color: #f0f7ff;
  }
`;

const TableHeaderCell = styled.th`
  padding: 12px 8px;
  text-align: ${props => props.align || 'left'};
  font-weight: 600;
  color: #444;
  border-bottom: 2px solid #ddd;
`;

const TableCell = styled.td`
  padding: 12px 8px;
  text-align: ${props => props.align || 'left'};
  border-bottom: 1px solid #ddd;
`;

const TeamCell = styled.td`
  padding: 12px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #ddd;
`;

const TeamLogo = styled.img`
  width: 30px;
  height: 30px;
  object-fit: contain;
`;

const TeamName = styled.span`
  font-weight: 500;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
`;

const ErrorContainer = styled.div`
  padding: 20px;
  text-align: center;
  color: #d32f2f;
`;

const LivePointsTable = ({ seriesId }) => {
  const [pointsTable, setPointsTable] = useState([]);
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  // CricAPI configuration
  const CRICAPI_KEY = '1f2ad458-2220-4a94-888b-59b78221920b';
  const IPL_SERIES_ID = 'd5a498c8-7596-4b93-8ab0-e0efc3345312';
  
  // Determine if this is an IPL series
  const isIpl = seriesId && (
    seriesId === 'indian-premier-league-2025' || 
    seriesId === 'ipl-2025' ||
    seriesId === 'd5a498c8-7596-4b93-8ab0-e0efc3345312' ||
    seriesId.toLowerCase().includes('ipl') || 
    seriesId.toLowerCase().includes('indian-premier-league')
  );
  
  // Get the series slug - for API calls, we need a consistent format
  const seriesSlug = isIpl ? 'indian-premier-league-2025' : seriesId;
  
  // Helper function to get mock points table data
  const getMockPointsTable = (isIplSeries) => {
    if (isIplSeries) {
      return [
        { team: 'CSK', teamName: 'Chennai Super Kings', matches: 1, won: 1, lost: 0, draw: 0, points: 2, nrr: '+0.500', icon: 'https://g.cricapi.com/iapi/135-637852956181378533.png?w=48' },
        { team: 'DC', teamName: 'Delhi Capitals', matches: 1, won: 1, lost: 0, draw: 0, points: 2, nrr: '+0.400', icon: 'https://g.cricapi.com/iapi/148-637874596301457910.png?w=48' },
        { team: 'PBKS', teamName: 'Punjab Kings', matches: 1, won: 1, lost: 0, draw: 0, points: 2, nrr: '+0.300', icon: 'https://g.cricapi.com/iapi/247-637852956959778791.png?w=48' },
        { team: 'RCB', teamName: 'Royal Challengers Bengaluru', matches: 1, won: 1, lost: 0, draw: 0, points: 2, nrr: '+0.200', icon: 'https://g.cricapi.com/iapi/21439-638468478038395955.jpg?w=48' },
        { team: 'KKR', teamName: 'Kolkata Knight Riders', matches: 2, won: 1, lost: 1, draw: 0, points: 2, nrr: '+0.100', icon: 'https://g.cricapi.com/iapi/206-637852958714346149.png?w=48' },
        { team: 'LSG', teamName: 'Lucknow Super Giants', matches: 2, won: 1, lost: 1, draw: 0, points: 2, nrr: '+0.000', icon: 'https://g.cricapi.com/iapi/215-637876059669009476.png?w=48' },
        { team: 'SRH', teamName: 'Sunrisers Hyderabad', matches: 2, won: 1, lost: 1, draw: 0, points: 2, nrr: '-0.100', icon: 'https://g.cricapi.com/iapi/279-637852957609490368.png?w=48' },
        { team: 'GT', teamName: 'Gujarat Titans', matches: 1, won: 0, lost: 1, draw: 0, points: 0, nrr: '-0.200', icon: 'https://g.cricapi.com/iapi/172-637852957798476823.png?w=48' },
        { team: 'MI', teamName: 'Mumbai Indians', matches: 1, won: 0, lost: 1, draw: 0, points: 0, nrr: '-0.300', icon: 'https://g.cricapi.com/iapi/226-637852956375593901.png?w=48' },
        { team: 'RR', teamName: 'Rajasthan Royals', matches: 2, won: 0, lost: 2, draw: 0, points: 0, nrr: '-0.400', icon: 'https://g.cricapi.com/iapi/251-637852956607161886.png?w=48' }
      ];
    } else {
      // Default mock data for non-IPL series
      return [
        { team: 'Team A', teamName: 'Team Alpha', matches: 5, won: 4, lost: 1, draw: 0, points: 8, nrr: '+1.256', icon: 'https://g.cricapi.com/iapi/135-637852956181378533.png?w=48' },
        { team: 'Team B', teamName: 'Team Beta', matches: 5, won: 3, lost: 2, draw: 0, points: 6, nrr: '+0.978', icon: 'https://g.cricapi.com/iapi/148-637874596301457910.png?w=48' },
        { team: 'Team C', teamName: 'Team Charlie', matches: 5, won: 3, lost: 2, draw: 0, points: 6, nrr: '+0.800', icon: 'https://g.cricapi.com/iapi/247-637852956959778791.png?w=48' },
        { team: 'Team D', teamName: 'Team Delta', matches: 5, won: 2, lost: 3, draw: 0, points: 4, nrr: '-0.436', icon: 'https://g.cricapi.com/iapi/206-637852958714346149.png?w=48' }
      ];
    }
  };
  
  const fetchLivePointsTable = async () => {
    try {
      setRefreshing(true);
      
      // Try direct CricAPI call first
      try {
        console.log('Fetching points table directly from CricAPI...');
        const response = await axiosClient.get('https://api.cricapi.com/v1/series_points', {
          params: {
            apikey: CRICAPI_KEY,
            id: IPL_SERIES_ID
          }
        });
        
        console.log('CricAPI Response:', response.data);
        
        if (response.data && response.data.status === 'success' && response.data.data) {
          // Transform API data to match our format
          const formattedData = response.data.data.map(team => ({
            team: team.shortname,
            teamName: team.teamname,
            matches: team.matches,
            won: team.wins,
            lost: team.loss,
            draw: team.ties,
            points: team.wins * 2, // 2 points per win
            nrr: '0.000', // API doesn't provide NRR
            icon: team.img
          }));
          
          console.log('Formatted points table data:', formattedData);
          
          // Cache the data in sessionStorage
          sessionStorage.setItem('pointsTable', JSON.stringify(formattedData));
          sessionStorage.setItem('pointsTableLastUpdated', new Date().toLocaleString());
          
          setPointsTable(formattedData);
          setSeries({
            name: 'Indian Premier League 2025',
            slug: 'indian-premier-league-2025'
          });
          setLastUpdated(new Date().toLocaleString());
          setError(null);
          setLoading(false);
          setRefreshing(false);
          return;
        }
        throw new Error('Invalid API response format');
      } catch (directApiError) {
        console.error('Error fetching directly from CricAPI:', directApiError);
        
        // Fall back to server API
        try {
          console.log('Falling back to server API...');
          const response = await apiService.fetchLivePointsTable(seriesSlug);
          
          if (response && response.success && response.pointsTable && response.pointsTable.length > 0) {
            console.log('Successfully fetched live points table from server:', response.pointsTable);
            setPointsTable(response.pointsTable);
            setSeries(response.series);
            setLastUpdated(response.lastUpdated || new Date().toLocaleString());
            setError(null);
          } else {
            console.error('Failed to fetch live points table from server:', response);
            
            // Fall back to session storage
            const cachedData = sessionStorage.getItem('pointsTable');
            if (cachedData) {
              console.log('Using cached points table data from session storage');
              const parsedData = JSON.parse(cachedData);
              setPointsTable(parsedData);
              setSeries({
                name: 'Indian Premier League 2025',
                slug: 'indian-premier-league-2025'
              });
              setLastUpdated(sessionStorage.getItem('pointsTableLastUpdated') || new Date().toLocaleString());
              setError(null);
            } else {
              // Last resort: use mock data
              console.log('Using mock points table data');
              const mockData = getMockPointsTable(isIpl);
              setPointsTable(mockData);
              setSeries({
                name: 'Indian Premier League 2025',
                slug: 'indian-premier-league-2025'
              });
              setLastUpdated(new Date().toLocaleString());
              setError('Using offline data. Please check your connection.');
            }
          }
        } catch (serverApiError) {
          console.error('Error fetching from server API:', serverApiError);
          
          // Fall back to session storage
          const cachedData = sessionStorage.getItem('pointsTable');
          if (cachedData) {
            console.log('Using cached points table data from session storage');
            const parsedData = JSON.parse(cachedData);
            setPointsTable(parsedData);
            setSeries({
              name: 'Indian Premier League 2025',
              slug: 'indian-premier-league-2025'
            });
            setLastUpdated(sessionStorage.getItem('pointsTableLastUpdated') || new Date().toLocaleString());
            setError(null);
          } else {
            // Last resort: use mock data
            console.log('Using mock points table data');
            const mockData = getMockPointsTable(isIpl);
            setPointsTable(mockData);
            setSeries({
              name: 'Indian Premier League 2025',
              slug: 'indian-premier-league-2025'
            });
            setLastUpdated(new Date().toLocaleString());
            setError('Using offline data. Please check your connection.');
          }
        }
      }
    } catch (error) {
      console.error('Error in fetchLivePointsTable:', error);
      setError('Failed to fetch points table. Please try again later.');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLivePointsTable();
  }, [seriesSlug]);
  
  const handleRefresh = () => {
    setLoading(true);
    fetchLivePointsTable();
  };
  
  if (loading && !refreshing) {
    return (
      <LivePointsTableContainer>
        <TableHeader>
          <TableTitle>
            {isIpl && <IPLLogo src="/assets/images/ipl-logo.jpg" alt="IPL Logo" />}
            Live Points Table
          </TableTitle>
        </TableHeader>
        <LoadingContainer>
          <FaSpinner size={30} style={{ animation: 'spin 1s linear infinite' }} />
        </LoadingContainer>
      </LivePointsTableContainer>
    );
  }
  
  if (error && !refreshing) {
    return (
      <LivePointsTableContainer>
        <TableHeader>
          <TableTitle>
            {isIpl && <IPLLogo src="/assets/images/ipl-logo.jpg" alt="IPL Logo" />}
            Live Points Table
          </TableTitle>
        </TableHeader>
        <ErrorContainer>
          <p>{error}</p>
          <RefreshButton onClick={handleRefresh}>
            <FaSync /> Try Again
          </RefreshButton>
        </ErrorContainer>
      </LivePointsTableContainer>
    );
  }
  
  return (
    <LivePointsTableContainer>
      <TableHeader>
        <TableTitle>
          {isIpl && <IPLLogo src="/assets/images/ipl-logo.jpg" alt="IPL Logo" />}
          {series ? series.name : 'Series'} Live Points Table
        </TableTitle>
        <RefreshSection>
          {lastUpdated && <LastUpdated>Last updated: {lastUpdated}</LastUpdated>}
          <RefreshButton onClick={handleRefresh} disabled={refreshing}>
            {refreshing ? <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> : <FaSync />} 
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </RefreshButton>
        </RefreshSection>
      </TableHeader>
      
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Team</TableHeaderCell>
            <TableHeaderCell align="center">M</TableHeaderCell>
            <TableHeaderCell align="center">W</TableHeaderCell>
            <TableHeaderCell align="center">L</TableHeaderCell>
            <TableHeaderCell align="center">T</TableHeaderCell>
            <TableHeaderCell align="center">NR</TableHeaderCell>
            <TableHeaderCell align="center">Pts</TableHeaderCell>
            <TableHeaderCell align="center">NRR</TableHeaderCell>
          </TableRow>
        </TableHead>
        <tbody>
          {pointsTable.map((team, index) => (
            <TableRow key={index}>
              <TeamCell>
                <TeamLogo 
                  src={team.icon.startsWith('http') ? team.icon : `/team-logos/${team.team.toLowerCase()}.png`} 
                  alt={team.teamName} 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `/team-logos/${team.team.toLowerCase()}.png`;
                  }}
                />
                <TeamName>{team.teamName}</TeamName>
              </TeamCell>
              <TableCell align="center">{team.matches}</TableCell>
              <TableCell align="center">{team.won}</TableCell>
              <TableCell align="center">{team.lost}</TableCell>
              <TableCell align="center">{team.draw || 0}</TableCell>
              <TableCell align="center">{team.noResult || 0}</TableCell>
              <TableCell align="center">{team.points}</TableCell>
              <TableCell align="center">{team.nrr}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </LivePointsTableContainer>
  );
};

export default LivePointsTable;
