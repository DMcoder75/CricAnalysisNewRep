import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dbService from '../services/dbService';
import DataSynchronizer from '../components/data/DataSynchronizer';
import { formatMatchDate, formatMatchTime } from '../utils/dataParser';
import theme from '../utils/theme';

const MatchesContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${props => props.theme.colors.darkGray};
  }
`;

const FiltersSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
`;

const FilterLabel = styled.label`
  font-weight: bold;
  margin-right: 0.5rem;
  color: ${props => props.theme.colors.primary};
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  min-width: 150px;
`;

const TabsNav = styled.div`
  display: flex;
  border-bottom: 2px solid ${props => props.theme.colors.lightGray};
  margin-bottom: 1.5rem;
  overflow-x: auto;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.secondary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.secondary : props.theme.colors.darkGray};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
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

const MatchHeader = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MatchDate = styled.div`
  font-weight: bold;
`;

const MatchVenue = styled.div`
  font-size: 0.9rem;
`;

const MatchContent = styled.div`
  padding: 1.5rem;
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const TeamLogo = styled.div`
  width: 80px;
  height: 80px;
  background-color: ${props => props.bgColor || props.theme.colors.lightGray};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  overflow: hidden;
  border: 3px solid ${props => props.borderColor || props.theme.colors.primary};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 8px;
  }
`;

const TeamName = styled.div`
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const VersusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const VersusText = styled.div`
  font-weight: bold;
  color: ${props => props.theme.colors.secondary};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const MatchTime = styled.div`
  color: ${props => props.theme.colors.darkGray};
  font-size: 0.9rem;
`;

const MatchStatus = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.secondary};
`;

const MatchActions = styled.div`
  display: flex;
  justify-content: center;
`;

const ViewMatchButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #001F3B;
    text-decoration: none;
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.darkGray};
`;

const ErrorMessage = styled.div`
  background-color: #FEE;
  color: ${props => props.theme.colors.secondary};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const NoMatchesMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [teamFilter, setTeamFilter] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const loadMatchData = async () => {
    try {
      setLoading(true);
      
      // Fetch teams and matches from the database
      const [dbTeams, dbMatches] = await Promise.all([
        dbService.getAllTeams(),
        dbService.getAllMatches()
      ]);
      
      // If no teams found, use default teams from mock data
      if (!dbTeams || dbTeams.length === 0) {
        const defaultTeams = [
          { id: 1, name: 'Mumbai Indians', shortName: 'MI', color: '#004BA0' },
          { id: 2, name: 'Chennai Super Kings', shortName: 'CSK', color: '#FFFF00' },
          { id: 3, name: 'Royal Challengers Bangalore', shortName: 'RCB', color: '#EC1C24' },
          { id: 4, name: 'Kolkata Knight Riders', shortName: 'KKR', color: '#3A225D' },
          { id: 5, name: 'Delhi Capitals', shortName: 'DC', color: '#0078BC' },
          { id: 6, name: 'Punjab Kings', shortName: 'PBKS', color: '#ED1B24' },
          { id: 7, name: 'Rajasthan Royals', shortName: 'RR', color: '#FF1493' },
          { id: 8, name: 'Sunrisers Hyderabad', shortName: 'SRH', color: '#FF822A' },
          { id: 9, name: 'Gujarat Titans', shortName: 'GT', color: '#1D428A' },
          { id: 10, name: 'Lucknow Super Giants', shortName: 'LSG', color: '#A72056' }
        ];
        setTeams(defaultTeams);
        
        // Store the default teams in the database for future use
        await dbService.storeTeams(defaultTeams);
      } else {
        setTeams(dbTeams);
      }
      
      setMatches(dbMatches || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load matches data. Please try again later.');
      setLoading(false);
      console.error('Error fetching matches data:', err);
    }
  };
  
  useEffect(() => {
    loadMatchData();
  }, []);
  
  // Handle sync completion
  const handleSyncComplete = (updatedMatches) => {
    setMatches(updatedMatches);
    setLoading(false);
  };
  
  // Filter matches based on filters and active tab
  const filteredMatches = matches.filter(match => {
    // Apply team filter
    if (teamFilter && match.homeTeamId !== parseInt(teamFilter) && match.awayTeamId !== parseInt(teamFilter)) {
      return false;
    }
    
    // Apply tab filter (upcoming, completed, all)
    if (activeTab === 'upcoming' && match.status !== 'Upcoming') {
      return false;
    }
    
    if (activeTab === 'completed' && match.status === 'Upcoming') {
      return false;
    }
    
    return true;
  });
  
  // Get team name by ID
  const getTeamName = (teamId) => {
    const team = teams.find(team => team.id === teamId);
    return team ? team.name : `Team #${teamId}`;
  };
  
  // Get team short name by ID
  const getTeamShortName = (teamId) => {
    const team = teams.find(team => team.id === teamId);
    return team ? team.shortName : `T${teamId}`;
  };
  
  // Get team color by ID
  const getTeamColor = (teamId) => {
    const team = teams.find(team => team.id === teamId);
    return team ? team.color : null;
  };
  
  // Get team logo path by team short name
  const getTeamLogoPath = (teamId) => {
    const team = teams.find(team => team.id === teamId);
    if (!team) return '';
    
    const shortName = team.shortName;
    const logoFilename = theme.TEAM_LOGO_MAP[shortName] || 'default.svg';
    return `${process.env.PUBLIC_URL}${theme.ASSETS_PATH.TEAMS}${logoFilename}`;
  };
  
  return (
    <MatchesContainer>
      <PageHeader>
        <h1>Crichattric Matches</h1>
        <p>View schedule, results, and detailed analytics for all matches in the IPL 2025 season.</p>
      </PageHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {/* Data Synchronization Component */}
      <DataSynchronizer onSyncComplete={handleSyncComplete} />
      
      <FiltersSection>
        <div>
          <FilterLabel htmlFor="team-filter">Team:</FilterLabel>
          <FilterSelect 
            id="team-filter" 
            value={teamFilter} 
            onChange={(e) => setTeamFilter(e.target.value)}
          >
            <option value="">All Teams</option>
            {teams.map(team => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </FilterSelect>
        </div>
      </FiltersSection>
      
      <TabsNav>
        <TabButton 
          active={activeTab === 'upcoming'} 
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Matches
        </TabButton>
        <TabButton 
          active={activeTab === 'completed'} 
          onClick={() => setActiveTab('completed')}
        >
          Completed Matches
        </TabButton>
        <TabButton 
          active={activeTab === 'all'} 
          onClick={() => setActiveTab('all')}
        >
          All Matches
        </TabButton>
      </TabsNav>
      
      {loading ? (
        <LoadingMessage>Loading matches data...</LoadingMessage>
      ) : filteredMatches.length > 0 ? (
        <MatchesGrid>
          {filteredMatches.map(match => (
            <MatchCard key={match.id}>
              <MatchHeader>
                <MatchDate>{formatMatchDate(match.date)}</MatchDate>
                <MatchVenue>{match.venue}</MatchVenue>
              </MatchHeader>
              <MatchContent>
                <TeamsContainer>
                  <TeamInfo>
                    <TeamLogo 
                      bgColor="#FFFFFF" 
                      borderColor={getTeamColor(match.homeTeamId)}
                    >
                      <img 
                        src={getTeamLogoPath(match.homeTeamId)} 
                        alt={getTeamName(match.homeTeamId)} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.textContent = getTeamShortName(match.homeTeamId);
                        }}
                      />
                    </TeamLogo>
                    <TeamName>{getTeamName(match.homeTeamId)}</TeamName>
                    {match.status === 'Completed' && (
                      <div>{match.homeTeamScore}</div>
                    )}
                  </TeamInfo>
                  
                  <VersusContainer>
                    <VersusText>VS</VersusText>
                    <MatchTime>{formatMatchTime(match.date)}</MatchTime>
                  </VersusContainer>
                  
                  <TeamInfo>
                    <TeamLogo 
                      bgColor="#FFFFFF" 
                      borderColor={getTeamColor(match.awayTeamId)}
                    >
                      <img 
                        src={getTeamLogoPath(match.awayTeamId)} 
                        alt={getTeamName(match.awayTeamId)} 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.textContent = getTeamShortName(match.awayTeamId);
                        }}
                      />
                    </TeamLogo>
                    <TeamName>{getTeamName(match.awayTeamId)}</TeamName>
                    {match.status === 'Completed' && (
                      <div>{match.awayTeamScore}</div>
                    )}
                  </TeamInfo>
                </TeamsContainer>
                
                <MatchStatus>
                  {match.result || match.status}
                </MatchStatus>
                
                <MatchActions>
                  <ViewMatchButton to={`/matches/${match.id}`}>
                    {match.status === 'Upcoming' ? 'Match Details' : 'View Scorecard'}
                  </ViewMatchButton>
                </MatchActions>
              </MatchContent>
            </MatchCard>
          ))}
        </MatchesGrid>
      ) : (
        <NoMatchesMessage>
          No matches found matching your filters.
        </NoMatchesMessage>
      )}
    </MatchesContainer>
  );
};

export default Matches;
