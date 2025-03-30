import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardContent, Grid, Divider, Chip, Avatar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import axiosClient from '../services/axiosClient';

// API base URL - will be replaced with environment variable in production
const API_BASE_URL = 'http://localhost:5000/api';

const LiveMatch = ({ matchId }) => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState({});
  const [players, setPlayers] = useState({});
  const [refreshInterval, setRefreshInterval] = useState(null);

  // Fetch match data
  const fetchMatchData = async () => {
    try {
      const matchResponse = await axiosClient.get(`${API_BASE_URL}/matches/${matchId}/live`);
      setMatch(matchResponse.data);
      
      // Fetch teams if not already loaded
      if (!teams[matchResponse.data.homeTeamId] || !teams[matchResponse.data.awayTeamId]) {
        const homeTeamResponse = await axiosClient.get(`${API_BASE_URL}/teams/${matchResponse.data.homeTeamId}`);
        const awayTeamResponse = await axiosClient.get(`${API_BASE_URL}/teams/${matchResponse.data.awayTeamId}`);
        
        setTeams(prevTeams => ({
          ...prevTeams,
          [matchResponse.data.homeTeamId]: homeTeamResponse.data,
          [matchResponse.data.awayTeamId]: awayTeamResponse.data
        }));
      }
      
      // Fetch players for both teams
      const homePlayers = await axiosClient.get(`${API_BASE_URL}/teams/${matchResponse.data.homeTeamId}/players`);
      const awayPlayers = await axiosClient.get(`${API_BASE_URL}/teams/${matchResponse.data.awayTeamId}/players`);
      
      const playerMap = {};
      [...homePlayers.data, ...awayPlayers.data].forEach(player => {
        playerMap[player.id] = player;
      });
      
      setPlayers(playerMap);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching match data:', err);
      setError('Failed to load match data. Please try again later.');
      setLoading(false);
    }
  };

  // Initialize component
  useEffect(() => {
    fetchMatchData();
    
    // Set up refresh interval (every 30 seconds)
    const interval = setInterval(fetchMatchData, 30000);
    setRefreshInterval(interval);
    
    // Clean up on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [matchId]);

  // Format overs (e.g., 10.3 means 10 overs and 3 balls)
  const formatOvers = (overs) => {
    if (!overs) return '0.0';
    return overs.toFixed(1);
  };

  // Get player name by ID
  const getPlayerName = (playerId) => {
    return players[playerId]?.name || 'Unknown Player';
  };

  // Render loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading match data...
        </Typography>
      </Box>
    );
  }

  // Render error state
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  // Render no match data state
  if (!match) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6">
          No match data available.
        </Typography>
      </Box>
    );
  }

  // Get home and away team details
  const homeTeam = teams[match.homeTeamId] || { name: 'Home Team', shortName: 'HOME' };
  const awayTeam = teams[match.awayTeamId] || { name: 'Away Team', shortName: 'AWAY' };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Match Header */}
      <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={5} sx={{ textAlign: 'right' }}>
              <Typography variant="h6">{homeTeam.name}</Typography>
              <Avatar 
                src={homeTeam.logo} 
                alt={homeTeam.name}
                sx={{ 
                  width: 60, 
                  height: 60, 
                  ml: 'auto',
                  border: `2px solid ${homeTeam.color || '#ccc'}`
                }}
              />
            </Grid>
            
            <Grid item xs={2} sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>VS</Typography>
              <Chip 
                label={match.status} 
                color={match.status === 'Live' ? 'error' : match.status === 'Completed' ? 'success' : 'primary'} 
                sx={{ mt: 1 }}
              />
            </Grid>
            
            <Grid item xs={5} sx={{ textAlign: 'left' }}>
              <Typography variant="h6">{awayTeam.name}</Typography>
              <Avatar 
                src={awayTeam.logo} 
                alt={awayTeam.name}
                sx={{ 
                  width: 60, 
                  height: 60, 
                  mr: 'auto',
                  border: `2px solid ${awayTeam.color || '#ccc'}`
                }}
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {match.venue}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(match.date).toLocaleString()}
            </Typography>
            {match.result && (
              <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold' }}>
                {match.result}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Innings Scorecards */}
      {match.innings && match.innings.map((inning, index) => {
        const battingTeam = teams[inning.teamId] || { name: 'Unknown Team', shortName: 'UNK' };
        
        return (
          <Card key={inning.id} sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {battingTeam.name} Innings
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                    {inning.runs}/{inning.wickets}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    ({formatOvers(inning.overs)} overs)
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ mb: 2 }} />
              
              {/* Ball by Ball Data */}
              {inning.balls && inning.balls.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell>Over</TableCell>
                        <TableCell>Batsman</TableCell>
                        <TableCell>Bowler</TableCell>
                        <TableCell align="center">Runs</TableCell>
                        <TableCell>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {inning.balls.map((ball) => (
                        <TableRow key={ball.id} sx={{ 
                          backgroundColor: ball.wicket ? '#ffebee' : 
                                          ball.runs >= 4 ? '#e8f5e9' : 
                                          ball.extras > 0 ? '#fff8e1' : 'inherit'
                        }}>
                          <TableCell>{ball.over_number.toFixed(1)}</TableCell>
                          <TableCell>{getPlayerName(ball.batsmanId)}</TableCell>
                          <TableCell>{getPlayerName(ball.bowlerId)}</TableCell>
                          <TableCell align="center">
                            <Chip 
                              label={ball.runs + ball.extras} 
                              size="small"
                              color={
                                ball.runs >= 6 ? 'success' :
                                ball.runs >= 4 ? 'primary' :
                                ball.wicket ? 'error' :
                                'default'
                              }
                              variant={ball.extras > 0 ? 'outlined' : 'filled'}
                            />
                          </TableCell>
                          <TableCell>
                            {ball.wicket ? (
                              <Typography variant="body2" color="error">
                                {ball.wicket_type !== 'none' ? ball.wicket_type.toUpperCase() : 'OUT'}: {getPlayerName(ball.dismissed_player_id)}
                              </Typography>
                            ) : ball.extras > 0 ? (
                              <Typography variant="body2" color="text.secondary">
                                {ball.extras_type.toUpperCase()}
                              </Typography>
                            ) : (
                              <Typography variant="body2">
                                {ball.commentary || (ball.runs === 0 ? 'Dot ball' : `${ball.runs} runs`)}
                              </Typography>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
                  No ball-by-ball data available yet.
                </Typography>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* No innings data message */}
      {(!match.innings || match.innings.length === 0) && (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6">
              Match has not started yet or no innings data available.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Check back later for live updates.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default LiveMatch;
