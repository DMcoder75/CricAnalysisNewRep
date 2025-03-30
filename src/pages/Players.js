import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import apiService from '../services/api';

const PlayersContainer = styled.div`
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

const SearchInput = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  min-width: 250px;
  margin-left: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-left: 0;
    width: 100%;
  }
`;

const PlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PlayerCard = styled.div`
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

const PlayerImagePlaceholder = styled.div`
  height: 200px;
  background-color: ${props => props.theme.colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.darkGray};
  font-size: 1.5rem;
`;

const PlayerInfo = styled.div`
  padding: 1.5rem;
`;

const PlayerName = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const PlayerTeam = styled.div`
  color: ${props => props.theme.colors.secondary};
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const PlayerRole = styled.div`
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: 1rem;
`;

const PlayerStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const StatItem = styled.div`
  text-align: center;
  
  .stat-value {
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
    font-size: 1.2rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
    color: ${props => props.theme.colors.darkGray};
  }
`;

const ViewProfileButton = styled(Link)`
  display: block;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-align: center;
  padding: 0.75rem;
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

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Get unique roles from players
  const roles = [...new Set(players.map(player => player.role))];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch teams and players in parallel
        const [teamsResponse, playersResponse] = await Promise.all([
          apiService.getTeams(),
          apiService.getPlayers()
        ]);
        
        setTeams(teamsResponse.data);
        setPlayers(playersResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load players data. Please try again later.');
        setLoading(false);
        console.error('Error fetching players data:', err);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter players based on search and filters
  const filteredPlayers = players.filter(player => {
    // Apply search filter
    if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply team filter
    if (teamFilter && player.teamId !== parseInt(teamFilter)) {
      return false;
    }
    
    // Apply role filter
    if (roleFilter && player.role !== roleFilter) {
      return false;
    }
    
    return true;
  });
  
  // Get team name by ID
  const getTeamName = (teamId) => {
    const team = teams.find(team => team.id === teamId);
    return team ? team.name : 'Unknown Team';
  };
  
  if (loading) {
    return <LoadingMessage>Loading players data...</LoadingMessage>;
  }
  
  return (
    <PlayersContainer>
      <PageHeader>
        <h1>IPL 2025 Players</h1>
        <p>Explore detailed profiles and statistics for all players in the IPL 2025 season.</p>
      </PageHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
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
        
        <div>
          <FilterLabel htmlFor="role-filter">Role:</FilterLabel>
          <FilterSelect 
            id="role-filter" 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </FilterSelect>
        </div>
        
        <SearchInput 
          type="text" 
          placeholder="Search players..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </FiltersSection>
      
      <PlayersGrid>
        {filteredPlayers.map(player => (
          <PlayerCard key={player.id}>
            <PlayerImagePlaceholder>
              {player.name.split(' ').map(n => n[0]).join('')}
            </PlayerImagePlaceholder>
            <PlayerInfo>
              <PlayerName>{player.name}</PlayerName>
              <PlayerTeam>{getTeamName(player.teamId)}</PlayerTeam>
              <PlayerRole>{player.role}</PlayerRole>
              
              <PlayerStats>
                <StatItem>
                  <div className="stat-value">{player.stats.batting.matches}</div>
                  <div className="stat-label">Matches</div>
                </StatItem>
                
                <StatItem>
                  <div className="stat-value">{player.stats.batting.runs}</div>
                  <div className="stat-label">Runs</div>
                </StatItem>
                
                <StatItem>
                  <div className="stat-value">{player.stats.bowling.wickets}</div>
                  <div className="stat-label">Wickets</div>
                </StatItem>
              </PlayerStats>
              
              <ViewProfileButton to={`/players/${player.id}`}>
                View Profile
              </ViewProfileButton>
            </PlayerInfo>
          </PlayerCard>
        ))}
      </PlayersGrid>
      
      {filteredPlayers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p>No players found matching your filters. Try adjusting your search criteria.</p>
        </div>
      )}
    </PlayersContainer>
  );
};

export default Players;
