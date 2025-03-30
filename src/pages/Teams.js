import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import dbService from '../services/dbService';
import theme from '../utils/theme';

const TeamsContainer = styled.div`
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

const TeamsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const TeamCard = styled.div`
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

const TeamColorBanner = styled.div`
  height: 8px;
  background-color: ${props => props.color || props.theme.colors.primary};
`;

const TeamLogo = styled.div`
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1rem;
  
  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
  }
`;

const TeamInfo = styled.div`
  padding: 1.5rem;
`;

const TeamName = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
`;

const SeasonLabel = styled.p`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: 1rem;
`;

const TeamStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const StatItem = styled.div`
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

const ViewTeamButton = styled(Link)`
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

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mock team stats (in a real app, this would come from the API)
  const teamStats = {
    1: { matches: 14, wins: 9, titles: 5 },
    2: { matches: 14, wins: 8, titles: 4 },
    3: { matches: 14, wins: 7, titles: 0 },
    4: { matches: 14, wins: 8, titles: 2 },
    5: { matches: 14, wins: 6, titles: 1 },
    6: { matches: 14, wins: 6, titles: 1 },
    7: { matches: 14, wins: 7, titles: 1 },
    8: { matches: 14, wins: 6, titles: 1 },
    9: { matches: 14, wins: 8, titles: 1 },
    10: { matches: 14, wins: 7, titles: 0 }
  };
  
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const teamsData = await dbService.getAllTeams();
        setTeams(teamsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load teams data. Please try again later.');
        setLoading(false);
        console.error('Error fetching teams data:', err);
      }
    };
    
    fetchTeams();
  }, []);
  
  // Function to get team logo path
  const getTeamLogoPath = (teamShortName) => {
    const logoFilename = theme.TEAM_LOGO_MAP[teamShortName] || 'default.png';
    return `${process.env.PUBLIC_URL}${theme.ASSETS_PATH.TEAMS}${logoFilename}`;
  };
  
  if (loading) {
    return <LoadingMessage>Loading teams data...</LoadingMessage>;
  }
  
  return (
    <TeamsContainer>
      <PageHeader>
        <h1>IPL 2025 Teams</h1>
        <p>Explore detailed profiles and statistics for all teams in the IPL 2025 season.</p>
      </PageHeader>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <TeamsGrid>
        {teams.map(team => (
          <TeamCard key={team.id}>
            <TeamColorBanner color={team.color} />
            <TeamLogo>
              <img 
                src={getTeamLogoPath(team.shortName)} 
                alt={`${team.name} logo`} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = team.shortName;
                }}
              />
            </TeamLogo>
            <TeamInfo>
              <TeamName>{team.name}</TeamName>
              
              <SeasonLabel>IPL 2024 Stats</SeasonLabel>
              
              <TeamStats>
                <StatItem>
                  <div className="stat-value">{teamStats[team.id]?.matches || 0}</div>
                  <div className="stat-label">Matches</div>
                </StatItem>
                <StatItem>
                  <div className="stat-value">{teamStats[team.id]?.wins || 0}</div>
                  <div className="stat-label">Wins</div>
                </StatItem>
                <StatItem>
                  <div className="stat-value">{((teamStats[team.id]?.wins / teamStats[team.id]?.matches) * 100).toFixed(1)}%</div>
                  <div className="stat-label">Win Rate</div>
                </StatItem>
                <StatItem>
                  <div className="stat-value">{teamStats[team.id]?.titles || 0}</div>
                  <div className="stat-label">Titles</div>
                </StatItem>
              </TeamStats>
              
              <ViewTeamButton to={`/teams/${team.id}`}>
                Team Profile
              </ViewTeamButton>
            </TeamInfo>
          </TeamCard>
        ))}
      </TeamsGrid>
    </TeamsContainer>
  );
};

export default Teams;
