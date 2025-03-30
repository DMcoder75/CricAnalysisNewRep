import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../utils/theme';
import axiosClient from '../services/axiosClient';

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin: 0;
`;

const RefreshButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const FilterTabs = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
`;

const FilterTab = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.darkGray};
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MatchCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const MatchStatus = styled.div`
  background-color: ${props => {
    if (props.status === 'live') return props.theme.colors.series.ongoing.bg;
    if (props.status === 'completed') return props.theme.colors.series.completed.bg;
    return props.theme.colors.series.upcoming.bg;
  }};
  color: ${props => {
    if (props.status === 'live') return props.theme.colors.series.ongoing.text;
    if (props.status === 'completed') return props.theme.colors.series.completed.text;
    return props.theme.colors.series.upcoming.text;
  }};
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: bold;
`;

const MatchContent = styled.div`
  padding: 1rem;
`;

const MatchTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  color: ${props => props.theme.colors.darkGray};
`;

const MatchVenueDate = styled.p`
  margin: 0 0 1rem 0;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.darkGray};
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const TeamScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align === 'left' ? 'flex-start' : 'flex-end'};
`;

const TeamNameDisplay = styled.div`
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const Score = styled.div`
  font-size: ${props => props.empty ? '0.75rem' : '1rem'};
  color: ${props => props.empty ? props.theme.colors.darkGray : props.theme.colors.primary};
  font-weight: ${props => props.empty ? 'normal' : 'bold'};
`;

const ViewMatchButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const TeamLogo = styled.div`
  width: 32px;
  height: 32px;
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

const TeamScoreWithLogo = styled.div`
  display: flex;
  align-items: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  background-color: #fff3f3;
  border: 1px solid #ffcccb;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #d32f2f;
  text-align: center;
`;

const NoMatchesMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: ${props => props.theme.colors.darkGray};
`;

const LiveMatches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Function to fetch all matches
  const fetchMatches = async () => {
    try {
      setLoading(true);
      
      // Make a direct request to CricAPI for current matches
      const response = await axiosClient.get('currentMatches?offset=0');
      console.log('CricAPI current matches response:', response);
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        // Transform the CricAPI response to match our expected format
        const matchesData = response.data.data;
        
        // Format the matches data
        const formattedMatches = matchesData.map(match => {
          // Determine match status
          let status = 'upcoming';
          if (match.matchStarted && !match.matchEnded) {
            status = 'live';
          } else if (match.matchEnded) {
            status = 'completed';
          }
          
          return {
            id: match.id,
            title: match.name,
            venue: match.venue || 'TBD',
            date: match.date || match.dateTimeGMT,
            status: status,
            team1: {
              name: match.teams && match.teams[0] ? match.teams[0] : 'Team A',
              shortName: match.teamInfo && match.teamInfo[0] ? match.teamInfo[0].shortname : '',
              score: match.score && match.score[0] ? `${match.score[0].r}/${match.score[0].w} (${match.score[0].o})` : '',
              logo: match.teamInfo && match.teamInfo[0] && match.teamInfo[0].img ? match.teamInfo[0].img : ''
            },
            team2: {
              name: match.teams && match.teams[1] ? match.teams[1] : 'Team B',
              shortName: match.teamInfo && match.teamInfo[1] ? match.teamInfo[1].shortname : '',
              score: match.score && match.score[1] ? `${match.score[1].r}/${match.score[1].w} (${match.score[1].o})` : '',
              logo: match.teamInfo && match.teamInfo[1] && match.teamInfo[1].img ? match.teamInfo[1].img : ''
            }
          };
        });
        
        // Sort matches by date in ascending order
        const sortedMatches = formattedMatches.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          
          // Handle invalid dates
          if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;
          
          return dateA - dateB;
        });
        
        setMatches(sortedMatches);
        console.log(`Loaded and sorted ${sortedMatches.length} matches from CricAPI`);
      } else {
        console.error('Invalid response format from CricAPI:', response.data);
        setError('Invalid response format from CricAPI');
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to fetch matches. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Function to create a slug from match title
  const createMatchSlug = (matchTitle, matchId) => {
    if (!matchTitle) return matchId;
    
    // Convert to lowercase, replace spaces and special characters with hyphens
    const slug = matchTitle
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/\s+/g, '-')      // Replace spaces with hyphens
      .replace(/-+/g, '-');      // Replace multiple hyphens with a single one
    
    // Append the first 8 characters of the ID to ensure uniqueness
    return `${slug}-${matchId.substring(0, 8)}`;
  };
  
  // Fetch matches on component mount
  useEffect(() => {
    fetchMatches();
  }, []);
  
  // Filter matches based on active filter
  const filteredMatches = activeFilter === 'all' 
    ? matches 
    : matches.filter(match => match.status === activeFilter);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Live Cricket Matches</Title>
        <RefreshButton onClick={fetchMatches}>
          Refresh Matches
        </RefreshButton>
      </PageHeader>
      
      <FilterTabs>
        <FilterTab 
          active={activeFilter === 'all'} 
          onClick={() => setActiveFilter('all')}
        >
          All Matches
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'live'} 
          onClick={() => setActiveFilter('live')}
        >
          Live
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'upcoming'} 
          onClick={() => setActiveFilter('upcoming')}
        >
          Upcoming
        </FilterTab>
        <FilterTab 
          active={activeFilter === 'completed'} 
          onClick={() => setActiveFilter('completed')}
        >
          Completed
        </FilterTab>
      </FilterTabs>
      
      {loading ? (
        <LoadingContainer>
          <Spinner />
          <p>Loading matches...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>{error}</ErrorContainer>
      ) : filteredMatches.length === 0 ? (
        <NoMatchesMessage>
          <p>No matches found for the selected filter.</p>
          <p>Try selecting a different filter or check back later.</p>
        </NoMatchesMessage>
      ) : (
        <MatchesGrid>
          {filteredMatches.map(match => (
            <MatchCard key={match.id}>
              <MatchStatus status={match.status}>
                {match.status === 'live' ? 'LIVE' : match.status === 'completed' ? 'COMPLETED' : 'UPCOMING'}
              </MatchStatus>
              
              <MatchContent>
                <MatchTitle>{match.title}</MatchTitle>
                <MatchVenueDate>{match.venue} • {formatDate(match.date)}</MatchVenueDate>
                
                <ScoreContainer>
                  <TeamScore align="left">
                    <TeamScoreWithLogo>
                      <TeamLogo>
                        {match.team1.logo ? (
                          <img src={match.team1.logo} alt={match.team1.name} />
                        ) : (
                          <div className="placeholder-logo">{match.team1.shortName ? match.team1.shortName.charAt(0) : 'T'}</div>
                        )}
                      </TeamLogo>
                      <TeamNameDisplay>{match.team1.shortName || match.team1.name}</TeamNameDisplay>
                    </TeamScoreWithLogo>
                    <Score empty={!match.team1.score}>
                      {match.team1.score || 'Yet to bat'}
                    </Score>
                  </TeamScore>
                  
                  <div style={{ margin: '0 10px', alignSelf: 'center' }}>vs</div>
                  
                  <TeamScore align="right">
                    <TeamScoreWithLogo style={{ justifyContent: 'flex-end' }}>
                      <TeamNameDisplay>{match.team2.shortName || match.team2.name}</TeamNameDisplay>
                      <TeamLogo style={{ marginLeft: '8px', marginRight: '0' }}>
                        {match.team2.logo ? (
                          <img src={match.team2.logo} alt={match.team2.name} />
                        ) : (
                          <div className="placeholder-logo">{match.team2.shortName ? match.team2.shortName.charAt(0) : 'T'}</div>
                        )}
                      </TeamLogo>
                    </TeamScoreWithLogo>
                    <Score empty={!match.team2.score}>
                      {match.team2.score || 'Yet to bat'}
                    </Score>
                  </TeamScore>
                </ScoreContainer>
                
                <Link to={`/match/${createMatchSlug(match.title, match.id)}`} style={{ textDecoration: 'none' }}>
                  <ViewMatchButton>
                    {match.status === 'live' ? 'Watch Live' : match.status === 'completed' ? 'View Summary' : 'View Details'}
                  </ViewMatchButton>
                </Link>
              </MatchContent>
            </MatchCard>
          ))}
        </MatchesGrid>
      )}
    </PageContainer>
  );
};

export default LiveMatches;
