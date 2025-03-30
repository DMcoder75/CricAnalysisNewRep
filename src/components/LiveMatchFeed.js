import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, CircularProgress, Divider, Chip, Grid, Button } from '@mui/material';
import axiosClient from '../services/axiosClient';
import { useTheme } from '@mui/material/styles';

/**
 * LiveMatchFeed component
 * Displays live match data for a specific match
 */
const LiveMatchFeed = ({ matchId, matchTitle }) => {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const theme = useTheme();

  // Function to fetch match data
  const fetchMatchData = async () => {
    try {
      setLoading(true);
      
      // Fetch match data from the API
      const response = await axiosClient.get(`/api/matches/${matchId}`);
      console.log('Match data response:', response.data);
      
      setMatchData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching match data:', err);
      setError('Failed to fetch match data. Using mock data instead.');
      
      // Use mock data if API fails
      const mockData = getMockMatchData();
      setMatchData(mockData);
    } finally {
      setLoading(false);
    }
  };

  // Function to provide mock match data when API fails
  const getMockMatchData = () => {
    return {
      id: matchId || 'mock-match-1',
      title: matchTitle || 'Durham Women vs ZIM-W HP-XI, 1st Match',
      venue: 'Harare Sports Club, Harare',
      date: '2025-03-20',
      status: 'Live',
      format: 'ODI',
      team1: {
        name: 'Durham Women',
        shortName: 'DUR-W',
        score: '122/3',
        overs: '27/50'
      },
      team2: {
        name: 'Zimbabwe Women High Performance XI',
        shortName: 'ZIM-W HP-XI',
        score: '',
        overs: ''
      },
      toss: {
        winner: 'Durham Women',
        decision: 'bat'
      },
      currentInnings: 1,
      currentBatters: [
        {
          name: 'E Robinson',
          runs: 45,
          balls: 62,
          fours: 3,
          sixes: 0,
          strikeRate: 72.58
        },
        {
          name: 'H Foulstone',
          runs: 28,
          balls: 35,
          fours: 2,
          sixes: 0,
          strikeRate: 80.00
        }
      ],
      currentBowler: {
        name: 'M Mupachikwa',
        overs: '5',
        maidens: 0,
        runs: 22,
        wickets: 1,
        economy: 4.40
      },
      recentOvers: [
        { over: 23, runs: 4, wickets: 0, details: '1 1 0 2 0 0' },
        { over: 24, runs: 3, wickets: 0, details: '1 0 1 0 1 0' },
        { over: 25, runs: 6, wickets: 0, details: '1 1 0 2 1 1' },
        { over: 26, runs: 5, wickets: 0, details: '0 1 1 2 1 0' },
        { over: 27, runs: 4, wickets: 0, details: '1 0 1 2 0 0' }
      ],
      partnership: {
        runs: 58,
        balls: 72
      },
      lastWicket: {
        player: 'R Lewis',
        score: 32,
        dismissal: 'c Ndiraya b Mupachikwa',
        over: 15.3
      },
      commentary: [
        { over: 27.0, text: 'Mupachikwa to Robinson, 1 run, pushed to mid-on for a single' },
        { over: 27.1, text: 'Mupachikwa to Foulstone, no run, defended back to the bowler' },
        { over: 27.2, text: 'Mupachikwa to Foulstone, 1 run, worked away to square leg' },
        { over: 27.3, text: 'Mupachikwa to Robinson, 2 runs, driven through the covers for two' },
        { over: 27.4, text: 'Mupachikwa to Robinson, no run, beaten outside off stump' },
        { over: 27.5, text: 'Mupachikwa to Robinson, no run, defended solidly' }
      ]
    };
  };

  // Set up auto-refresh interval
  useEffect(() => {
    // Initial fetch
    fetchMatchData();
    
    // Set up interval for refreshing data
    const interval = setInterval(() => {
      fetchMatchData();
    }, refreshInterval * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [refreshInterval, matchId]);

  // Handle refresh interval change
  const handleRefreshIntervalChange = (seconds) => {
    setRefreshInterval(seconds);
  };

  if (loading && !matchData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !matchData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  // If we have match data, display it
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" gutterBottom>{matchData.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {matchData.venue} • {matchData.date} • {matchData.format}
        </Typography>
        <Chip 
          label={matchData.status} 
          color={matchData.status === 'Live' ? 'error' : 'default'} 
          size="small" 
          sx={{ mt: 1 }}
        />
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">{matchData.team1.name}</Typography>
            <Typography variant="h4">
              {matchData.team1.score} 
              <Typography variant="body1" component="span" color="text.secondary" sx={{ ml: 1 }}>
                ({matchData.team1.overs})
              </Typography>
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">{matchData.team2.name}</Typography>
            <Typography variant="h4">
              {matchData.team2.score || 'Yet to bat'} 
              {matchData.team2.overs && (
                <Typography variant="body1" component="span" color="text.secondary" sx={{ ml: 1 }}>
                  ({matchData.team2.overs})
                </Typography>
              )}
            </Typography>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Toss: {matchData.toss.winner} elected to {matchData.toss.decision}
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Current Batters</Typography>
        <Grid container spacing={2}>
          {matchData.currentBatters.map((batter, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  {batter.name} <strong>{batter.runs}*</strong> ({batter.balls})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {batter.fours} fours, {batter.sixes} sixes, SR: {batter.strikeRate}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Current Bowler</Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle1">
            {matchData.currentBowler.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {matchData.currentBowler.overs}-{matchData.currentBowler.maidens}-{matchData.currentBowler.runs}-{matchData.currentBowler.wickets}, Econ: {matchData.currentBowler.economy}
          </Typography>
        </Paper>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Recent Overs</Typography>
        <Grid container spacing={1}>
          {matchData.recentOvers.map((over, index) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 1, 
                  textAlign: 'center',
                  backgroundColor: over.wickets > 0 ? theme.palette.error.light : 'inherit'
                }}
              >
                <Typography variant="caption" display="block">Over {over.over}</Typography>
                <Typography variant="body2" fontWeight="bold">{over.runs} runs</Typography>
                <Typography variant="caption" display="block">{over.details}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Partnership: {matchData.partnership.runs} runs ({matchData.partnership.balls} balls)</Typography>
        <Typography variant="body2" gutterBottom>
          Last wicket: {matchData.lastWicket.player} {matchData.lastWicket.score} ({matchData.lastWicket.dismissal}) at {matchData.lastWicket.over} overs
        </Typography>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom>Commentary</Typography>
        <Paper variant="outlined" sx={{ p: 2 }}>
          {matchData.commentary.map((item, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="caption" fontWeight="bold">
                Over {item.over}:
              </Typography>
              <Typography variant="body2">
                {item.text}
              </Typography>
              {index < matchData.commentary.length - 1 && <Divider sx={{ my: 1 }} />}
            </Box>
          ))}
        </Paper>
      </Box>
      
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Auto-refresh: {refreshInterval} seconds
          </Typography>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => handleRefreshIntervalChange(10)}
            sx={{ mr: 1 }}
          >
            10s
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => handleRefreshIntervalChange(30)}
            sx={{ mr: 1 }}
          >
            30s
          </Button>
          <Button 
            variant="outlined" 
            size="small" 
            onClick={() => handleRefreshIntervalChange(60)}
          >
            60s
          </Button>
        </Box>
        <Button 
          variant="contained" 
          onClick={fetchMatchData}
        >
          Refresh Now
        </Button>
      </Box>
    </Paper>
  );
};

export default LiveMatchFeed;
