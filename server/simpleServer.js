/**
 * Simple Express Server
 * This server provides a basic API endpoint to check database connectivity
 * and serves the React app
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
const dbConfig = require('../src/config/db.config');
const apiRoutes = require('./routes/api');
const { testConnection } = require('./db/mysql');
const pool = mysql.createPool(dbConfig);
const axios = require('axios');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5001; // Use PORT environment variable or default to 5001

// Enhanced CORS configuration
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../build')));

// Also serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Log all API requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Register API routes
app.use('/api', apiRoutes);

// Add a dedicated endpoint for live cricket match data that won't conflict with other routes
app.get('/api/live-cricket-match', async (req, res) => {
  console.log('Received request for live cricket match data');
  
  try {
    // Try to fetch from cricket API
    try {
      const apiUrl = process.env.CRICKET_API_BASE_URL + '/currentMatches';
      const apiKey = process.env.REACT_APP_CRICKET_API_KEY;
      
      console.log(`Fetching from API: ${apiUrl} with key: ${apiKey}`);
      
      const response = await axios.get(apiUrl, {
        params: {
          apikey: apiKey,
          offset: 0
        }
      });
      
      console.log(`API Response status: ${response.status}`);
      console.log('API Response data:', JSON.stringify(response.data).substring(0, 500) + '...');
      
      if (response.data && response.data.status === 'success' && response.data.data && response.data.data.length > 0) {
        console.log(`Found ${response.data.data.length} matches in API response`);
        
        // Get the first match from the API response
        const currentMatch = response.data.data[0];
        console.log(`Selected match: ${currentMatch.name}`);
        
        // Check if match is in progress or has ended
        const matchStatus = currentMatch.status || '';
        const isMatchLive = matchStatus.toLowerCase().includes('live') || 
                           matchStatus.toLowerCase().includes('in progress') || 
                           matchStatus.toLowerCase().includes('innings break');
        const isMatchEnded = matchStatus.toLowerCase().includes('complete') || 
                            matchStatus.toLowerCase().includes('finished') || 
                            matchStatus.toLowerCase().includes('ended') ||
                            matchStatus.toLowerCase().includes('abandoned') ||
                            matchStatus.toLowerCase().includes('canceled') ||
                            matchStatus.toLowerCase().includes('cancelled') ||
                            matchStatus.toLowerCase().includes('result');
        
        console.log(`Match status: ${matchStatus}, isLive: ${isMatchLive}, isEnded: ${isMatchEnded}`);
        
        // Format the API response to match our expected format
        const formattedMatch = {
          id: currentMatch.id || 'current-match',
          title: currentMatch.name || 'Unknown Match',
          venue: currentMatch.venue || 'Unknown Venue',
          date: currentMatch.date || new Date().toISOString().split('T')[0],
          status: currentMatch.status || 'Live',
          format: currentMatch.matchType || 'Unknown',
          isLive: isMatchLive,
          isEnded: isMatchEnded,
          team1: {
            name: currentMatch.teams && currentMatch.teams[0] ? currentMatch.teams[0] : 'Team 1',
            shortName: currentMatch.teamInfo && currentMatch.teamInfo[0] ? currentMatch.teamInfo[0].shortname : 'T1',
            score: currentMatch.score && currentMatch.score[0] ? 
              `${currentMatch.score[0].r}/${currentMatch.score[0].w}` : 'No score',
            overs: currentMatch.score && currentMatch.score[0] ? 
              `${currentMatch.score[0].o}` : '0'
          },
          team2: {
            name: currentMatch.teams && currentMatch.teams[1] ? currentMatch.teams[1] : 'Team 2',
            shortName: currentMatch.teamInfo && currentMatch.teamInfo[1] ? currentMatch.teamInfo[1].shortname : 'T2',
            score: currentMatch.score && currentMatch.score[1] ? 
              `${currentMatch.score[1].r}/${currentMatch.score[1].w}` : 'No score',
            overs: currentMatch.score && currentMatch.score[1] ? 
              `${currentMatch.score[1].o}` : '0'
          },
          toss: {
            winner: currentMatch.tossWinner || (currentMatch.teams ? currentMatch.teams[0] : 'Unknown'),
            decision: currentMatch.tossChoice || 'bat'
          },
          currentInnings: currentMatch.score && currentMatch.score.length > 1 ? 2 : 1,
          target: 0,
          runsNeeded: 0,
          ballsRemaining: 0,
          requiredRunRate: 0,
          currentBatters: [
            {
              name: 'Batter 1',
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              strikeRate: 0
            },
            {
              name: 'Batter 2',
              runs: 0,
              balls: 0,
              fours: 0,
              sixes: 0,
              strikeRate: 0
            }
          ],
          currentBowler: {
            name: 'Bowler',
            overs: '0',
            maidens: 0,
            runs: 0,
            wickets: 0,
            economy: 0
          },
          recentOvers: [
            { over: 1, runs: 0, wickets: 0, details: 'No data available' }
          ],
          partnership: {
            runs: 0,
            balls: 0
          },
          lastWicket: {
            player: 'None',
            score: 0,
            dismissal: 'None',
            over: '0'
          },
          commentary: [
            { over: '0.0', text: 'Live match data from CricAPI' }
          ]
        };
        
        // Calculate some additional stats if possible
        if (currentMatch.score && currentMatch.score.length > 1) {
          const team1Score = parseInt(currentMatch.score[0].r) || 0;
          const team2Score = parseInt(currentMatch.score[1].r) || 0;
          formattedMatch.target = team1Score + 1;
          formattedMatch.runsNeeded = Math.max(0, formattedMatch.target - team2Score);
          
          // Calculate balls remaining if possible
          if (currentMatch.score[1].o) {
            const oversCompleted = parseFloat(currentMatch.score[1].o);
            const totalOvers = currentMatch.matchType === 't20' ? 20 : 50; // Adjust based on match type
            const ballsRemaining = Math.max(0, (totalOvers - oversCompleted) * 6);
            formattedMatch.ballsRemaining = ballsRemaining;
            
            // Calculate required run rate
            if (ballsRemaining > 0) {
              formattedMatch.requiredRunRate = (formattedMatch.runsNeeded * 6 / ballsRemaining).toFixed(2);
            }
          }
        }
        
        console.log('Sending formatted match data to client');
        return res.json(formattedMatch);
      } else {
        console.log('No matches found in API response or invalid response structure, falling back to mock data');
        return res.json(getMockMatchData());
      }
    } catch (apiError) {
      console.error('Error fetching from cricket API:', apiError.message);
      console.log('Falling back to mock data due to API error');
      return res.json(getMockMatchData());
    }
  } catch (error) {
    console.error('Error fetching match data:', error);
    // Always return mock data instead of an error
    console.log('Falling back to mock data due to general error');
    return res.json(getMockMatchData());
  }
});

// API endpoint to get current match data - Define this AFTER the API routes to override any conflicting routes
app.get('/api/matches/current', async (req, res) => {
    console.log('Received request for current match data');
    
    try {
        // Try to fetch from cricket API
        try {
            const apiUrl = process.env.CRICKET_API_BASE_URL + '/currentMatches';
            const apiKey = process.env.REACT_APP_CRICKET_API_KEY;
            
            console.log(`Fetching from API: ${apiUrl} with key: ${apiKey}`);
            
            const response = await axios.get(apiUrl, {
                params: {
                    apikey: apiKey,
                    offset: 0
                }
            });
            
            console.log(`API Response status: ${response.status}`);
            console.log('API Response data:', JSON.stringify(response.data).substring(0, 500) + '...');
            
            if (response.data && response.data.status === 'success' && response.data.data && response.data.data.length > 0) {
                console.log(`Found ${response.data.data.length} matches in API response`);
                
                // Get the first match from the API response
                const currentMatch = response.data.data[0];
                console.log(`Selected match: ${currentMatch.name}`);
                
                // Format the API response to match our expected format
                const formattedMatch = {
                    id: currentMatch.id || 'current-match',
                    title: currentMatch.name || 'Unknown Match',
                    venue: currentMatch.venue || 'Unknown Venue',
                    date: currentMatch.date || new Date().toISOString().split('T')[0],
                    status: currentMatch.status || 'Live',
                    format: currentMatch.matchType || 'Unknown',
                    team1: {
                        name: currentMatch.teams && currentMatch.teams[0] ? currentMatch.teams[0] : 'Team 1',
                        shortName: currentMatch.teamInfo && currentMatch.teamInfo[0] ? currentMatch.teamInfo[0].shortname : 'T1',
                        score: currentMatch.score && currentMatch.score[0] ? 
                            `${currentMatch.score[0].r}/${currentMatch.score[0].w}` : 'No score',
                        overs: currentMatch.score && currentMatch.score[0] ? 
                            `${currentMatch.score[0].o}` : '0'
                    },
                    team2: {
                        name: currentMatch.teams && currentMatch.teams[1] ? currentMatch.teams[1] : 'Team 2',
                        shortName: currentMatch.teamInfo && currentMatch.teamInfo[1] ? currentMatch.teamInfo[1].shortname : 'T2',
                        score: currentMatch.score && currentMatch.score[1] ? 
                            `${currentMatch.score[1].r}/${currentMatch.score[1].w}` : 'No score',
                        overs: currentMatch.score && currentMatch.score[1] ? 
                            `${currentMatch.score[1].o}` : '0'
                    },
                    toss: {
                        winner: currentMatch.tossWinner || (currentMatch.teams ? currentMatch.teams[0] : 'Unknown'),
                        decision: currentMatch.tossChoice || 'bat'
                    },
                    currentInnings: currentMatch.score && currentMatch.score.length > 1 ? 2 : 1,
                    target: 0,
                    runsNeeded: 0,
                    ballsRemaining: 0,
                    requiredRunRate: 0,
                    currentBatters: [
                        {
                            name: 'Batter 1',
                            runs: 0,
                            balls: 0,
                            fours: 0,
                            sixes: 0,
                            strikeRate: 0
                        },
                        {
                            name: 'Batter 2',
                            runs: 0,
                            balls: 0,
                            fours: 0,
                            sixes: 0,
                            strikeRate: 0
                        }
                    ],
                    currentBowler: {
                        name: 'Bowler',
                        overs: '0',
                        maidens: 0,
                        runs: 0,
                        wickets: 0,
                        economy: 0
                    },
                    recentOvers: [
                        { over: 1, runs: 0, wickets: 0, details: 'No data available' }
                    ],
                    partnership: {
                        runs: 0,
                        balls: 0
                    },
                    lastWicket: {
                        player: 'None',
                        score: 0,
                        dismissal: 'None',
                        over: '0'
                    },
                    commentary: [
                        { over: '0.0', text: 'Live match data from CricAPI' }
                    ]
                };
                
                // Calculate some additional stats if possible
                if (currentMatch.score && currentMatch.score.length > 1) {
                    const team1Score = parseInt(currentMatch.score[0].r) || 0;
                    const team2Score = parseInt(currentMatch.score[1].r) || 0;
                    formattedMatch.target = team1Score + 1;
                    formattedMatch.runsNeeded = Math.max(0, formattedMatch.target - team2Score);
                    
                    // Calculate balls remaining if possible
                    if (currentMatch.score[1].o) {
                        const oversCompleted = parseFloat(currentMatch.score[1].o);
                        const totalOvers = currentMatch.matchType === 't20' ? 20 : 50; // Adjust based on match type
                        const ballsRemaining = Math.max(0, (totalOvers - oversCompleted) * 6);
                        formattedMatch.ballsRemaining = ballsRemaining;
                        
                        // Calculate required run rate
                        if (ballsRemaining > 0) {
                            formattedMatch.requiredRunRate = (formattedMatch.runsNeeded * 6 / ballsRemaining).toFixed(2);
                        }
                    }
                }
                
                console.log('Sending formatted match data to client');
                return res.json(formattedMatch);
            } else {
                console.log('No matches found in API response or invalid response structure, falling back to mock data');
                return res.json(getMockMatchData());
            }
        } catch (apiError) {
            console.error('Error fetching from cricket API:', apiError.message);
            console.log('Falling back to mock data due to API error');
            return res.json(getMockMatchData());
        }
    } catch (error) {
        console.error('Error fetching match data:', error);
        // Always return mock data instead of an error
        console.log('Falling back to mock data due to general error');
        return res.json(getMockMatchData());
    }
});

// API endpoint to get all live cricket matches
app.get('/api/live-cricket-matches', async (req, res) => {
  console.log('Received request for all live cricket matches');
  const teamFilter = req.query.team; // Get team filter from query parameter
  console.log(`Team filter: ${teamFilter || 'none'}`);
  
  try {
    // Try to fetch from cricket API
    try {
      const apiUrl = process.env.CRICKET_API_BASE_URL + '/matches';
      const apiKey = process.env.REACT_APP_CRICKET_API_KEY;
      
      console.log(`Fetching matches from API: ${apiUrl} with key: ${apiKey}`);
      
      // First try to get Pakistan's latest T20 match specifically
      let pakMatch = null;
      if (!teamFilter || teamFilter.toLowerCase() === 'pakistan') {
        try {
          console.log('Attempting to fetch Pakistan T20 match...');
          const pakResponse = await axios.get(process.env.CRICKET_API_BASE_URL + '/matches', {
            params: {
              apikey: apiKey,
              offset: 0,
              team: 'pakistan',
              matchType: 't20'
            }
          });
          
          if (pakResponse.data && pakResponse.data.status === 'success' && 
              pakResponse.data.data && pakResponse.data.data.length > 0) {
            console.log(`Found ${pakResponse.data.data.length} Pakistan matches`);
            // Find the most recent or live match
            const liveMatch = pakResponse.data.data.find(m => 
              (m.status && m.status.toLowerCase().includes('live')) || 
              (m.status && m.status.toLowerCase().includes('in progress'))
            );
            
            if (liveMatch) {
              console.log('Found live Pakistan T20 match!');
              pakMatch = liveMatch;
            } else {
              // If no live match, get the most recent one
              pakMatch = pakResponse.data.data[0];
              console.log('Using most recent Pakistan T20 match');
            }
          }
        } catch (pakError) {
          console.error('Error fetching Pakistan match:', pakError.message);
        }
      }
      
      // Now get all live matches
      const response = await axios.get(apiUrl, {
        params: {
          apikey: apiKey,
          offset: 0,
          status: 'live'
        }
      });
      
      console.log(`API Response status: ${response.status}`);
      
      let allMatches = [];
      
      if (response.data && response.data.status === 'success' && response.data.data && response.data.data.length > 0) {
        console.log(`Found ${response.data.data.length} live matches in API response`);
        allMatches = response.data.data;
      }
      
      // Add Pakistan match if found and not already in the list
      if (pakMatch) {
        const pakMatchExists = allMatches.some(m => m.id === pakMatch.id);
        if (!pakMatchExists) {
          console.log('Adding Pakistan match to results');
          allMatches.push(pakMatch);
        }
      }
      
      if (allMatches.length > 0) {
        // Format the matches data
        const formattedMatches = allMatches.map(match => {
          // Check if match is in progress or has ended
          const matchStatus = match.status || '';
          const isMatchLive = matchStatus.toLowerCase().includes('live') || 
                             matchStatus.toLowerCase().includes('in progress') || 
                             matchStatus.toLowerCase().includes('innings break');
          const isMatchEnded = matchStatus.toLowerCase().includes('complete') || 
                              matchStatus.toLowerCase().includes('finished') || 
                              matchStatus.toLowerCase().includes('ended') ||
                              matchStatus.toLowerCase().includes('abandoned') ||
                              matchStatus.toLowerCase().includes('canceled') ||
                              matchStatus.toLowerCase().includes('cancelled') ||
                              matchStatus.toLowerCase().includes('result');
          
          // Check if this is the Pakistan match
          const isPakistanMatch = match.teams && 
            match.teams.some(team => team && team.toLowerCase().includes('pakistan'));
          
          return {
            id: match.id || `match-${Math.random().toString(36).substr(2, 9)}`,
            title: match.name || 'Unknown Match',
            venue: match.venue || 'Unknown Venue',
            date: match.date || new Date().toISOString().split('T')[0],
            status: match.status || 'Live',
            format: match.matchType || 'Unknown',
            isLive: isMatchLive,
            isEnded: isMatchEnded,
            isPakistanMatch: isPakistanMatch,
            team1: {
              name: match.teams && match.teams[0] ? match.teams[0] : 'Team 1',
              shortName: match.teamInfo && match.teamInfo[0] ? match.teamInfo[0].shortname : 'T1',
              score: match.score && match.score[0] ? 
                `${match.score[0].r}/${match.score[0].w}` : 'No score',
              overs: match.score && match.score[0] ? 
                `${match.score[0].o}` : '0'
            },
            team2: {
              name: match.teams && match.teams[1] ? match.teams[1] : 'Team 2',
              shortName: match.teamInfo && match.teamInfo[1] ? match.teamInfo[1].shortname : 'T2',
              score: match.score && match.score[1] ? 
                `${match.score[1].r}/${match.score[1].w}` : 'No score',
              overs: match.score && match.score[1] ? 
                `${match.score[1].o}` : '0'
            }
          };
        });
        
        // Filter matches by team if specified
        let filteredMatches = formattedMatches;
        if (teamFilter) {
          const teamFilterLower = teamFilter.toLowerCase();
          filteredMatches = formattedMatches.filter(match => 
            (match.team1.name.toLowerCase().includes(teamFilterLower) || 
             match.team2.name.toLowerCase().includes(teamFilterLower))
          );
        }
        
        console.log(`Sending ${filteredMatches.length} formatted matches data to client`);
        return res.json({ matches: filteredMatches });
      } else {
        console.log('No matches found in API response or invalid response structure, falling back to mock data');
        return res.json({ matches: getMockMatchesWithPakistan() });
      }
    } catch (apiError) {
      console.error('Error fetching from cricket API:', apiError.message);
      console.log('Falling back to mock data due to API error');
      return res.json({ matches: getMockMatchesWithPakistan() });
    }
  } catch (error) {
    console.error('Error fetching matches data:', error);
    // Always return mock data instead of an error
    console.log('Falling back to mock data due to general error');
    return res.json({ matches: getMockMatchesWithPakistan() });
  }
});

// API endpoint to get all cricket series
app.get('/api/cricket-series', async (req, res) => {
  console.log('Received request for cricket series');
  const { search, status } = req.query;
  
  try {
    // Try to fetch from cricket API
    try {
      const apiUrl = process.env.CRICKET_API_BASE_URL + '/series';
      const apiKey = process.env.REACT_APP_CRICKET_API_KEY;
      
      console.log(`Fetching series from API: ${apiUrl} with key: ${apiKey}`);
      
      const params = {
        apikey: apiKey,
        offset: 0
      };
      
      // Add search parameter if provided
      if (search) {
        params.search = search;
      }
      
      const response = await axios.get(apiUrl, { params });
      
      console.log(`API Response status: ${response.status}`);
      
      if (response.data && response.data.status === 'success' && response.data.data && response.data.data.length > 0) {
        console.log(`Found ${response.data.data.length} series in API response`);
        
        // Format the series data
        const formattedSeries = response.data.data.map(series => {
          // Determine series status
          const startDate = new Date(series.startDate);
          const endDate = new Date(series.endDate);
          const today = new Date();
          
          let seriesStatus = 'upcoming';
          if (today > endDate) {
            seriesStatus = 'completed';
          } else if (today >= startDate && today <= endDate) {
            seriesStatus = 'ongoing';
          }
          
          // Filter by status if requested
          if (status && status !== seriesStatus) {
            return null;
          }
          
          return {
            id: series.id,
            name: series.name,
            startDate: series.startDate,
            endDate: series.endDate,
            odi: series.odi || 0,
            t20: series.t20 || 0,
            test: series.test || 0,
            status: seriesStatus,
            matches: series.matches || [],
            squads: series.squads || [],
            teams: series.teams || []
          };
        }).filter(Boolean); // Remove null entries (filtered out by status)
        
        console.log(`Sending ${formattedSeries.length} formatted series data to client`);
        return res.json({ series: formattedSeries });
      } else {
        console.log('No series found in API response or invalid response structure, falling back to mock data');
        return res.json({ series: getMockSeries(status) });
      }
    } catch (apiError) {
      console.error('Error fetching from cricket API:', apiError.message);
      console.log('Falling back to mock data due to API error');
      return res.json({ series: getMockSeries(status) });
    }
  } catch (error) {
    console.error('Error fetching series data:', error);
    // Always return mock data instead of an error
    console.log('Falling back to mock data due to general error');
    return res.json({ series: getMockSeries(status) });
  }
});

// API endpoint to get series details by ID
app.get('/api/cricket-series/:seriesId', async (req, res) => {
  const { seriesId } = req.params;
  console.log(`Received request for series details: ${seriesId}`);
  
  try {
    // Try to fetch from cricket API
    try {
      const apiUrl = process.env.CRICKET_API_BASE_URL + '/series_info';
      const apiKey = process.env.REACT_APP_CRICKET_API_KEY;
      
      console.log(`Fetching series details from API: ${apiUrl} with key: ${apiKey}`);
      
      const response = await axios.get(apiUrl, {
        params: {
          apikey: apiKey,
          id: seriesId
        }
      });
      
      console.log(`API Response status: ${response.status}`);
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        console.log('Found series details in API response');
        
        const seriesData = response.data.data;
        
        // Determine series status
        const startDate = new Date(seriesData.startDate);
        const endDate = new Date(seriesData.endDate);
        const today = new Date();
        
        let seriesStatus = 'upcoming';
        if (today > endDate) {
          seriesStatus = 'completed';
        } else if (today >= startDate && today <= endDate) {
          seriesStatus = 'ongoing';
        }
        
        // Format the series details
        const formattedSeries = {
          id: seriesData.id,
          name: seriesData.name,
          startDate: seriesData.startDate,
          endDate: seriesData.endDate,
          odi: seriesData.odi || 0,
          t20: seriesData.t20 || 0,
          test: seriesData.test || 0,
          status: seriesStatus,
          matches: seriesData.matches || [],
          pointsTable: seriesData.pointsTable || [],
          teams: seriesData.teams || []
        };
        
        console.log('Sending formatted series details to client');
        return res.json({ series: formattedSeries });
      } else {
        console.log('No series details found in API response or invalid response structure, falling back to mock data');
        return res.json({ series: getMockSeriesDetails(seriesId) });
      }
    } catch (apiError) {
      console.error('Error fetching from cricket API:', apiError.message);
      console.log('Falling back to mock data due to API error');
      return res.json({ series: getMockSeriesDetails(seriesId) });
    }
  } catch (error) {
    console.error('Error fetching series details:', error);
    // Always return mock data instead of an error
    console.log('Falling back to mock data due to general error');
    return res.json({ series: getMockSeriesDetails(seriesId) });
  }
});

// API endpoint to get series matches
app.get('/api/cricket-series/:seriesId/matches', async (req, res) => {
  const { seriesId } = req.params;
  const { status } = req.query;
  console.log(`Received request for series matches: ${seriesId}, status: ${status || 'all'}`);
  
  try {
    // Try to fetch from cricket API
    try {
      const apiUrl = process.env.CRICKET_API_BASE_URL + '/matches_by_series';
      const apiKey = process.env.REACT_APP_CRICKET_API_KEY;
      
      console.log(`Fetching series matches from API: ${apiUrl} with key: ${apiKey}`);
      
      const response = await axios.get(apiUrl, {
        params: {
          apikey: apiKey,
          id: seriesId
        }
      });
      
      console.log(`API Response status: ${response.status}`);
      
      if (response.data && response.data.status === 'success' && response.data.data && response.data.data.length > 0) {
        console.log(`Found ${response.data.data.length} matches in API response`);
        
        // Format the matches data
        const formattedMatches = response.data.data.map(match => {
          // Determine match status
          const matchStatus = match.status || '';
          const isMatchLive = matchStatus.toLowerCase().includes('live') || 
                             matchStatus.toLowerCase().includes('in progress') || 
                             matchStatus.toLowerCase().includes('innings break');
          const isMatchEnded = matchStatus.toLowerCase().includes('complete') || 
                              matchStatus.toLowerCase().includes('finished') || 
                              matchStatus.toLowerCase().includes('ended') ||
                              matchStatus.toLowerCase().includes('abandoned') ||
                              matchStatus.toLowerCase().includes('canceled') ||
                              matchStatus.toLowerCase().includes('cancelled') ||
                              matchStatus.toLowerCase().includes('result');
          
          let matchStatusCategory = 'upcoming';
          if (isMatchLive) {
            matchStatusCategory = 'live';
          } else if (isMatchEnded) {
            matchStatusCategory = 'completed';
          }
          
          // Filter by status if requested
          if (status && status !== matchStatusCategory) {
            return null;
          }
          
          return {
            id: match.id,
            name: match.name,
            status: match.status,
            statusCategory: matchStatusCategory,
            date: match.date,
            dateTimeGMT: match.dateTimeGMT,
            venue: match.venue,
            matchType: match.matchType,
            teams: match.teams || [],
            teamInfo: match.teamInfo || [],
            score: match.score || [],
            tossWinner: match.tossWinner,
            tossChoice: match.tossChoice,
            matchWinner: match.matchWinner
          };
        }).filter(Boolean); // Remove null entries (filtered out by status)
        
        console.log(`Sending ${formattedMatches.length} formatted matches data to client`);
        return res.json({ matches: formattedMatches });
      } else {
        console.log('No matches found in API response or invalid response structure, falling back to mock data');
        return res.json({ matches: getMockSeriesMatches(seriesId, status) });
      }
    } catch (apiError) {
      console.error('Error fetching from cricket API:', apiError.message);
      console.log('Falling back to mock data due to API error');
      return res.json({ matches: getMockSeriesMatches(seriesId, status) });
    }
  } catch (error) {
    console.error('Error fetching series matches:', error);
    // Always return mock data instead of an error
    console.log('Falling back to mock data due to general error');
    return res.json({ matches: getMockSeriesMatches(seriesId, status) });
  }
});

// API endpoint to get series players/squads
app.get('/api/cricket-series/:seriesId/players', async (req, res) => {
  const { seriesId } = req.params;
  const { team } = req.query;
  console.log(`Received request for series players: ${seriesId}, team: ${team || 'all'}`);
  
  try {
    // Try to fetch from cricket API
    try {
      const apiUrl = process.env.CRICKET_API_BASE_URL + '/series_squad';
      const apiKey = process.env.REACT_APP_CRICKET_API_KEY;
      
      console.log(`Fetching series players from API: ${apiUrl} with key: ${apiKey}`);
      
      const response = await axios.get(apiUrl, {
        params: {
          apikey: apiKey,
          id: seriesId
        }
      });
      
      console.log(`API Response status: ${response.status}`);
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        console.log('Found series players in API response');
        
        const squadsData = response.data.data;
        
        // Format the squads data
        const formattedSquads = {};
        
        // Process each team's squad
        Object.keys(squadsData).forEach(teamName => {
          // Filter by team if requested
          if (team && team.toLowerCase() !== teamName.toLowerCase()) {
            return;
          }
          
          const players = squadsData[teamName].map(player => ({
            id: player.id,
            name: player.name,
            role: player.role,
            battingStyle: player.battingStyle,
            bowlingStyle: player.bowlingStyle,
            country: player.country,
            playerImg: player.playerImg || '/assets/images/players/default.svg'
          }));
          
          formattedSquads[teamName] = players;
        });
        
        console.log('Sending formatted squads data to client');
        return res.json({ squads: formattedSquads });
      } else {
        console.log('No squads found in API response or invalid response structure, falling back to mock data');
        return res.json({ squads: getMockSeriesSquads(seriesId, team) });
      }
    } catch (apiError) {
      console.error('Error fetching from cricket API:', apiError.message);
      console.log('Falling back to mock data due to API error');
      return res.json({ squads: getMockSeriesSquads(seriesId, team) });
    }
  } catch (error) {
    console.error('Error fetching series players:', error);
    // Always return mock data instead of an error
    console.log('Falling back to mock data due to general error');
    return res.json({ squads: getMockSeriesSquads(seriesId, team) });
  }
});

// API endpoint to get player details
app.get('/api/player/:playerId', async (req, res) => {
  const { playerId } = req.params;
  console.log(`Received request for player details: ${playerId}`);
  
  try {
    // Try to fetch from cricket API
    try {
      const apiUrl = process.env.CRICKET_API_BASE_URL + '/player_info';
      const apiKey = process.env.REACT_APP_CRICKET_API_KEY;
      
      console.log(`Fetching player details from API: ${apiUrl} with key: ${apiKey}`);
      
      const response = await axios.get(apiUrl, {
        params: {
          apikey: apiKey,
          id: playerId
        }
      });
      
      console.log(`API Response status: ${response.status}`);
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        console.log('Found player details in API response');
        
        const playerData = response.data.data;
        
        // Format the player details
        const formattedPlayer = {
          id: playerData.id,
          name: playerData.name,
          country: playerData.country,
          playerImg: playerData.playerImg || '/assets/images/players/default.svg',
          dateOfBirth: playerData.dateOfBirth,
          role: playerData.role,
          battingStyle: playerData.battingStyle,
          bowlingStyle: playerData.bowlingStyle,
          placeOfBirth: playerData.placeOfBirth,
          stats: playerData.stats || {},
          teams: playerData.teams || []
        };
        
        console.log('Sending formatted player details to client');
        return res.json({ player: formattedPlayer });
      } else {
        console.log('No player details found in API response or invalid response structure, falling back to mock data');
        return res.json({ player: getMockPlayerDetails(playerId) });
      }
    } catch (apiError) {
      console.error('Error fetching from cricket API:', apiError.message);
      console.log('Falling back to mock data due to API error');
      return res.json({ player: getMockPlayerDetails(playerId) });
    }
  } catch (error) {
    console.error('Error fetching player details:', error);
    // Always return mock data instead of an error
    console.log('Falling back to mock data due to general error');
    return res.json({ player: getMockPlayerDetails(playerId) });
  }
});

// Function to get mock series data
function getMockSeries(status) {
  const mockSeries = [
    {
      id: 'ipl-2024',
      name: 'Indian Premier League 2024',
      startDate: '2024-03-22',
      endDate: '2024-05-26',
      odi: 0,
      t20: 74,
      test: 0,
      status: 'ongoing'
    },
    {
      id: 'wc-2023',
      name: 'ICC Cricket World Cup 2023',
      startDate: '2023-10-05',
      endDate: '2023-11-19',
      odi: 48,
      t20: 0,
      test: 0,
      status: 'completed'
    },
    {
      id: 'aus-ind-2024',
      name: 'Australia tour of India 2024',
      startDate: '2024-09-22',
      endDate: '2024-10-15',
      odi: 3,
      t20: 3,
      test: 5,
      status: 'upcoming'
    },
    {
      id: 'eng-wi-2024',
      name: 'England tour of West Indies 2024',
      startDate: '2024-04-10',
      endDate: '2024-05-02',
      odi: 3,
      t20: 5,
      test: 0,
      status: 'ongoing'
    },
    {
      id: 'pak-nz-2024',
      name: 'Pakistan tour of New Zealand 2024',
      startDate: '2024-01-12',
      endDate: '2024-01-21',
      odi: 0,
      t20: 5,
      test: 0,
      status: 'completed'
    },
    {
      id: 'sl-ban-2024',
      name: 'Sri Lanka tour of Bangladesh 2024',
      startDate: '2024-08-15',
      endDate: '2024-09-05',
      odi: 3,
      t20: 3,
      test: 2,
      status: 'upcoming'
    }
  ];
  
  // Filter by status if requested
  if (status) {
    return mockSeries.filter(series => series.status === status);
  }
  
  return mockSeries;
}

// Function to get mock series details
function getMockSeriesDetails(seriesId) {
  // Get basic series info
  const seriesInfo = getMockSeries().find(series => series.id === seriesId) || {
    id: seriesId,
    name: `Series ${seriesId}`,
    startDate: '2024-03-22',
    endDate: '2024-05-26',
    odi: 0,
    t20: 10,
    test: 0,
    status: 'ongoing'
  };
  
  // Add additional details
  const seriesDetails = {
    ...seriesInfo,
    matches: getMockSeriesMatches(seriesId),
    pointsTable: [
      {
        team: 'Chennai Super Kings',
        matches: 5,
        won: 4,
        lost: 1,
        tied: 0,
        nr: 0,
        points: 8,
        nrr: '+1.254'
      },
      {
        team: 'Mumbai Indians',
        matches: 5,
        won: 3,
        lost: 2,
        tied: 0,
        nr: 0,
        points: 6,
        nrr: '+0.875'
      },
      {
        team: 'Royal Challengers Bangalore',
        matches: 5,
        won: 3,
        lost: 2,
        tied: 0,
        nr: 0,
        points: 6,
        nrr: '+0.325'
      },
      {
        team: 'Kolkata Knight Riders',
        matches: 5,
        won: 2,
        lost: 3,
        tied: 0,
        nr: 0,
        points: 4,
        nrr: '-0.125'
      }
    ],
    teams: ['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bangalore', 'Kolkata Knight Riders']
  };
  
  return seriesDetails;
}

// Function to get mock series matches
function getMockSeriesMatches(seriesId, status) {
  const mockMatches = [
    {
      id: `${seriesId}-match-1`,
      name: 'Chennai Super Kings vs Mumbai Indians',
      status: 'Completed',
      statusCategory: 'completed',
      date: '2024-03-22',
      dateTimeGMT: '2024-03-22T14:00:00',
      venue: 'M.A. Chidambaram Stadium, Chennai',
      matchType: 'T20',
      teams: ['Chennai Super Kings', 'Mumbai Indians'],
      teamInfo: [
        { name: 'Chennai Super Kings', shortname: 'CSK' },
        { name: 'Mumbai Indians', shortname: 'MI' }
      ],
      score: [
        { r: 182, w: 8, o: 20, inning: 'Chennai Super Kings' },
        { r: 156, w: 10, o: 18.5, inning: 'Mumbai Indians' }
      ],
      tossWinner: 'Chennai Super Kings',
      tossChoice: 'bat',
      matchWinner: 'Chennai Super Kings'
    },
    {
      id: `${seriesId}-match-2`,
      name: 'Royal Challengers Bangalore vs Kolkata Knight Riders',
      status: 'Live',
      statusCategory: 'live',
      date: new Date().toISOString().split('T')[0],
      dateTimeGMT: new Date().toISOString(),
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      matchType: 'T20',
      teams: ['Royal Challengers Bangalore', 'Kolkata Knight Riders'],
      teamInfo: [
        { name: 'Royal Challengers Bangalore', shortname: 'RCB' },
        { name: 'Kolkata Knight Riders', shortname: 'KKR' }
      ],
      score: [
        { r: 204, w: 4, o: 20, inning: 'Royal Challengers Bangalore' },
        { r: 156, w: 5, o: 16.2, inning: 'Kolkata Knight Riders' }
      ],
      tossWinner: 'Royal Challengers Bangalore',
      tossChoice: 'bat',
      matchWinner: ''
    },
    {
      id: `${seriesId}-match-3`,
      name: 'Chennai Super Kings vs Royal Challengers Bangalore',
      status: 'Upcoming',
      statusCategory: 'upcoming',
      date: '2024-04-02',
      dateTimeGMT: '2024-04-02T14:00:00',
      venue: 'M.A. Chidambaram Stadium, Chennai',
      matchType: 'T20',
      teams: ['Chennai Super Kings', 'Royal Challengers Bangalore'],
      teamInfo: [
        { name: 'Chennai Super Kings', shortname: 'CSK' },
        { name: 'Royal Challengers Bangalore', shortname: 'RCB' }
      ],
      score: [],
      tossWinner: '',
      tossChoice: '',
      matchWinner: ''
    }
  ];
  
  // Filter by status if requested
  if (status) {
    return mockMatches.filter(match => match.statusCategory === status);
  }
  
  return mockMatches;
}

// Function to get mock series squads
function getMockSeriesSquads(seriesId, teamFilter) {
  const mockSquads = {
    'Chennai Super Kings': [
      {
        id: 'player-1',
        name: 'MS Dhoni',
        role: 'Wicket-keeper Batsman',
        battingStyle: 'Right-handed',
        bowlingStyle: 'Right-arm medium',
        country: 'India',
        playerImg: '/assets/images/players/default.svg'
      },
      {
        id: 'player-2',
        name: 'Ravindra Jadeja',
        role: 'All-rounder',
        battingStyle: 'Left-handed',
        bowlingStyle: 'Left-arm orthodox',
        country: 'India',
        playerImg: '/assets/images/players/default.svg'
      }
    ],
    'Mumbai Indians': [
      {
        id: 'player-3',
        name: 'Rohit Sharma',
        role: 'Batsman',
        battingStyle: 'Right-handed',
        bowlingStyle: 'Right-arm off break',
        country: 'India',
        playerImg: '/assets/images/players/default.svg'
      },
      {
        id: 'player-4',
        name: 'Jasprit Bumrah',
        role: 'Bowler',
        battingStyle: 'Right-handed',
        bowlingStyle: 'Right-arm fast',
        country: 'India',
        playerImg: '/assets/images/players/default.svg'
      }
    ]
  };
  
  // Filter by team if requested
  if (teamFilter) {
    const filteredSquads = {};
    Object.keys(mockSquads).forEach(team => {
      if (team.toLowerCase().includes(teamFilter.toLowerCase())) {
        filteredSquads[team] = mockSquads[team];
      }
    });
    return filteredSquads;
  }
  
  return mockSquads;
}

// Function to get mock player details
function getMockPlayerDetails(playerId) {
  return {
    id: playerId,
    name: playerId === 'player-1' ? 'MS Dhoni' : 
          playerId === 'player-2' ? 'Ravindra Jadeja' : 
          playerId === 'player-3' ? 'Rohit Sharma' : 
          playerId === 'player-4' ? 'Jasprit Bumrah' : `Player ${playerId}`,
    country: 'India',
    playerImg: '/assets/images/players/default.svg',
    dateOfBirth: '1981-07-07',
    role: 'Wicket-keeper Batsman',
    battingStyle: 'Right-handed',
    bowlingStyle: 'Right-arm medium',
    placeOfBirth: 'Ranchi, Bihar (now Jharkhand), India',
    stats: {
      batting: {
        test: {
          matches: 90,
          innings: 144,
          runs: 4876,
          highest: 224,
          average: 38.09,
          hundreds: 6,
          fifties: 33,
          fours: 544,
          sixes: 78
        },
        odi: {
          matches: 350,
          innings: 297,
          runs: 10773,
          highest: 183,
          average: 50.57,
          hundreds: 10,
          fifties: 73,
          fours: 826,
          sixes: 229
        },
        t20i: {
          matches: 98,
          innings: 85,
          runs: 1617,
          highest: 56,
          average: 37.60,
          hundreds: 0,
          fifties: 2,
          fours: 116,
          sixes: 52
        }
      },
      bowling: {
        test: {
          matches: 90,
          innings: 36,
          wickets: 0,
          bestInnings: '0/0',
          bestMatch: '0/0',
          average: 0,
          economy: 0,
          strikeRate: 0
        },
        odi: {
          matches: 350,
          innings: 36,
          wickets: 1,
          bestInnings: '1/14',
          bestMatch: '1/14',
          average: 31.00,
          economy: 5.17,
          strikeRate: 36.0
        },
        t20i: {
          matches: 98,
          innings: 0,
          wickets: 0,
          bestInnings: '0/0',
          bestMatch: '0/0',
          average: 0,
          economy: 0,
          strikeRate: 0
        }
      }
    },
    teams: ['India', 'Chennai Super Kings', 'Rising Pune Supergiants']
  };
}

// API endpoint to get match data by ID
app.get('/api/matches/:id', async (req, res) => {
    const matchId = req.params.id;
    console.log(`Received request for match ID: ${matchId}`);
    
    try {
        // Try to fetch from cricket API
        try {
            const apiUrl = process.env.CRICKET_API_BASE_URL + '/currentMatches';
            const apiKey = process.env.REACT_APP_CRICKET_API_KEY;
            
            console.log(`Fetching from API: ${apiUrl} with key: ${apiKey}`);
            
            const response = await axios.get(apiUrl, {
                params: {
                    apikey: apiKey,
                    offset: 0
                }
            });
            
            console.log(`API Response status: ${response.status}`);
            console.log('API Response data structure:', JSON.stringify(response.data ? Object.keys(response.data) : 'No data'));
            
            if (response.data && response.data.status === 'success' && response.data.data && response.data.data.length > 0) {
                console.log(`Found ${response.data.data.length} matches in API response`);
                
                // Get the first match from the API response or a specific match if ID is provided
                let currentMatch;
                
                if (matchId === 'current') {
                    // Get the first match if 'current' is specified
                    currentMatch = response.data.data[0];
                    console.log(`Selected first match: ${currentMatch.name}`);
                } else {
                    // Try to find a match with the specified ID
                    currentMatch = response.data.data.find(match => match.id === matchId);
                    
                    // If no match found with the ID, return the first match
                    if (!currentMatch) {
                        console.log(`Match with ID ${matchId} not found, using first match`);
                        currentMatch = response.data.data[0];
                    } else {
                        console.log(`Found match with ID ${matchId}: ${currentMatch.name}`);
                    }
                }
                
                // Format the API response to match our expected format
                const formattedMatch = {
                    id: currentMatch.id || matchId,
                    title: currentMatch.name || 'Unknown Match',
                    venue: currentMatch.venue || 'Unknown Venue',
                    date: currentMatch.date || new Date().toISOString().split('T')[0],
                    status: currentMatch.status || 'Live',
                    format: currentMatch.matchType || 'Unknown',
                    team1: {
                        name: currentMatch.teams && currentMatch.teams[0] ? currentMatch.teams[0] : 'Team 1',
                        shortName: currentMatch.teamInfo && currentMatch.teamInfo[0] ? currentMatch.teamInfo[0].shortname : 'T1',
                        score: currentMatch.score && currentMatch.score[0] ? 
                            `${currentMatch.score[0].r}/${currentMatch.score[0].w}` : 'No score',
                        overs: currentMatch.score && currentMatch.score[0] ? 
                            `${currentMatch.score[0].o}` : '0'
                    },
                    team2: {
                        name: currentMatch.teams && currentMatch.teams[1] ? currentMatch.teams[1] : 'Team 2',
                        shortName: currentMatch.teamInfo && currentMatch.teamInfo[1] ? currentMatch.teamInfo[1].shortname : 'T2',
                        score: currentMatch.score && currentMatch.score[1] ? 
                            `${currentMatch.score[1].r}/${currentMatch.score[1].w}` : 'No score',
                        overs: currentMatch.score && currentMatch.score[1] ? 
                            `${currentMatch.score[1].o}` : '0'
                    },
                    toss: {
                        winner: currentMatch.teams ? currentMatch.teams[0] : 'Unknown',
                        decision: 'bat'
                    },
                    currentInnings: currentMatch.score && currentMatch.score.length > 1 ? 2 : 1,
                    target: 0,
                    runsNeeded: 0,
                    ballsRemaining: 0,
                    requiredRunRate: 0,
                    currentBatters: [
                        {
                            name: 'Batter 1',
                            runs: 0,
                            balls: 0,
                            fours: 0,
                            sixes: 0,
                            strikeRate: 0
                        },
                        {
                            name: 'Batter 2',
                            runs: 0,
                            balls: 0,
                            fours: 0,
                            sixes: 0,
                            strikeRate: 0
                        }
                    ],
                    currentBowler: {
                        name: 'Bowler',
                        overs: '0',
                        maidens: 0,
                        runs: 0,
                        wickets: 0,
                        economy: 0
                    },
                    recentOvers: [
                        { over: 1, runs: 0, wickets: 0, details: 'No data available' }
                    ],
                    partnership: {
                        runs: 0,
                        balls: 0
                    },
                    lastWicket: {
                        player: 'None',
                        score: 0,
                        dismissal: 'None',
                        over: '0'
                    },
                    commentary: [
                        { over: '0.0', text: 'Live match data from CricAPI' }
                    ]
                };
                
                // Calculate some additional stats if possible
                if (currentMatch.score && currentMatch.score.length > 1) {
                    const team1Score = parseInt(currentMatch.score[0].r) || 0;
                    const team2Score = parseInt(currentMatch.score[1].r) || 0;
                    formattedMatch.target = team1Score + 1;
                    formattedMatch.runsNeeded = Math.max(0, formattedMatch.target - team2Score);
                    
                    // Calculate balls remaining if possible
                    if (currentMatch.score[1].o) {
                        const oversCompleted = parseFloat(currentMatch.score[1].o);
                        const totalOvers = currentMatch.matchType === 't20' ? 20 : 50; // Adjust based on match type
                        const ballsRemaining = Math.max(0, (totalOvers - oversCompleted) * 6);
                        formattedMatch.ballsRemaining = ballsRemaining;
                        
                        // Calculate required run rate
                        if (ballsRemaining > 0) {
                            formattedMatch.requiredRunRate = (formattedMatch.runsNeeded * 6 / ballsRemaining).toFixed(2);
                        }
                    }
                }
                
                console.log('Sending formatted match data to client');
                return res.json(formattedMatch);
            } else {
                console.log('No matches found in API response or invalid response structure, falling back to mock data');
                return res.json(getMockMatchData());
            }
        } catch (apiError) {
            console.error('Error fetching from cricket API:', apiError.message);
            console.log('Falling back to mock data due to API error');
            return res.json(getMockMatchData());
        }
    } catch (error) {
        console.error('Error fetching match data:', error);
        res.status(500).json({ error: 'Failed to fetch match data' });
    }
});

// Function to format match data
function formatMatchData(match) {
  // TO DO: Implement match data formatting logic here
  return match;
}

// Function to get mock match data
function getMockMatchData() {
    console.log('Returning mock match data');
    return {
        id: 'mock-match-1',
        title: 'Chennai Super Kings vs Mumbai Indians',
        venue: 'M.A. Chidambaram Stadium, Chennai',
        date: new Date().toISOString().split('T')[0],
        status: 'Live',
        format: 'T20',
        isLive: true,
        isEnded: false,
        team1: {
            name: 'Chennai Super Kings',
            shortName: 'CSK',
            score: '189/4',
            overs: '20'
        },
        team2: {
            name: 'Mumbai Indians',
            shortName: 'MI',
            score: '120/3',
            overs: '15.2'
        },
        toss: {
            winner: 'Chennai Super Kings',
            decision: 'bat'
        },
        currentInnings: 2,
        target: 190,
        runsNeeded: 70,
        ballsRemaining: 28,
        requiredRunRate: '15.00',
        currentBatters: [
            {
                name: 'Rohit Sharma',
                runs: 45,
                balls: 32,
                fours: 3,
                sixes: 2,
                strikeRate: 140.63
            },
            {
                name: 'Kieron Pollard',
                runs: 32,
                balls: 18,
                fours: 1,
                sixes: 3,
                strikeRate: 177.78
            }
        ],
        currentBowler: {
            name: 'Ravindra Jadeja',
            overs: '3.2',
            maidens: 0,
            runs: 28,
            wickets: 1,
            economy: 8.40
        },
        recentOvers: [
            { over: 15, runs: 12, wickets: 0, details: '1 4 1 0 6 0' },
            { over: 14, runs: 8, wickets: 0, details: '1 1 0 4 2 0' },
            { over: 13, runs: 10, wickets: 0, details: '1 1 4 0 6 0' }
        ],
        partnership: {
            runs: 62,
            balls: 38
        },
        lastWicket: {
            player: 'Suryakumar Yadav',
            score: 28,
            dismissal: 'c Dhoni b Chahar',
            over: '10.4'
        },
        commentary: [
            { over: '0.0', text: 'Live match data from CricAPI' }
        ]
    };
}

// Function to get mock match data based on match ID
function getMockMatchData(matchId) {
  // Default mock data for the original match
  if (matchId === 'default-match' || matchId === 'durham-zim-2025-03-20') {
    return {
      id: 'durham-zim-2025-03-20',
      title: 'Durham Women vs ZIM-W HP-XI, 1st Match',
      venue: 'Harare Sports Club, Harare',
      date: '2025-03-20',
      status: 'Live',
      format: 'ODI',
      isLive: true,
      isEnded: false,
      needsRefresh: true,
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
        over: '15.3'
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
  } 
  // Mock data for CSK vs MI match
  else if (matchId === 'mock-match-1') {
    return {
      id: 'mock-match-1',
      title: 'Chennai Super Kings vs Mumbai Indians',
      venue: 'M.A. Chidambaram Stadium, Chennai',
      date: new Date().toISOString().split('T')[0],
      status: 'Live',
      format: 'T20',
      isLive: true,
      isEnded: false,
      needsRefresh: true,
      team1: {
        name: 'Chennai Super Kings',
        shortName: 'CSK',
        score: '189/4',
        overs: '20'
      },
      team2: {
        name: 'Mumbai Indians',
        shortName: 'MI',
        score: '120/3',
        overs: '15.2'
      },
      toss: {
        winner: 'Chennai Super Kings',
        decision: 'bat'
      },
      currentInnings: 2,
      currentBatters: [
        {
          name: 'Rohit Sharma',
          runs: 62,
          balls: 40,
          fours: 5,
          sixes: 3,
          strikeRate: 155.00
        },
        {
          name: 'Suryakumar Yadav',
          runs: 28,
          balls: 18,
          fours: 2,
          sixes: 2,
          strikeRate: 155.56
        }
      ],
      currentBowler: {
        name: 'Ravindra Jadeja',
        overs: '3.2',
        maidens: 0,
        runs: 24,
        wickets: 1,
        economy: 7.20
      },
      recentOvers: [
        { over: 12, runs: 8, wickets: 0, details: '1 1 0 4 2 0' },
        { over: 13, runs: 10, wickets: 0, details: '1 1 4 0 6 0' },
        { over: 14, runs: 7, wickets: 0, details: '1 1 1 0 4 0' },
        { over: 15, runs: 12, wickets: 0, details: '4 1 1 0 6 0' },
        { over: 15.1, runs: 1, wickets: 0, details: '1' },
        { over: 15.2, runs: 0, wickets: 0, details: '0' }
      ],
      partnership: {
        runs: 48,
        balls: 32
      },
      lastWicket: {
        player: 'Ishan Kishan',
        score: 24,
        dismissal: 'c Gaikwad b Jadeja',
        over: '9.4'
      },
      commentary: [
        { over: 15.0, text: 'Jadeja to Sharma, 1 run, worked to midwicket' },
        { over: 15.1, text: 'Jadeja to Yadav, dot ball, defended' },
        { over: 15.2, text: 'Jadeja to Yadav, no run, beaten outside off' }
      ]
    };
  } 
  // Mock data for RCB vs KKR match
  else if (matchId === 'mock-match-2') {
    return {
      id: 'mock-match-2',
      title: 'Royal Challengers Bangalore vs Kolkata Knight Riders',
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      date: new Date().toISOString().split('T')[0],
      status: 'Live',
      format: 'T20',
      isLive: true,
      isEnded: false,
      needsRefresh: true,
      team1: {
        name: 'Royal Challengers Bangalore',
        shortName: 'RCB',
        score: '176/6',
        overs: '20'
      },
      team2: {
        name: 'Kolkata Knight Riders',
        shortName: 'KKR',
        score: '98/2',
        overs: '12.1'
      },
      toss: {
        winner: 'Kolkata Knight Riders',
        decision: 'field'
      },
      currentInnings: 2,
      currentBatters: [
        {
          name: 'Shreyas Iyer',
          runs: 42,
          balls: 30,
          fours: 3,
          sixes: 2,
          strikeRate: 140.00
        },
        {
          name: 'Nitish Rana',
          runs: 35,
          balls: 22,
          fours: 3,
          sixes: 2,
          strikeRate: 159.09
        }
      ],
      currentBowler: {
        name: 'Mohammed Siraj',
        overs: '3.1',
        maidens: 0,
        runs: 28,
        wickets: 1,
        economy: 8.84
      },
      recentOvers: [
        { over: 9, runs: 8, wickets: 0, details: '1 1 0 4 2 0' },
        { over: 10, runs: 12, wickets: 0, details: '1 1 4 0 6 0' },
        { over: 11, runs: 9, wickets: 0, details: '1 1 1 0 6 0' },
        { over: 12, runs: 7, wickets: 0, details: '1 1 1 0 4 0' },
        { over: 12.1, runs: 1, wickets: 0, details: '1' }
      ],
      partnership: {
        runs: 72,
        balls: 48
      },
      lastWicket: {
        player: 'Venkatesh Iyer',
        score: 18,
        dismissal: 'c Maxwell b Siraj',
        over: '6.3'
      },
      commentary: [
        { over: 12.0, text: 'Siraj to Iyer, 1 run, pushed to long-on' },
        { over: 12.1, text: 'Siraj to Rana, 1 run, worked to midwicket' }
      ]
    };
  }
  // Default fallback for any other match ID
  else {
    return {
      id: matchId,
      title: `Match ${matchId}`,
      venue: 'Unknown Venue',
      date: new Date().toISOString().split('T')[0],
      status: 'Unknown',
      format: 'T20',
      isLive: false,
      isEnded: false,
      needsRefresh: false,
      team1: {
        name: 'Team 1',
        shortName: 'TM1',
        score: '',
        overs: ''
      },
      team2: {
        name: 'Team 2',
        shortName: 'TM2',
        score: '',
        overs: ''
      },
      toss: {
        winner: '',
        decision: ''
      },
      currentInnings: 0,
      currentBatters: [],
      currentBowler: {},
      recentOvers: [],
      partnership: {},
      lastWicket: {},
      commentary: [
        { over: 0, text: 'No match data available for this ID' }
      ]
    };
  }
}

// Add a specific route for the live match page
app.get('/live-match', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'live-match.html'));
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Database config: Host=${dbConfig.host}, DB=${dbConfig.database}, User=${dbConfig.user}, Port=${dbConfig.port}`);
  
  // Test the database connection
  const isConnected = await testConnection();
  if (isConnected) {
    console.log('✅ MySQL database connection is working properly');
  } else {
    console.log('❌ MySQL database connection failed. Please check your configuration.');
  }
});
