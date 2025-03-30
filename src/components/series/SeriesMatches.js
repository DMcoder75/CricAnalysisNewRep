import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../../utils/theme';
import axiosClient from '../../services/axiosClient';

const SeriesMatches = ({ seriesId: propSeriesId }) => {
  const navigate = useNavigate();
  const { seriesId: paramSeriesId, slug, uuid } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  // Get the actual series ID to use
  const getActualSeriesId = () => {
    // First try to use the prop if provided
    if (propSeriesId) return propSeriesId;
    
    // Otherwise use the URL parameter
    return paramSeriesId || slug || uuid;
  };

  useEffect(() => {
    fetchMatches();
  }, [propSeriesId, paramSeriesId, slug, uuid]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const actualSeriesId = getActualSeriesId();
      console.log('Fetching matches for series ID:', actualSeriesId);
      
      // Make a direct request to CricAPI for series info which includes matches
      const response = await axiosClient.get(`series_info?id=${actualSeriesId}`);
      console.log('CricAPI series_info response:', response);
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        // Extract the matchList from the response
        const seriesData = response.data.data;
        
        if (seriesData.matchList && Array.isArray(seriesData.matchList)) {
          // Format the matches data
          const formattedMatches = seriesData.matchList.map(match => {
            // Extract team info if available
            const teamInfo = match.teamInfo || [];
            const team1Info = teamInfo[0] || {};
            const team2Info = teamInfo[1] || {};
            
            return {
              id: match.id,
              name: match.name || `${match.teams?.[0] || 'Team A'} vs ${match.teams?.[1] || 'Team B'}`,
              status: match.status || 'upcoming',
              venue: match.venue || 'TBD',
              date: match.date || match.dateTimeGMT,
              teams: match.teams || [],
              matchType: match.matchType || 'T20',
              matchStarted: match.matchStarted || false,
              matchEnded: match.matchEnded || false,
              team1: {
                name: match.teams && match.teams[0] ? match.teams[0] : 'Team A',
                shortName: team1Info.shortname || '',
                logo: team1Info.img || getTeamLogo(match.teams && match.teams[0] ? match.teams[0] : '')
              },
              team2: {
                name: match.teams && match.teams[1] ? match.teams[1] : 'Team B',
                shortName: team2Info.shortname || '',
                logo: team2Info.img || getTeamLogo(match.teams && match.teams[1] ? match.teams[1] : '')
              }
            };
          });
          
          // Sort matches by date in ascending order
          const sortedMatches = formattedMatches.sort((a, b) => {
            // Convert dates to comparable format
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            
            // Check if dates are valid
            if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
            if (isNaN(dateA.getTime())) return 1;  // Invalid dates go to the end
            if (isNaN(dateB.getTime())) return -1;
            
            // Sort by date (ascending)
            return dateA - dateB;
          });
          
          setMatches(sortedMatches);
          console.log(`Loaded and sorted ${sortedMatches.length} matches from CricAPI`);
        } else {
          console.error('No matchList found in response:', seriesData);
          setError('No matches found for this series');
        }
      } else {
        console.error('Invalid response format from CricAPI:', response.data);
        setError('Invalid response format from CricAPI');
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to fetch matches data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchSelect = (matchId) => {
    navigate(`/match/${matchId}`);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const filteredMatches = activeFilter === 'all' 
    ? matches 
    : matches.filter(match => match.statusCategory === activeFilter);

  // Helper function to get team logo based on team name
  const getTeamLogo = (teamName) => {
    if (!teamName) return '';
    
    // For IPL teams, use specific icons
    if (teamName.includes('Chennai') || teamName.includes('CSK')) {
      return '/assets/images/teams/csk.svg';
    } else if (teamName.includes('Mumbai') || teamName.includes('MI')) {
      return '/assets/images/teams/mi.svg';
    } else if (teamName.includes('Bangalore') || teamName.includes('RCB')) {
      return '/assets/images/teams/rcb.svg';
    } else if (teamName.includes('Kolkata') || teamName.includes('KKR')) {
      return '/assets/images/teams/kkr.svg';
    } else if (teamName.includes('Hyderabad') || teamName.includes('SRH')) {
      return '/assets/images/teams/srh.svg';
    } else if (teamName.includes('Delhi') || teamName.includes('DC')) {
      return '/assets/images/teams/dc.svg';
    } else if (teamName.includes('Punjab') || teamName.includes('PBKS')) {
      return '/assets/images/teams/pbks.svg';
    } else if (teamName.includes('Rajasthan') || teamName.includes('RR')) {
      return '/assets/images/teams/rr.svg';
    } else if (teamName.includes('Lucknow') || teamName.includes('LSG')) {
      return '/assets/images/teams/lsg.svg';
    } else if (teamName.includes('Gujarat') || teamName.includes('GT')) {
      return '/assets/images/teams/gt.svg';
    }
    
    return '';
  };

  return (
    <MatchesContainer>
      <FilterButtons>
        <FilterButton 
          active={activeFilter === 'all'} 
          onClick={() => handleFilterChange('all')}
        >
          All Matches
        </FilterButton>
        <FilterButton 
          active={activeFilter === 'live'} 
          onClick={() => handleFilterChange('live')}
        >
          Live
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

      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading matches...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <ErrorIcon />
          <p>{error}</p>
          <RetryButton onClick={fetchMatches}>Retry</RetryButton>
        </ErrorContainer>
      ) : filteredMatches.length === 0 ? (
        <NoMatchesContainer>
          <p>No {activeFilter !== 'all' ? activeFilter : ''} matches found for this series.</p>
        </NoMatchesContainer>
      ) : (
        <MatchesList>
          {filteredMatches.map(match => (
            <MatchCard key={match.id} onClick={() => handleMatchSelect(match.id)}>
              <MatchStatus status={match.statusCategory}>{match.status}</MatchStatus>
              
              <TeamsContainer>
                <TeamDisplay>
                  <TeamLogo>
                    {match.team1.logo ? (
                      <img src={match.team1.logo} alt={match.team1.name} />
                    ) : (
                      <div className="placeholder-logo">{match.team1.shortName ? match.team1.shortName.charAt(0) : match.team1.name.charAt(0)}</div>
                    )}
                  </TeamLogo>
                  <span>{match.team1.shortName || match.team1.name}</span>
                </TeamDisplay>
                
                <VersusText>vs</VersusText>
                
                <TeamDisplay style={{ justifyContent: 'flex-end' }}>
                  <span>{match.team2.shortName || match.team2.name}</span>
                  <TeamLogo style={{ marginLeft: '8px', marginRight: '0' }}>
                    {match.team2.logo ? (
                      <img src={match.team2.logo} alt={match.team2.name} />
                    ) : (
                      <div className="placeholder-logo">{match.team2.shortName ? match.team2.shortName.charAt(0) : match.team2.name.charAt(0)}</div>
                    )}
                  </TeamLogo>
                </TeamDisplay>
              </TeamsContainer>
              
              <MatchInfo>
                <MatchVenue>{match.venue}</MatchVenue>
                <MatchDate>{new Date(match.date).toLocaleDateString()}</MatchDate>
              </MatchInfo>
              
              <MatchType>{match.matchType}</MatchType>
            </MatchCard>
          ))}
        </MatchesList>
      )}
    </MatchesContainer>
  );
};

// Styled components
const MatchesContainer = styled.div``;

const FilterButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
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

const MatchesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const MatchCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${theme.shadows.small};
  padding: 15px;
  cursor: pointer;
  transition: ${theme.transitions.default};
  border-left: 4px solid 
    ${props => props.status === 'live' ? theme.colors.series.live.border : 
    props.status === 'upcoming' ? theme.colors.series.upcoming.border : 
    props.status === 'completed' ? theme.colors.series.completed.border : theme.colors.primary};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }
`;

const MatchStatus = styled.span`
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 12px;
  font-weight: 500;
  background-color: ${props => 
    props.status === 'live' ? theme.colors.series.live.bg : 
    props.status === 'upcoming' ? theme.colors.series.upcoming.bg : 
    props.status === 'completed' ? theme.colors.series.completed.bg : '#f5f5f5'};
  color: ${props => 
    props.status === 'live' ? theme.colors.series.live.text : 
    props.status === 'upcoming' ? theme.colors.series.upcoming.text : 
    props.status === 'completed' ? theme.colors.series.completed.text : '#333'};
`;

const TeamsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const TeamDisplay = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const VersusText = styled.div`
  margin: 0 10px;
  color: ${props => props.theme.colors.textSecondary};
  font-weight: bold;
`;

const TeamLogo = styled.div`
  width: 30px;
  height: 30px;
  margin-right: 8px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
  
  .placeholder-logo {
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
`;

const MatchInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
  font-size: 14px;
  color: ${theme.colors.darkGray};
`;

const MatchVenue = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const MatchDate = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const MatchType = styled.div`
  background-color: ${theme.colors.lightGray};
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${theme.colors.darkGray};
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: ${theme.colors.danger};
  text-align: center;
`;

const RetryButton = styled.button`
  margin-top: 15px;
  padding: 8px 16px;
  background-color: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: white;
  }
`;

const NoMatchesContainer = styled.div`
  padding: 30px;
  text-align: center;
  color: ${theme.colors.darkGray};
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${theme.colors.primary};
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
  
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
  margin-bottom: 10px;
  
  &:before {
    content: "!";
    font-size: 24px;
    font-weight: bold;
  }
`;

const CalendarIcon = styled.div`
  width: 14px;
  height: 14px;
  background-color: ${theme.colors.darkGray};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

const LocationIcon = styled.div`
  width: 14px;
  height: 14px;
  background-color: ${theme.colors.darkGray};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'%3E%3Cpath d='M168.3 499.2C116.1 435 0 279.4 0 192C0 85.96 85.96 0 192 0C298 0 384 85.96 384 192C384 279.4 267 435 215.7 499.2C203.4 514.5 180.6 514.5 168.3 499.2H168.3zM192 256C227.3 256 256 227.3 256 192C256 156.7 227.3 128 192 128C156.7 128 128 156.7 128 192C128 227.3 156.7 256 192 256zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

const TrophyIcon = styled.div`
  width: 14px;
  height: 14px;
  background-color: ${theme.colors.primary};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'%3E%3Cpath d='M552 64H448V24c0-13.3-10.7-24-24-24H152c-13.3 0-24 10.7-24 24v40H24C10.7 64 0 74.7 0 88v56c0 35.7 22.5 72.4 61.9 100.7 31.5 22.7 69.8 37.1 110 41.7C203.3 338.5 240 360 240 360v72h-48c-35.3 0-64 20.7-64 56v12c0 6.6 5.4 12 12 12h296c6.6 0 12-5.4 12-12v-12c0-35.3-28.7-56-64-56h-48v-72s36.7-21.5 68.1-73.6c40.3-4.6 78.6-19 110-41.7 39.3-28.3 61.9-65 61.9-100.7V88c0-13.3-10.7-24-24-24zM99.3 192.8C74.9 175.2 64 155.6 64 144v-16h64.2c1 32.6 5.8 61.2 12.8 86.2-15.1-5.2-29.2-12.4-41.7-21.4zM512 144c0 16.1-17.7 36.1-35.3 48.8-12.5 9-26.7 16.2-41.8 21.4 7-25 11.8-53.6 12.8-86.2H512v16z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

const InfoIcon = styled.div`
  width: 14px;
  height: 14px;
  background-color: white;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 128c17.67 0 32 14.33 32 32c0 17.67-14.33 32-32 32S224 177.7 224 160C224 142.3 238.3 128 256 128zM296 384h-80C202.8 384 192 373.3 192 360s10.75-24 24-24h16v-64H224c-13.25 0-24-10.75-24-24S210.8 224 224 224h32c13.25 0 24 10.75 24 24v88h16c13.25 0 24 10.75 24 24S309.3 384 296 384z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

export default SeriesMatches;
