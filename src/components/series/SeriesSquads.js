import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import theme from '../../utils/theme';

const SeriesSquads = ({ seriesId }) => {
  const navigate = useNavigate();
  const [squads, setSquads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTeam, setActiveTeam] = useState(null);

  useEffect(() => {
    fetchSquads();
  }, [seriesId]);

  const fetchSquads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const timestamp = new Date().getTime();
      const response = await axios.get(`/api/cricket-series/${seriesId}/squads?t=${timestamp}`);
      
      if (response.data && response.data.squads) {
        setSquads(response.data.squads);
        // Set the first team as active by default if squads exist
        if (response.data.squads.length > 0) {
          setActiveTeam(response.data.squads[0].team);
        }
      } else {
        setError('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error fetching squads:', err);
      setError('Failed to fetch squads data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayerSelect = (playerId) => {
    navigate(`/player/${playerId}`);
  };

  const handleTeamChange = (team) => {
    setActiveTeam(team);
  };

  const activeSquad = squads.find(squad => squad.team === activeTeam);

  return (
    <SquadsContainer>
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading squads...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <ErrorIcon />
          <p>{error}</p>
          <RetryButton onClick={fetchSquads}>Retry</RetryButton>
        </ErrorContainer>
      ) : squads.length === 0 ? (
        <NoSquadsContainer>
          <p>No squad information available for this series.</p>
        </NoSquadsContainer>
      ) : (
        <>
          <TeamTabs>
            {squads.map(squad => (
              <TeamTab 
                key={squad.team}
                active={activeTeam === squad.team}
                onClick={() => handleTeamChange(squad.team)}
              >
                {squad.team}
              </TeamTab>
            ))}
          </TeamTabs>
          
          {activeSquad && (
            <SquadContent>
              <TeamHeader>
                <TeamName>{activeSquad.team}</TeamName>
                <PlayerCount>{activeSquad.players.length} Players</PlayerCount>
              </TeamHeader>
              
              <PlayersList>
                {activeSquad.players.map(player => (
                  <PlayerCard 
                    key={player.id}
                    onClick={() => handlePlayerSelect(player.id)}
                  >
                    <PlayerImageContainer>
                      {player.image ? (
                        <PlayerImage src={player.image} alt={player.name} />
                      ) : (
                        <PlayerImagePlaceholder>
                          <UserIcon />
                        </PlayerImagePlaceholder>
                      )}
                    </PlayerImageContainer>
                    
                    <PlayerInfo>
                      <PlayerName>{player.name}</PlayerName>
                      <PlayerRole>
                        <CricketIcon />
                        {player.role || 'Player'}
                      </PlayerRole>
                      {player.battingStyle && (
                        <PlayerDetail>Batting: {player.battingStyle}</PlayerDetail>
                      )}
                      {player.bowlingStyle && (
                        <PlayerDetail>Bowling: {player.bowlingStyle}</PlayerDetail>
                      )}
                    </PlayerInfo>
                  </PlayerCard>
                ))}
              </PlayersList>
            </SquadContent>
          )}
        </>
      )}
    </SquadsContainer>
  );
};

// Styled components
const SquadsContainer = styled.div``;

const TeamTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const TeamTab = styled.button`
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

const SquadContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${theme.shadows.small};
  padding: 15px;
`;

const TeamHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
`;

const TeamName = styled.h3`
  margin: 0;
  color: ${theme.colors.primary};
  font-size: 20px;
`;

const PlayerCount = styled.div`
  background-color: ${theme.colors.lightGray};
  color: ${theme.colors.primary};
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: bold;
`;

const PlayersList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
`;

const PlayerCard = styled.div`
  display: flex;
  background-color: white;
  border-radius: 8px;
  box-shadow: ${theme.shadows.small};
  padding: 15px;
  cursor: pointer;
  transition: ${theme.transitions.default};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.medium};
  }
`;

const PlayerImageContainer = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 15px;
  flex-shrink: 0;
`;

const PlayerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayerImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${theme.colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.darkGray};
`;

const PlayerInfo = styled.div`
  flex: 1;
`;

const PlayerName = styled.h4`
  margin: 0 0 5px 0;
  font-size: 16px;
  color: ${theme.colors.primary};
`;

const PlayerRole = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${theme.colors.darkGray};
  font-size: 14px;
  margin-bottom: 5px;
`;

const PlayerDetail = styled.div`
  font-size: 12px;
  color: ${theme.colors.text};
  margin-top: 3px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: ${theme.colors.darkGray};
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: ${theme.colors.danger};
  text-align: center;
`;

const ErrorIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${theme.colors.danger};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
  margin-bottom: 15px;
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

const NoSquadsContainer = styled.div`
  padding: 30px;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  color: ${theme.colors.darkGray};
`;

const UserIcon = styled.div`
  width: 30px;
  height: 30px;
  background-color: ${theme.colors.darkGray};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

const CricketIcon = styled.div`
  width: 14px;
  height: 14px;
  background-color: ${theme.colors.darkGray};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'%3E%3Cpath d='M424.1 40.3c-5.6-7.9-16.7-9.8-24.7-4.1C391.5 41.7 389.7 52.8 395.4 60.7l56 80c5.6 7.9 16.7 9.8 24.7 4.1c7.9-5.6 9.8-16.7 4.1-24.7l-56-80zM347.7 121.6c-5.6-7.9-16.7-9.8-24.7-4.1c-7.9 5.6-9.8 16.7-4.1 24.7l32 45.7c5.6 7.9 16.7 9.8 24.7 4.1c7.9-5.6 9.8-16.7 4.1-24.7l-32-45.7zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0S96 57.3 96 128s57.3 128 128 128zm-13.2 115.2l-8.5-8.5c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l8.5 8.5c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0zM100.7 344.7c-9.4-9.4-9.4-24.6 0-33.9l33.9-33.9c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-33.9 33.9c-9.4 9.4-24.6 9.4-33.9 0zM432 512c-79.5 0-144-64.5-144-144s64.5-144 144-144s144 64.5 144 144s-64.5 144-144 144zm0-48c13.3 0 24-10.7 24-24s-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24zm-64-72c0 13.3 10.7 24 24 24s24-10.7 24-24s-10.7-24-24-24s-24 10.7-24 24zm88-24c-13.3 0-24 10.7-24 24s10.7 24 24 24s24-10.7 24-24s-10.7-24-24-24zm24 72c0-13.3-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24s24-10.7 24-24z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

export default SeriesSquads;
