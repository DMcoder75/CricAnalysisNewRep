import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Divider, 
  Grid, 
  Chip, 
  Avatar, 
  CircularProgress, 
  Button, 
  CardHeader, 
  IconButton, 
  CardActions,
  styled
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import axiosClient from '../../services/axiosClient';

// Styled components
const MatchCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.spacing(1),
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
  }
}));

const TeamLogo = styled(Avatar)(({ theme, bordercolor }) => ({
  width: 64,
  height: 64,
  margin: '0 auto',
  border: `2px solid ${bordercolor || theme.palette.primary.main}`,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: '#fff',
}));

const TeamName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginTop: theme.spacing(1),
  fontSize: '0.95rem',
  lineHeight: 1.2,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ScoreText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginTop: theme.spacing(0.5),
  color: theme.palette.text.primary,
}));

const StatusChip = styled(Chip)(({ theme, color }) => ({
  marginTop: theme.spacing(1),
  fontWeight: 600,
}));

const DataSourceChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  height: 24,
}));

const MatchDetailsBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5),
  backgroundColor: theme.palette.grey[50],
  borderRadius: theme.spacing(1),
  marginTop: theme.spacing(2),
}));

// IPL teams data with logos
const IPL_TEAMS = {
  'CSK': {
    fullName: 'Chennai Super Kings',
    shortName: 'CSK',
    logo: 'https://static.iplt20.com/players/284/csk.png'
  },
  'MI': {
    fullName: 'Mumbai Indians',
    shortName: 'MI',
    logo: 'https://static.iplt20.com/players/284/mi.png'
  },
  'RCB': {
    fullName: 'Royal Challengers Bangalore',
    shortName: 'RCB',
    logo: 'https://static.iplt20.com/players/284/rcb.png'
  },
  'KKR': {
    fullName: 'Kolkata Knight Riders',
    shortName: 'KKR',
    logo: 'https://static.iplt20.com/players/284/kkr.png'
  },
  'DC': {
    fullName: 'Delhi Capitals',
    shortName: 'DC',
    logo: 'https://static.iplt20.com/players/284/delhi-capitals.png'
  },
  'SRH': {
    fullName: 'Sunrisers Hyderabad',
    shortName: 'SRH',
    logo: 'https://static.iplt20.com/players/284/srh.png'
  },
  'PBKS': {
    fullName: 'Punjab Kings',
    shortName: 'PBKS',
    logo: 'https://static.iplt20.com/players/284/pbks.png'
  },
  'RR': {
    fullName: 'Rajasthan Royals',
    shortName: 'RR',
    logo: 'https://static.iplt20.com/players/284/rr.png'
  },
  'GT': {
    fullName: 'Gujarat Titans',
    shortName: 'GT',
    logo: 'https://static.iplt20.com/players/284/gujarat-titans.png'
  },
  'LSG': {
    fullName: 'Lucknow Super Giants',
    shortName: 'LSG',
    logo: 'https://static.iplt20.com/players/284/lucknow-super-giants.png'
  }
};

// Function to identify IPL team from name
const identifyTeam = (teamName) => {
  if (!teamName) return null;
  
  // Check for exact matches first
  for (const [code, team] of Object.entries(IPL_TEAMS)) {
    if (teamName.includes(team.fullName)) {
      return {
        id: code.toLowerCase(),
        name: team.fullName,
        shortname: team.shortName,
        logo: team.logo
      };
    }
  }
  
  // Check for partial matches
  const teamNameLower = teamName.toLowerCase();
  for (const [code, team] of Object.entries(IPL_TEAMS)) {
    const shortNameLower = team.shortName.toLowerCase();
    const fullNameLower = team.fullName.toLowerCase();
    
    if (teamNameLower.includes(shortNameLower) || 
        teamNameLower.includes(fullNameLower.split(' ')[0]) || 
        teamNameLower.includes(fullNameLower.split(' ')[1])) {
      return {
        id: code.toLowerCase(),
        name: team.fullName,
        shortname: team.shortName,
        logo: team.logo
      };
    }
  }
  
  // If no match found, return generic format
  return {
    id: teamName.toLowerCase().replace(/\s+/g, '-'),
    name: teamName,
    shortname: teamName.substring(0, 3).toUpperCase(),
    logo: `https://static.iplt20.com/players/284/${teamName.toLowerCase().replace(/\s+/g, '-')}.png`
  };
};

const IPLTodaysMatch = () => {
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [debugInfo, setDebugInfo] = useState([]);
  const [matchType, setMatchType] = useState('today'); // 'today', 'upcoming', or 'recent'

  // IPL Series ID for the current season - this is the correct ID from the API sample
  const IPL_SERIES_ID = "d5a498c8-7596-4b93-8ab0-e0efc3345312";
  
  // Get today's date in the format YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Format date for display
  const formatDateForDisplay = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Convert GMT time to IST (GMT+5:30)
  const convertGMTtoIST = (dateTimeGMT) => {
    try {
      // Parse the GMT date
      const gmtDate = new Date(dateTimeGMT);
      
      // Add 5 hours and 30 minutes to convert to IST
      const istDate = new Date(gmtDate);
      istDate.setHours(gmtDate.getHours() + 5);
      istDate.setMinutes(gmtDate.getMinutes() + 30);
      
      // Format the IST time
      return istDate.toLocaleString('en-US', {
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      }) + ' IST';
    } catch (error) {
      console.error('Error converting GMT to IST:', error);
      return dateTimeGMT; // Return original if conversion fails
    }
  };

  // Function to add debug information
  const addDebugInfo = (info) => {
    console.log(info);
    // setDebugInfo(prev => [...prev, info]);
  };

  const fetchTodaysMatch = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo([]);
    
    try {
      addDebugInfo('Fetching today\'s IPL match data...');
      const todayStr = getTodayDateString();
      addDebugInfo(`Today's date: ${todayStr}`);
      
      // Step 1: Try to fetch from database first
      try {
        addDebugInfo('Attempting to fetch from database...');
        const dbResponse = await axiosClient.get('/api/todays-ipl-match');
        
        if (dbResponse.data && dbResponse.data.match) {
          addDebugInfo('Successfully fetched match data from database');
          setMatch(dbResponse.data.match);
          setDataSource('database');
          setLastUpdated(new Date());
          setLoading(false);
          return;
        }
      } catch (dbError) {
        addDebugInfo(`Failed to fetch from database: ${dbError.message}`);
      }
      
      // Step 2: Try to fetch directly from CricAPI using the series_info endpoint
      try {
        addDebugInfo('Attempting to fetch directly from CricAPI...');
        
        // Get series info from CricAPI with the specific IPL series ID
        const apiUrl = `series_info?id=${IPL_SERIES_ID}`;
        addDebugInfo(`Fetching from API URL: ${apiUrl}`);
        
        // Set a longer timeout for the API request
        const apiResponse = await axiosClient.get(apiUrl, { timeout: 15000 });
        addDebugInfo(`CricAPI series_info response received`);
        
        if (apiResponse.data && apiResponse.data.data && apiResponse.data.data.matchList) {
          // Log series info
          const seriesInfo = apiResponse.data.data.info;
          addDebugInfo(`Series: ${seriesInfo.name}, Start: ${seriesInfo.startdate}, End: ${seriesInfo.enddate}, Matches: ${seriesInfo.matches}`);
          
          // Get all matches from the series
          const allMatches = apiResponse.data.data.matchList;
          addDebugInfo(`Total matches in series: ${allMatches.length}`);
          
          // Log all matches for debugging
          allMatches.forEach((match, index) => {
            addDebugInfo(`Match ${index + 1}: ${match.name}, Date: ${match.date}, GMT Time: ${match.dateTimeGMT}, Teams: ${match.teams?.join(' vs ')}`);
          });
          
          // Find matches for today
          const todaysMatches = allMatches.filter(match => match.date === todayStr);
          
          if (todaysMatches.length > 0) {
            addDebugInfo(`Found ${todaysMatches.length} IPL matches for today (${todayStr})`);
            
            // Take the first match for today
            const todaysMatch = todaysMatches[0];
            addDebugInfo(`Selected today's match: ${todaysMatch.name}`);
            setMatchType('today');
            
            // Try to identify teams from the match data
            let team1 = null;
            let team2 = null;
            
            if (todaysMatch.teams && todaysMatch.teams.length >= 2 && 
                !todaysMatch.teams[0].includes('Tbc') && !todaysMatch.teams[1].includes('Tbc')) {
              // Use teams from the API response
              team1 = identifyTeam(todaysMatch.teams[0]);
              team2 = identifyTeam(todaysMatch.teams[1]);
              addDebugInfo(`Using teams from API: ${todaysMatch.teams[0]} vs ${todaysMatch.teams[1]}`);
            } else if (todaysMatch.name && todaysMatch.name.includes('vs')) {
              // Extract teams from match name
              const teamNames = todaysMatch.name.split('vs').map(t => t.trim());
              if (teamNames.length >= 2) {
                const team1Name = teamNames[0].replace(/,.*$/, '').trim();
                const team2Name = teamNames[1].replace(/,.*$/, '').trim();
                team1 = identifyTeam(team1Name);
                team2 = identifyTeam(team2Name);
                addDebugInfo(`Extracted teams from match name: ${team1Name} vs ${team2Name}`);
              }
            }
            
            // Convert match time from GMT to IST
            const matchTimeIST = convertGMTtoIST(todaysMatch.dateTimeGMT);
            addDebugInfo(`Match time converted from GMT (${todaysMatch.dateTimeGMT}) to IST: ${matchTimeIST}`);
            
            // Format the match data
            const formattedMatch = {
              id: todaysMatch.id,
              name: todaysMatch.name,
              venue: todaysMatch.venue,
              date: todaysMatch.date,
              dateFormatted: formatDateForDisplay(todaysMatch.date),
              dateTimeGMT: todaysMatch.dateTimeGMT,
              matchTime: matchTimeIST,
              isLive: todaysMatch.matchStarted && !todaysMatch.matchEnded,
              isEnded: todaysMatch.matchEnded,
              team1: team1 || {
                id: 'unknown-team-1',
                name: 'Unknown Team 1',
                shortname: 'UT1',
                logo: 'https://static.iplt20.com/players/284/ipl-logo.png'
              },
              team2: team2 || {
                id: 'unknown-team-2',
                name: 'Unknown Team 2',
                shortname: 'UT2',
                logo: 'https://static.iplt20.com/players/284/ipl-logo.png'
              },
              result: todaysMatch.status,
              isUpcoming: false // It's today's match
            };
            
            addDebugInfo('Formatted match data successfully');
            setMatch(formattedMatch);
            setDataSource('cricapi');
            setLastUpdated(new Date());
            setLoading(false);
            
            // Cache the result in sessionStorage
            try {
              sessionStorage.setItem('todaysIplMatch', JSON.stringify({
                match: formattedMatch,
                matchType: 'today',
                timestamp: new Date().getTime()
              }));
              addDebugInfo('Cached match data in sessionStorage');
            } catch (cacheError) {
              addDebugInfo(`Failed to cache match data: ${cacheError.message}`);
            }
            
            return;
          } else {
            addDebugInfo(`No IPL matches found for today (${todayStr})`);
            setError('No IPL matches scheduled for today');
            setLoading(false);
          }
        } else {
          addDebugInfo('No data returned from CricAPI series_info or empty data');
          setError('No match data available from the API');
          setLoading(false);
        }
      } catch (apiError) {
        addDebugInfo(`Failed to fetch from CricAPI series_info: ${apiError.message}`);
        
        // Use mock data instead of showing error message
        const mockMatch = {
          id: 'mock-match-1',
          name: 'Chennai Super Kings vs Mumbai Indians',
          venue: 'M.A. Chidambaram Stadium, Chennai',
          date: todayStr,
          dateFormatted: formatDateForDisplay(todayStr),
          dateTimeGMT: new Date().toISOString(),
          matchTime: `${new Date().toLocaleString('en-US', {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
          })} IST`,
          isLive: false,
          isEnded: false,
          team1: identifyTeam('Chennai Super Kings'),
          team2: identifyTeam('Mumbai Indians'),
          result: 'Match starts at 7:30 PM',
          isUpcoming: true
        };
        
        addDebugInfo('Using mock match data as fallback');
        setMatch(mockMatch);
        setDataSource('mock');
        setLastUpdated(new Date());
        setLoading(false);
        return;
      }
      
      // Step 3: Try to use cached data from sessionStorage but only if it's from today
      try {
        addDebugInfo('Attempting to use cached data...');
        const cachedData = sessionStorage.getItem('todaysIplMatch');
        
        if (cachedData) {
          const { match: cachedMatch, matchType: cachedMatchType, timestamp } = JSON.parse(cachedData);
          const cacheAge = new Date().getTime() - timestamp;
          
          // Only use cache if it's from today and less than 30 minutes old
          if (cachedMatch.date === todayStr && cacheAge < 30 * 60 * 1000) {
            addDebugInfo('Using cached match data for today (less than 30 minutes old)');
            setMatch(cachedMatch);
            setMatchType('today');
            setDataSource('cache');
            setLastUpdated(new Date(timestamp));
            setLoading(false);
            return;
          } else {
            addDebugInfo(`Cached data is not from today or too old (${Math.round(cacheAge/60000)} minutes)`);
          }
        } else {
          addDebugInfo('No cached data found in sessionStorage');
        }
      } catch (cacheError) {
        addDebugInfo(`Failed to use cached data: ${cacheError.message}`);
      }
      
      // Step 4: If all else fails, use mock data
      const mockMatch = {
        id: 'mock-match-1',
        name: 'Chennai Super Kings vs Mumbai Indians',
        venue: 'M.A. Chidambaram Stadium, Chennai',
        date: todayStr,
        dateFormatted: formatDateForDisplay(todayStr),
        dateTimeGMT: new Date().toISOString(),
        matchTime: `${new Date().toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })} IST`,
        isLive: false,
        isEnded: false,
        team1: identifyTeam('Chennai Super Kings'),
        team2: identifyTeam('Mumbai Indians'),
        result: 'Match starts at 7:30 PM',
        isUpcoming: true
      };
      
      addDebugInfo('Using mock match data as last resort');
      setMatch(mockMatch);
      setDataSource('mock');
      setLastUpdated(new Date());
      setLoading(false);
      
    } catch (error) {
      addDebugInfo(`Unhandled error: ${error.message}`);
      
      // Even for unhandled errors, use mock data instead of showing error
      const todayStr = getTodayDateString();
      const mockMatch = {
        id: 'mock-match-1',
        name: 'Chennai Super Kings vs Mumbai Indians',
        venue: 'M.A. Chidambaram Stadium, Chennai',
        date: todayStr,
        dateFormatted: formatDateForDisplay(todayStr),
        dateTimeGMT: new Date().toISOString(),
        matchTime: `${new Date().toLocaleString('en-US', {
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
        })} IST`,
        isLive: false,
        isEnded: false,
        team1: identifyTeam('Chennai Super Kings'),
        team2: identifyTeam('Mumbai Indians'),
        result: 'Match starts at 7:30 PM',
        isUpcoming: true
      };
      
      addDebugInfo('Using mock match data due to unhandled error');
      setMatch(mockMatch);
      setDataSource('mock (error fallback)');
      setLastUpdated(new Date());
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodaysMatch();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchTodaysMatch, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    fetchTodaysMatch();
  };

  return (
    <MatchCard elevation={3}>
      <CardHeader
        title={
          <Typography variant="h6" component="div" align="center" sx={{ fontWeight: 'bold' }}>
            Today's IPL Match
          </Typography>
        }
        action={
          <IconButton aria-label="refresh" onClick={handleRefresh} size="small">
            <RefreshIcon />
          </IconButton>
        }
      />
      <CardContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error && !match ? (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body1" color="text.secondary">
              {error}
            </Typography>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={handleRefresh}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Box>
        ) : match ? (
          <>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={5} sx={{ textAlign: 'center' }}>
                <TeamLogo 
                  src={match.team1.logo} 
                  alt={match.team1.name}
                  bordercolor="#1976d2"
                />
                <TeamName align="center">
                  {match.team1.name}
                </TeamName>
              </Grid>
              <Grid item xs={2} sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  VS
                </Typography>
              </Grid>
              <Grid item xs={5} sx={{ textAlign: 'center' }}>
                <TeamLogo 
                  src={match.team2.logo} 
                  alt={match.team2.name}
                  bordercolor="#d32f2f"
                />
                <TeamName align="center">
                  {match.team2.name}
                </TeamName>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Chip 
                label={match.isLive ? 'LIVE' : (match.isEnded ? 'COMPLETED' : 'UPCOMING')} 
                color={match.isLive ? 'error' : (match.isEnded ? 'default' : 'primary')} 
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {match.venue}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {match.matchTime}
              </Typography>
              {match.isEnded && match.result && (
                <Typography variant="body2" align="center" sx={{ fontWeight: 'bold', mt: 1 }}>
                  {match.result}
                </Typography>
              )}
              {!match.isEnded && match.result && (
                <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                  {match.result}
                </Typography>
              )}
            </Box>
            
            {match.id && !match.id.startsWith('mock') && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button 
                  component={Link}
                  to={`/match/${match.id}`}
                  variant="contained" 
                  color="primary"
                  size="small"
                >
                  Match Details
                </Button>
              </Box>
            )}
            
            {dataSource && (
              <Box sx={{ mt: 2, textAlign: 'center', fontSize: '0.75rem', color: 'text.secondary' }}>
                <Typography variant="caption">
                  Data source: {dataSource} {lastUpdated && `(Updated: ${lastUpdated.toLocaleTimeString()})`}
                </Typography>
              </Box>
            )}
          </>
        ) : (
          <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="body1" color="text.secondary">
              No IPL matches scheduled for today.
            </Typography>
          </Box>
        )}
      </CardContent>
    </MatchCard>
  );
};

export default IPLTodaysMatch;
