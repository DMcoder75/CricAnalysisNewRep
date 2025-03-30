import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, Tabs, Tab, CircularProgress, Divider, Chip, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import mockData from '../data/mockData';

// Styled components
const ScoreCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const TeamScore = styled(Box)(({ theme, color }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  backgroundColor: color || theme.palette.primary.main,
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
}));

const BallCard = styled(Card)(({ theme, wicket }) => ({
  marginBottom: theme.spacing(1),
  backgroundColor: wicket ? '#ffebee' : theme.palette.background.paper,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  },
}));

const RunsChip = styled(Chip)(({ theme, runs }) => {
  let color = theme.palette.grey[200];
  let textColor = theme.palette.text.primary;
  
  if (runs === 4) {
    color = '#e3f2fd';
    textColor = '#0d47a1';
  } else if (runs === 6) {
    color = '#e8f5e9';
    textColor = '#1b5e20';
  } else if (runs === 0 && runs !== '') {
    color = '#ffebee';
    textColor = '#b71c1c';
  }
  
  return {
    backgroundColor: color,
    color: textColor,
    fontWeight: 'bold',
    minWidth: '30px',
  };
});

const ZimDurhamMatch = () => {
  const [match, setMatch] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  // Removed unused ballByBall state variable since we're generating it dynamically
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [currentInning, setCurrentInning] = useState(1);
  
  const matchId = 'zim-durham'; // Match ID for Zimbabwe A vs Durham

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        
        // Get data directly from mockData
        const matchData = mockData.getLiveMatchData(matchId);
        console.log('Match data:', matchData);
        
        if (matchData) {
          setMatch(matchData);
          
          // Get scorecard from matchStats
          const matchStats = mockData.matchStats[matchId];
          console.log('Match stats:', matchStats);
          
          if (matchStats) {
            setScorecard(matchStats);
          }
        } else {
          setError('Match data not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching match data:', err);
        setError('Failed to load match data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMatchData();
    
    // Set up polling for live updates every 30 seconds
    const intervalId = setInterval(() => {
      fetchMatchData();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [matchId]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleInningChange = (inning) => {
    setCurrentInning(inning);
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading match data...</Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }
  
  if (!match || !scorecard) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6">No match data available</Typography>
      </Box>
    );
  }
  
  // Find the current innings - safely access properties
  const innings = scorecard.innings || [];
  const currentInningData = innings.find(inning => inning.inningNumber === currentInning) || {};
  
  // Get team colors (default to blue and red if not specified)
  const homeTeamColor = '#1976d2'; // Default blue
  const awayTeamColor = '#d32f2f'; // Default red
  
  // Safely access nested properties
  const homeTeam = match.teams && match.teams.home ? match.teams.home : { name: 'Home Team', score: '0/0', overs: '0.0' };
  const awayTeam = match.teams && match.teams.away ? match.teams.away : { name: 'Away Team', score: '0/0', overs: '0.0' };
  
  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        {match.title || 'Zimbabwe A vs Durham'}
      </Typography>
      
      <Typography variant="subtitle1" gutterBottom>
        {match.venue || 'Queens Sports Club, Bulawayo'} | {match.date ? new Date(match.date).toLocaleDateString() : 'Match Date'} | 
        <Chip 
          label={match.status || 'In Progress'} 
          color={match.status === 'In Progress' ? 'error' : match.status === 'Completed' ? 'success' : 'primary'} 
          size="small" 
          sx={{ ml: 1 }}
        />
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {/* Match Summary */}
          <ScoreCard>
            <Typography variant="h6" gutterBottom>Match Summary</Typography>
            
            <TeamScore color={homeTeamColor}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                {homeTeam.name}
              </Typography>
              <Typography variant="h6">
                {homeTeam.score} ({homeTeam.overs} overs)
              </Typography>
            </TeamScore>
            
            <TeamScore color={awayTeamColor}>
              <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
                {awayTeam.name}
              </Typography>
              <Typography variant="h6">
                {awayTeam.score} ({awayTeam.overs} overs)
              </Typography>
            </TeamScore>
            
            <Typography variant="body1" sx={{ mt: 2 }}>
              {match.status === 'In Progress' 
                ? `${match.status === 'In Progress' ? 'Live: ' : ''}${match.statusText || 'Match in progress'}`
                : match.result || 'Match result pending'}
            </Typography>
          </ScoreCard>
          
          {/* Current Batsmen and Bowler */}
          {match.status === 'In Progress' && (
            <ScoreCard>
              <Typography variant="h6" gutterBottom>Current Players</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                  <Typography variant="subtitle2" gutterBottom>Batsmen</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {match.currentBatsmen ? match.currentBatsmen.map((batsman, index) => (
                      <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                        <Typography variant="body2">{batsman.name || 'Batsman'} {batsman.onStrike ? '*' : ''}</Typography>
                        <Typography variant="body2">{batsman.runs || 0} ({batsman.balls || 0})</Typography>
                      </Box>
                    )) : (
                      <Typography variant="body2">No current batsmen data</Typography>
                    )}
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle2" gutterBottom>Bowler</Typography>
                  {match.currentBowler ? (
                    <Box sx={{ p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                      <Typography variant="body2">{match.currentBowler.name || 'Bowler'}</Typography>
                      <Typography variant="body2">{match.currentBowler.overs || '0.0'}-{match.currentBowler.maidens || 0}-{match.currentBowler.runs || 0}-{match.currentBowler.wickets || 0}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2">No current bowler data</Typography>
                  )}
                </Grid>
              </Grid>
            </ScoreCard>
          )}
          
          {/* Tabs for Scorecard, Ball by Ball, etc. */}
          <Box sx={{ mt: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} aria-label="match tabs">
              <Tab label="Scorecard" />
              <Tab label="Ball by Ball" />
              <Tab label="Commentary" />
              <Tab label="Statistics" />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              {/* Scorecard */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {innings.map((inning, index) => (
                    <Chip
                      key={index}
                      label={`Innings ${inning.inningNumber}: ${inning.teamId === 'zim-a' ? 'Zimbabwe A' : 'Durham'} - ${inning.runs}/${inning.wickets}`}
                      onClick={() => handleInningChange(inning.inningNumber)}
                      color={currentInning === inning.inningNumber ? 'primary' : 'default'}
                      variant={currentInning === inning.inningNumber ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
                
                {/* Batting */}
                <Typography variant="h6" gutterBottom>Batting</Typography>
                <Paper sx={{ width: '100%', mb: 2, overflowX: 'auto' }}>
                  <Box sx={{ minWidth: 650, p: 1 }}>
                    <Box sx={{ display: 'flex', fontWeight: 'bold', p: 1, borderBottom: 1, borderColor: 'divider' }}>
                      <Box sx={{ flex: 3 }}>Batsman</Box>
                      <Box sx={{ flex: 4 }}>Dismissal</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>R</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>B</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>4s</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>6s</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>SR</Box>
                    </Box>
                    
                    {currentInningData.batting ? currentInningData.batting.map((batsman, index) => (
                      <Box key={index} sx={{ display: 'flex', p: 1, borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ flex: 3 }}>{batsman.name || 'Batsman'}</Box>
                        <Box sx={{ flex: 4 }}>{batsman.dismissal || 'not out'}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{batsman.runs || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{batsman.balls || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{batsman.fours || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{batsman.sixes || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{batsman.strikeRate || 0}</Box>
                      </Box>
                    )) : (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2">No batting data available</Typography>
                      </Box>
                    )}
                    
                    {/* Extras and Total */}
                    <Box sx={{ display: 'flex', p: 1, borderBottom: 1, borderColor: 'divider' }}>
                      <Box sx={{ flex: 3 }}>Extras</Box>
                      <Box sx={{ flex: 4 }}>{currentInningData.extras ? `b ${currentInningData.extras.byes || 0}, lb ${currentInningData.extras.legByes || 0}, w ${currentInningData.extras.wides || 0}, nb ${currentInningData.extras.noBalls || 0}, p ${currentInningData.extras.penalty || 0}` : 'No extras'}</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>{currentInningData.extras ? (currentInningData.extras.byes || 0) + (currentInningData.extras.legByes || 0) + (currentInningData.extras.wides || 0) + (currentInningData.extras.noBalls || 0) + (currentInningData.extras.penalty || 0) : 0}</Box>
                      <Box sx={{ flex: 4 }}></Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', p: 1, fontWeight: 'bold' }}>
                      <Box sx={{ flex: 3 }}>Total</Box>
                      <Box sx={{ flex: 4 }}>{`(${currentInningData.wickets || 0} wkts, ${currentInningData.overs || 0} Ov)`}</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>{currentInningData.runs || 0}</Box>
                      <Box sx={{ flex: 4 }}></Box>
                    </Box>
                  </Box>
                </Paper>
                
                {/* Bowling */}
                <Typography variant="h6" gutterBottom>Bowling</Typography>
                <Paper sx={{ width: '100%', mb: 2, overflowX: 'auto' }}>
                  <Box sx={{ minWidth: 650, p: 1 }}>
                    <Box sx={{ display: 'flex', fontWeight: 'bold', p: 1, borderBottom: 1, borderColor: 'divider' }}>
                      <Box sx={{ flex: 3 }}>Bowler</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>O</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>M</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>R</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>W</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>Econ</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>0s</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>4s</Box>
                      <Box sx={{ flex: 1, textAlign: 'center' }}>6s</Box>
                    </Box>
                    
                    {currentInningData.bowling ? currentInningData.bowling.map((bowler, index) => (
                      <Box key={index} sx={{ display: 'flex', p: 1, borderBottom: 1, borderColor: 'divider' }}>
                        <Box sx={{ flex: 3 }}>{bowler.name || 'Bowler'}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{bowler.overs || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{bowler.maidens || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{bowler.runs || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{bowler.wickets || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{bowler.economy || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{bowler.dots || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{bowler.fours || 0}</Box>
                        <Box sx={{ flex: 1, textAlign: 'center' }}>{bowler.sixes || 0}</Box>
                      </Box>
                    )) : (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="body2">No bowling data available</Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              {/* Ball by Ball */}
              <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {innings.map((inning, index) => (
                    <Chip
                      key={index}
                      label={`Innings ${inning.inningNumber}: ${inning.teamId === 'zim-a' ? 'Zimbabwe A' : 'Durham'}`}
                      onClick={() => handleInningChange(inning.inningNumber)}
                      color={currentInning === inning.inningNumber ? 'primary' : 'default'}
                      variant={currentInning === inning.inningNumber ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
                
                {/* Since we don't have actual ball-by-ball data in our mock data, let's create a simulated view */}
                <Grid container spacing={2}>
                  {/* Generate simulated overs based on the total overs in the innings */}
                  {(() => {
                    // Get the total overs as a number
                    const totalOvers = parseFloat(currentInningData.overs || "0");
                    const fullOvers = Math.floor(totalOvers);
                    const ballsInLastOver = Math.round((totalOvers - fullOvers) * 10);
                    
                    // Create an array of over numbers
                    const overNumbers = Array.from({ length: fullOvers + (ballsInLastOver > 0 ? 1 : 0) }, (_, i) => i + 1);
                    
                    return overNumbers.map(overNumber => {
                      // Generate random balls for each over
                      const ballCount = overNumber === fullOvers + 1 ? ballsInLastOver : 6;
                      const possibleRuns = [0, 1, 2, 3, 4, 6, 'W'];
                      const balls = Array.from({ length: ballCount }, () => {
                        const randomIndex = Math.floor(Math.random() * possibleRuns.length);
                        return { 
                          runs: possibleRuns[randomIndex],
                          isWicket: possibleRuns[randomIndex] === 'W'
                        };
                      });
                      
                      return (
                        <Grid item xs={12} sm={6} md={4} key={overNumber}>
                          <Card>
                            <CardContent>
                              <Typography variant="h6" gutterBottom>Over {overNumber}</Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {balls.map((ball, index) => (
                                  <RunsChip 
                                    key={index} 
                                    label={ball.isWicket ? 'W' : ball.runs} 
                                    runs={ball.isWicket ? 'W' : ball.runs} 
                                    variant="filled" 
                                    size="small" 
                                  />
                                ))}
                              </Box>
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                {balls.reduce((total, ball) => {
                                  if (ball.isWicket) return total;
                                  return total + (typeof ball.runs === 'number' ? ball.runs : 0);
                                }, 0)} runs
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    });
                  })()}
                </Grid>
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              {/* Commentary */}
              <Box sx={{ mt: 2 }}>
                {match.commentary ? match.commentary.map((comment, index) => (
                  <BallCard key={index} wicket={comment.isWicket}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2">{comment.over}.{comment.ball} Over</Typography>
                        <RunsChip label={comment.runs} runs={comment.runs} variant="filled" size="small" />
                      </Box>
                      <Typography variant="body2">{comment.text}</Typography>
                    </CardContent>
                  </BallCard>
                )) : (
                  <Typography variant="body2" sx={{ p: 2, textAlign: 'center' }}>
                    No commentary available
                  </Typography>
                )}
              </Box>
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              {/* Statistics */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>Match Statistics</Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>Top Scorers</Typography>
                      {scorecard.topScorers ? scorecard.topScorers.map((player, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{player.name}</Typography>
                          <Typography variant="body2">{player.runs} ({player.balls})</Typography>
                        </Box>
                      )) : (
                        <Typography variant="body2">No top scorers data</Typography>
                      )}
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Paper sx={{ p: 2 }}>
                      <Typography variant="subtitle1" gutterBottom>Top Wicket Takers</Typography>
                      {scorecard.topWicketTakers ? scorecard.topWicketTakers.map((player, index) => (
                        <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2">{player.name}</Typography>
                          <Typography variant="body2">{player.wickets}-{player.runs} ({player.overs})</Typography>
                        </Box>
                      )) : (
                        <Typography variant="body2">No top wicket takers data</Typography>
                      )}
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Recent Balls */}
          <ScoreCard>
            <Typography variant="h6" gutterBottom>Recent Balls</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {match.recentBalls ? match.recentBalls.map((ball, index) => (
                <RunsChip 
                  key={index} 
                  label={ball.isWicket ? 'W' : ball.runs} 
                  runs={ball.isWicket ? 'W' : ball.runs} 
                  variant="filled" 
                  size="small" 
                />
              )) : (
                <Typography variant="body2">No recent balls data</Typography>
              )}
            </Box>
          </ScoreCard>
          
          {/* Match Info */}
          <ScoreCard>
            <Typography variant="h6" gutterBottom>Match Info</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Venue:</Typography>
                <Typography variant="body2">{match.venue || 'Queens Sports Club, Bulawayo'}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Date:</Typography>
                <Typography variant="body2">{match.date ? new Date(match.date).toLocaleDateString() : 'Match Date'}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Toss:</Typography>
                <Typography variant="body2">{match.toss || 'Zimbabwe A won the toss and elected to bat'}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2">Umpires:</Typography>
                <Typography variant="body2">{match.umpires ? match.umpires.join(', ') : 'TBA'}</Typography>
              </Box>
            </Box>
          </ScoreCard>
          
          {/* Team Squads */}
          <ScoreCard>
            <Typography variant="h6" gutterBottom>Team Squads</Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>Zimbabwe A</Typography>
            <Box sx={{ ml: 2 }}>
              {scorecard.teams && scorecard.teams['zim-a'] ? scorecard.teams['zim-a'].players.map((player, index) => (
                <Typography key={index} variant="body2">• {player}</Typography>
              )) : (
                <Typography variant="body2">Squad not available</Typography>
              )}
            </Box>
            
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Durham</Typography>
            <Box sx={{ ml: 2 }}>
              {scorecard.teams && scorecard.teams['durham'] ? scorecard.teams['durham'].players.map((player, index) => (
                <Typography key={index} variant="body2">• {player}</Typography>
              )) : (
                <Typography variant="body2">Squad not available</Typography>
              )}
            </Box>
          </ScoreCard>
        </Grid>
      </Grid>
    </Box>
  );
};

// TabPanel component for tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`match-tabpanel-${index}`}
      aria-labelledby={`match-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default ZimDurhamMatch;
