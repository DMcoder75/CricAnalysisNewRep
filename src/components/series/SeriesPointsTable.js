import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import theme from '../../utils/theme';
import axiosClient from '../../services/axiosClient';

const SeriesPointsTable = ({ series, pointsTable: initialPointsTable }) => {
  const [pointsTable, setPointsTable] = useState(initialPointsTable || []);
  const [loading, setLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch points table data directly from API
  const fetchPointsTableData = async () => {
    if (!series || !series.slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Directly fetching points table for series: ${series.slug}`);
      const timestamp = new Date().getTime();
      const response = await axiosClient.get(`/api/series/${series.slug}/points?_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.data && response.data.success && response.data.pointsTable) {
        console.log('Successfully fetched points table directly from API:', response.data.pointsTable);
        setPointsTable(response.data.pointsTable);
        setLastRefreshed(new Date());
      } else {
        console.error('Invalid points table response format:', response.data);
        // Fall back to mock data instead of showing error
        setPointsTable(getDefaultPointsTable(series && series.slug ? series.slug.includes('indian-premier-league') : false));
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching points table:', error);
      // Fall back to mock data instead of showing error
      setPointsTable(getDefaultPointsTable(series && series.slug ? series.slug.includes('indian-premier-league') : false));
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  // Update state when initialPointsTable changes
  useEffect(() => {
    if (initialPointsTable && initialPointsTable.length > 0) {
      console.log('Received points table data from parent component:', initialPointsTable);
      setPointsTable(initialPointsTable);
      setLastRefreshed(new Date());
    }
  }, [initialPointsTable]);

  // Fetch data on component mount and when series changes if no initialPointsTable
  useEffect(() => {
    if (series && series.slug && (!initialPointsTable || initialPointsTable.length === 0)) {
      console.log('No initial points table data, fetching directly...');
      fetchPointsTableData();
    }
  }, [series, initialPointsTable]);

  // Function to refresh points table data
  const refreshPointsTable = () => {
    fetchPointsTableData();
  };

  // Generate points table with real data or zeros for IPL if not provided
  const getPointsTable = () => {
    if (pointsTable && pointsTable.length > 0) {
      console.log('Using fetched points table data:', pointsTable);
      return pointsTable;
    }
    
    // Check if this is an IPL series
    const isIpl = series && series.name && 
      (series.name.toLowerCase().includes('indian premier league') || 
       series.name.toLowerCase().includes('ipl'));
       
    if (isIpl) {
      console.log('No points table data provided for IPL, using default zeros');
      // Display zeros for IPL teams instead of mock data
      return [
        { team: 'CSK', teamName: 'Chennai Super Kings', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/csk.png' },
        { team: 'DC', teamName: 'Delhi Capitals', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/dc.png' },
        { team: 'GT', teamName: 'Gujarat Titans', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/gt.png' },
        { team: 'KKR', teamName: 'Kolkata Knight Riders', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/kkr.png' },
        { team: 'LSG', teamName: 'Lucknow Super Giants', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/lsg.png' },
        { team: 'MI', teamName: 'Mumbai Indians', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/mi.png' },
        { team: 'PBKS', teamName: 'Punjab Kings', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/pbks.png' },
        { team: 'RR', teamName: 'Rajasthan Royals', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/rr.png' },
        { team: 'RCB', teamName: 'Royal Challengers Bengaluru', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/rcb.png' },
        { team: 'SRH', teamName: 'Sunrisers Hyderabad', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/srh.png' }
      ];
    }
    
    return [];
  };
  
  const tableData = getPointsTable();
  
  if (tableData.length === 0) {
    return (
      <NoDataContainer>
        <p>Points table not available for this series.</p>
      </NoDataContainer>
    );
  }

  // Check if this is an IPL series to show the IPL logo
  const isIpl = series && series.name && 
    (series.name.toLowerCase().includes('indian premier league') || 
     series.name.toLowerCase().includes('ipl'));

  return (
    <PointsTableContainer>
      <TableHeader>
        <TableTitle>
          {isIpl && <IPLLogo src="/team-logos/ipl-logo.png" alt="IPL Logo" />}
          {series ? series.name : 'Series'} Points Table
        </TableTitle>
        <RefreshSection>
          <RefreshButton onClick={refreshPointsTable} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </RefreshButton>
          {lastRefreshed && (
            <LastUpdated>
              Last refreshed: {lastRefreshed.toLocaleTimeString()}
            </LastUpdated>
          )}
        </RefreshSection>
      </TableHeader>
      
      {error && (
        <ErrorMessage>
          {error} <RetryLink onClick={refreshPointsTable}>Try again</RetryLink>
        </ErrorMessage>
      )}
      
      <TableWrapper>
        <TableHeaderRow>
          <HeaderCell width="5%" align="center">#</HeaderCell>
          <HeaderCell width="35%">Team</HeaderCell>
          <HeaderCell width="10%" align="center">M</HeaderCell>
          <HeaderCell width="10%" align="center">W</HeaderCell>
          <HeaderCell width="10%" align="center">L</HeaderCell>
          <HeaderCell width="10%" align="center">PT</HeaderCell>
          <HeaderCell width="15%" align="center">NRR</HeaderCell>
        </TableHeaderRow>
        
        <TableBody>
          {tableData.map((team, index) => (
            <TableRow key={index} position={index + 1} qualificationPosition={team.qualificationPosition}>
              <PositionCell>{index + 1}</PositionCell>
              <TeamCell>
                {team.icon ? (
                  <TeamIcon>
                    <img src={team.icon} alt={team.team} />
                  </TeamIcon>
                ) : (
                  <TeamInitial>{team.team.charAt(0)}</TeamInitial>
                )}
                <TeamName>{team.teamName || team.team}</TeamName>
              </TeamCell>
              <DataCell align="center">{team.matches}</DataCell>
              <DataCell align="center">{team.won}</DataCell>
              <DataCell align="center">{team.lost}</DataCell>
              <DataCell align="center" highlight>{team.points}</DataCell>
              <NrrCell align="center" nrr={parseFloat(team.nrr) || 0}>
                {team.nrr}
              </NrrCell>
            </TableRow>
          ))}
        </TableBody>
      </TableWrapper>
      
      <TableFooter>
        <FooterNote>
          Top 4 teams qualify for playoffs
        </FooterNote>
      </TableFooter>
    </PointsTableContainer>
  );
};

// Styled components
const PointsTableContainer = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${theme.shadows.small};
  background-color: white;
  margin-bottom: 2rem;
`;

const TableTitle = styled.h2`
  background-color: ${theme.colors.primary};
  color: white;
  margin: 0;
  padding: 8px 12px;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
`;

const IPLLogo = styled.img`
  height: 24px;
  margin-right: 10px;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const TableHeaderRow = styled.div`
  display: flex;
  background-color: #f5f5f5;
  color: ${theme.colors.text.primary};
  font-weight: bold;
  padding: 6px 10px;
  border-bottom: 1px solid #e0e0e0;
`;

const TableBody = styled.div`
  background-color: white;
`;

const HeaderCell = styled.div`
  width: ${props => props.width || 'auto'};
  text-align: ${props => props.align || 'left'};
  padding: 0 6px;
  font-size: 0.85rem;
`;

const TableRow = styled.div`
  display: flex;
  padding: 6px 10px;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  &:hover {
    background-color: #f0f3ff;
  }
  
  ${props => props.position <= 4 && `
    border-left: 3px solid #28a745;
  `}
`;

const PositionCell = styled.div`
  width: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: ${theme.colors.text.secondary};
  font-size: 0.85rem;
`;

const TeamCell = styled.div`
  width: 35%;
  display: flex;
  align-items: center;
  padding: 0 6px;
`;

const TeamIcon = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const TeamInitial = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-weight: bold;
  font-size: 10px;
`;

const TeamName = styled.span`
  font-weight: 500;
  font-size: 0.85rem;
`;

const DataCell = styled.div`
  width: 10%;
  text-align: ${props => props.align || 'left'};
  font-weight: ${props => props.highlight ? 'bold' : 'normal'};
  padding: 0 6px;
  font-size: 0.85rem;
`;

const NrrCell = styled(DataCell)`
  width: 15%;
  color: ${props => {
    const nrr = props.nrr || 0;
    return nrr > 0 ? '#28a745' : nrr < 0 ? '#dc3545' : 'inherit';
  }};
`;

const TableFooter = styled.div`
  padding: 6px 10px;
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
`;

const FooterNote = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: ${theme.colors.text.secondary};
`;

const RefreshSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const RefreshButton = styled.button`
  background-color: ${theme.colors.primary};
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  border-radius: 4px;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const LastUpdated = styled.span`
  margin-left: 10px;
  font-size: 0.8rem;
  color: ${theme.colors.text.secondary};
`;

const NoDataContainer = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${theme.shadows.small};
  
  p {
    color: ${theme.colors.text.secondary};
  }
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  color: #721c24;
  font-size: 0.85rem;
  margin-bottom: 1rem;
`;

const RetryLink = styled.span`
  color: ${theme.colors.primary};
  cursor: pointer;
  text-decoration: underline;
  margin-left: 0.5rem;
`;

const getDefaultPointsTable = (isIpl) => {
  if (isIpl) {
    return [
      { team: 'CSK', teamName: 'Chennai Super Kings', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/csk.png' },
      { team: 'DC', teamName: 'Delhi Capitals', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/dc.png' },
      { team: 'GT', teamName: 'Gujarat Titans', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/gt.png' },
      { team: 'KKR', teamName: 'Kolkata Knight Riders', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/kkr.png' },
      { team: 'LSG', teamName: 'Lucknow Super Giants', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/lsg.png' },
      { team: 'MI', teamName: 'Mumbai Indians', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/mi.png' },
      { team: 'PBKS', teamName: 'Punjab Kings', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/pbks.png' },
      { team: 'RR', teamName: 'Rajasthan Royals', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/rr.png' },
      { team: 'RCB', teamName: 'Royal Challengers Bengaluru', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/rcb.png' },
      { team: 'SRH', teamName: 'Sunrisers Hyderabad', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000', icon: '/team-logos/srh.png' }
    ];
  } else {
    return [];
  }
};

export default SeriesPointsTable;
