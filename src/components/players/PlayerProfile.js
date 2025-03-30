import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import dbService from '../../services/dbService';
import theme from '../../utils/theme';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BreadcrumbNav = styled.div`
  margin-bottom: 1.5rem;
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 0.5rem;
    color: ${props => props.theme.colors.darkGray};
  }
`;

const ErrorMessage = styled.div`
  background-color: #FEE;
  color: #D00;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin: 2rem auto;
  max-width: 600px;
  
  h2 {
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  a {
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
    }
  }
`;

const PlayerHeader = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 2rem;
  background: linear-gradient(to right, ${props => props.bgColor || props.theme.colors.primary}, ${props => props.bgColor || props.theme.colors.primary}CC);
  border-radius: 12px;
  padding: 2rem;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
`;

const PlayerImageContainer = styled.div`
  width: 250px;
  height: 300px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
  margin-right: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
`;

const PlayerInfo = styled.div`
  flex: 1;
`;

const PlayerName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const PlayerRole = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  opacity: 0.9;
  font-weight: 400;
`;

const TeamBadge = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  margin-bottom: 1.5rem;
  text-decoration: none;
  color: white;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
    color: white;
  }
  
  img {
    width: 24px;
    height: 24px;
    margin-right: 0.5rem;
    border-radius: 50%;
    background-color: white;
  }
`;

const PlayerDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

const DetailItem = styled.div`
  .label {
    font-size: 0.8rem;
    opacity: 0.8;
    margin-bottom: 0.25rem;
  }
  
  .value {
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const TabsContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  margin-bottom: 2rem;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.lightGray};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.darkGray};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding-left: 1rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const StatsCardTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1rem;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
`;

const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  }
  
  th {
    color: ${props => props.theme.colors.darkGray};
    font-weight: 600;
    font-size: 0.9rem;
  }
  
  td {
    font-weight: 500;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  .highlight {
    color: ${props => props.theme.colors.primary};
    font-weight: 700;
  }
`;

const ChartContainer = styled.div`
  height: 300px;
  margin-bottom: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PlayerProfile = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Function to get team logo path
  const getTeamLogoPath = (teamShortName) => {
    const logoFilename = theme.TEAM_LOGO_MAP[teamShortName] || 'default.png';
    return `${process.env.PUBLIC_URL}${theme.ASSETS_PATH.TEAMS}${logoFilename}`;
  };
  
  // Function to get player image (placeholder for now)
  const getPlayerImagePath = (playerId) => {
    return `https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/${playerId < 100 ? playerId : 57}.png`;
  };
  
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        
        // Fetch player data
        const playerData = await dbService.getPlayerById(parseInt(id));
        if (!playerData) {
          setError('Player not found');
          setLoading(false);
          return;
        }
        
        setPlayer(playerData);
        
        // Fetch team data for this player
        if (playerData.teamId) {
          const teamData = await dbService.getTeamById(playerData.teamId);
          setTeam(teamData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching player data:', err);
        setError('Failed to load player data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [id]);
  
  if (loading) {
    return (
      <ProfileContainer>
        <BreadcrumbNav>
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/players">Players</Link>
          <span>›</span>
          <span>Loading...</span>
        </BreadcrumbNav>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </ProfileContainer>
    );
  }
  
  if (error || !player) {
    return (
      <ProfileContainer>
        <BreadcrumbNav>
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/players">Players</Link>
          <span>›</span>
          <span>Error</span>
        </BreadcrumbNav>
        <ErrorMessage>
          <h2>Player not found</h2>
          <p>We couldn't find the player you're looking for. They may have been removed or you might have followed an incorrect link.</p>
          <Link to="/players">View All Players</Link>
        </ErrorMessage>
      </ProfileContainer>
    );
  }
  
  // Mock player stats for demonstration
  const playerStats = {
    batting: {
      matches: player.stats?.batting?.matches || 45,
      innings: player.stats?.batting?.matches || 42,
      runs: player.stats?.batting?.runs || 1500,
      average: player.stats?.batting?.average || 35.71,
      strikeRate: player.stats?.batting?.strikeRate || 145.6,
      fifties: player.stats?.batting?.fifties || 10,
      hundreds: player.stats?.batting?.hundreds || 1,
      fours: 120,
      sixes: 65,
      highestScore: 94
    },
    bowling: {
      matches: player.stats?.bowling?.matches || 45,
      innings: player.stats?.bowling?.matches || 38,
      wickets: player.stats?.bowling?.wickets || 25,
      economy: player.stats?.bowling?.economy || 8.25,
      average: 28.4,
      strikeRate: 22.1,
      bestBowling: "3/24",
      fourWickets: 0,
      fiveWickets: 0
    }
  };
  
  // Chart data for performance by season
  const seasonPerformanceData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Runs',
        data: [320, 380, 420, 280, 350],
        backgroundColor: team?.color || theme.colors.primary,
        borderColor: team?.color || theme.colors.primary,
        borderWidth: 1
      }
    ]
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance by Season'
      }
    }
  };
  
  return (
    <ProfileContainer>
      <BreadcrumbNav>
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/players">Players</Link>
        <span>›</span>
        <span>{player.name}</span>
      </BreadcrumbNav>
      
      <PlayerHeader bgColor={team?.color || theme.colors.primary}>
        <PlayerImageContainer>
          <img 
            src={getPlayerImagePath(player.id)} 
            alt={player.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `${process.env.PUBLIC_URL}/assets/images/player_placeholder.png`;
            }}
          />
        </PlayerImageContainer>
        
        <PlayerInfo>
          <PlayerName>{player.name}</PlayerName>
          <PlayerRole>{player.role || 'Batsman'}</PlayerRole>
          
          {team && (
            <TeamBadge to={`/teams/${team.id}`}>
              <img 
                src={getTeamLogoPath(team.shortName)} 
                alt={team.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
              {team.name}
            </TeamBadge>
          )}
          
          <PlayerDetailsGrid>
            <DetailItem>
              <div className="label">Batting Style</div>
              <div className="value">{player.battingStyle || 'Right-handed'}</div>
            </DetailItem>
            <DetailItem>
              <div className="label">Bowling Style</div>
              <div className="value">{player.bowlingStyle || 'Right-arm medium'}</div>
            </DetailItem>
            <DetailItem>
              <div className="label">Nationality</div>
              <div className="value">{player.nationality || 'Indian'}</div>
            </DetailItem>
            <DetailItem>
              <div className="label">Age</div>
              <div className="value">{player.age || '28'}</div>
            </DetailItem>
            <DetailItem>
              <div className="label">IPL Debut</div>
              <div className="value">2018</div>
            </DetailItem>
            <DetailItem>
              <div className="label">Matches</div>
              <div className="value">{playerStats.batting.matches}</div>
            </DetailItem>
          </PlayerDetailsGrid>
        </PlayerInfo>
      </PlayerHeader>
      
      <TabsContainer>
        <TabList>
          <Tab 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Tab>
          <Tab 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')}
          >
            Stats & Records
          </Tab>
          <Tab 
            active={activeTab === 'matches'} 
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </Tab>
          <Tab 
            active={activeTab === 'gallery'} 
            onClick={() => setActiveTab('gallery')}
          >
            Gallery
          </Tab>
          <Tab 
            active={activeTab === 'videos'} 
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </Tab>
        </TabList>
        
        {activeTab === 'overview' && (
          <>
            <SectionTitle>Player Overview</SectionTitle>
            
            <StatsContainer>
              <StatsCard>
                <StatsCardTitle>Batting Statistics</StatsCardTitle>
                <StatsTable>
                  <tbody>
                    <tr>
                      <th>Matches</th>
                      <td>{playerStats.batting.matches}</td>
                    </tr>
                    <tr>
                      <th>Innings</th>
                      <td>{playerStats.batting.innings}</td>
                    </tr>
                    <tr>
                      <th>Runs</th>
                      <td className="highlight">{playerStats.batting.runs}</td>
                    </tr>
                    <tr>
                      <th>Average</th>
                      <td>{playerStats.batting.average}</td>
                    </tr>
                    <tr>
                      <th>Strike Rate</th>
                      <td>{playerStats.batting.strikeRate}</td>
                    </tr>
                    <tr>
                      <th>50s / 100s</th>
                      <td>{playerStats.batting.fifties} / {playerStats.batting.hundreds}</td>
                    </tr>
                    <tr>
                      <th>Highest Score</th>
                      <td>{playerStats.batting.highestScore}</td>
                    </tr>
                  </tbody>
                </StatsTable>
              </StatsCard>
              
              {player.role === 'Bowler' || player.role === 'All-rounder' || player.bowlingStyle ? (
                <StatsCard>
                  <StatsCardTitle>Bowling Statistics</StatsCardTitle>
                  <StatsTable>
                    <tbody>
                      <tr>
                        <th>Matches</th>
                        <td>{playerStats.bowling.matches}</td>
                      </tr>
                      <tr>
                        <th>Innings</th>
                        <td>{playerStats.bowling.innings}</td>
                      </tr>
                      <tr>
                        <th>Wickets</th>
                        <td className="highlight">{playerStats.bowling.wickets}</td>
                      </tr>
                      <tr>
                        <th>Economy</th>
                        <td>{playerStats.bowling.economy}</td>
                      </tr>
                      <tr>
                        <th>Average</th>
                        <td>{playerStats.bowling.average}</td>
                      </tr>
                      <tr>
                        <th>Strike Rate</th>
                        <td>{playerStats.bowling.strikeRate}</td>
                      </tr>
                      <tr>
                        <th>Best Bowling</th>
                        <td>{playerStats.bowling.bestBowling}</td>
                      </tr>
                    </tbody>
                  </StatsTable>
                </StatsCard>
              ) : (
                <StatsCard>
                  <StatsCardTitle>Career Highlights</StatsCardTitle>
                  <div style={{ padding: '1rem' }}>
                    <p>
                      {player.name} is a talented {player.role?.toLowerCase() || 'batsman'} known for 
                      {player.battingStyle?.includes('Right') ? ' his powerful right-handed batting' : ' his elegant left-handed batting'}.
                      With {playerStats.batting.runs} runs in IPL career so far at a strike rate of {playerStats.batting.strikeRate},
                      {player.name.split(' ')[0]} has established himself as a key player for {team?.name || 'his team'}.
                    </p>
                    <p style={{ marginTop: '1rem' }}>
                      His ability to {player.battingStyle?.includes('Right') ? 'dominate bowlers with powerful shots' : 'time the ball beautifully'} 
                      makes him a valuable asset in the T20 format. {player.name.split(' ')[0]} has scored 
                      {playerStats.batting.fifties} half-centuries and {playerStats.batting.hundreds} century in his IPL career.
                    </p>
                  </div>
                </StatsCard>
              )}
            </StatsContainer>
            
            <ChartContainer>
              <Bar data={seasonPerformanceData} options={chartOptions} />
            </ChartContainer>
          </>
        )}
        
        {activeTab === 'stats' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Detailed statistics will be available soon</h3>
            <p>Comprehensive player statistics and records will be updated as the tournament progresses.</p>
          </div>
        )}
        
        {activeTab === 'matches' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Match performances will be available soon</h3>
            <p>Detailed match-by-match statistics will be added once the tournament begins.</p>
          </div>
        )}
        
        {activeTab === 'gallery' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Player gallery will be available soon</h3>
            <p>Photos of {player.name} will be added to the gallery as the tournament progresses.</p>
          </div>
        )}
        
        {activeTab === 'videos' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Player videos will be available soon</h3>
            <p>Highlights and interviews featuring {player.name} will be added soon.</p>
          </div>
        )}
      </TabsContainer>
    </ProfileContainer>
  );
};

export default PlayerProfile;
