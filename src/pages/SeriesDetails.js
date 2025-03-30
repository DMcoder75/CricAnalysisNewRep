import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../utils/theme';
import axiosClient from '../services/axiosClient';
import SeriesOverview from '../components/series/SeriesOverview';
import SeriesMatches from '../components/series/SeriesMatches';
import SeriesPointsTable from '../components/series/SeriesPointsTable';
import LivePointsTable from '../components/series/LivePointsTable';
import SeriesSquads from '../components/series/SeriesSquads';
import SeriesAnalytics from '../components/series/SeriesAnalytics';
import SeriesInsights from '../components/series/SeriesInsights';

const SeriesDetails = ({ initialTab }) => {
  const { seriesId, slug, uuid } = useParams();
  const navigate = useNavigate();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab || 'overview');
  const [pointsTable, setPointsTable] = useState([]);

  // Get the actual series data based on the URL parameter
  const getSeriesData = () => {
    // First, determine which parameter we have
    const paramValue = seriesId || slug || uuid;
    
    // If it's a UUID format (in the uuid path), return it directly as ID
    if (uuid) {
      console.log('Using UUID from path:', uuid);
      return { id: uuid };
    }
    
    // If it looks like a UUID (contains hyphens and is 36 chars long), return it as ID
    if (paramValue && paramValue.length === 36 && paramValue.split('-').length === 5) {
      console.log('Using UUID-like parameter:', paramValue);
      return { id: paramValue };
    }
    
    // For IPL 2025, ensure we use the correct ID
    if (paramValue === 'indian-premier-league-2025') {
      console.log('Using hardcoded ID for IPL 2025');
      return { 
        id: 'd5a498c8-7596-4b93-8ab0-e0efc3345312', 
        slug: 'indian-premier-league-2025',
        name: 'Indian Premier League 2025'
      };
    }
    
    // Otherwise, it's a clean slug, get the complete series data from sessionStorage
    if (paramValue) {
      const storedData = sessionStorage.getItem(`series_${paramValue}`);
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          console.log('Retrieved stored series data for slug:', paramValue, parsedData);
          return parsedData;
        } catch (e) {
          console.error('Error parsing stored series data:', e);
          // If it's not JSON, it might be just the ID from older version
          return { id: storedData };
        }
      }
    }
    
    // If we don't have stored data, we'll need to fetch it from the API
    // This would happen if someone navigates directly to the URL
    console.log('No stored data found for slug, using slug directly:', paramValue);
    return { id: paramValue, slug: paramValue };
  };

  useEffect(() => {
    const fetchSeriesData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const seriesData = getSeriesData();
        
        if (!seriesData) {
          setError('Series not found');
          setLoading(false);
          return;
        }
        
        // Check if this is an IPL series by slug
        const seriesSlug = seriesId || slug || uuid;
        const isIplSeries = seriesSlug && (
          seriesSlug.includes('ipl') || 
          seriesSlug.includes('indian-premier-league')
        );
        
        // If it's IPL, fetch the points table from our dedicated endpoint
        if (isIplSeries) {
          fetchIPLPointsTable(seriesSlug);
        }
        
        fetchSeriesDetails();
      } catch (err) {
        console.error('Error fetching series details:', err);
        setError('Failed to fetch series details. Please try again later.');
        setLoading(false);
      }
    };

    fetchSeriesData();
  }, [seriesId, slug, uuid]);

  useEffect(() => {
    fetchSeriesDetails();
  }, [seriesId, slug, uuid]);

  // Effect to fetch points table for IPL series
  useEffect(() => {
    if (series && series.slug) {
      const isIPL = 
        series.slug === 'indian-premier-league-2025' || 
        series.name?.toLowerCase().includes('indian premier league') ||
        series.name?.toLowerCase().includes('ipl');
        
      if (isIPL) {
        console.log('Detected IPL series, fetching points table data');
        fetchIPLPointsTable(series.slug);
      }
    }
  }, [series?.slug]);

  const fetchSeriesDetails = async () => {
    try {
      // Get the series data or ID
      const seriesData = getSeriesData();
      console.log('Retrieved series data:', seriesData);
      
      // If we already have complete series data, use it directly
      if (seriesData && seriesData.name && seriesData.startDate && seriesData.endDate) {
        console.log('Using stored complete series data:', seriesData);
        
        // Validate and fix dates before using the data
        const validatedData = validateAndFixDates(seriesData);
        setSeries(validatedData);
        setLoading(false);
        return;
      }
      
      // Otherwise, we only have the ID, so fetch from API
      const actualSeriesId = seriesData.id;
      const seriesSlug = seriesData.slug;
      console.log('Fetching series with ID:', actualSeriesId, 'or slug:', seriesSlug);
      
      // Extract a readable name from the slug if possible
      let readableName = 'Cricket Series';
      if (seriesSlug) {
        readableName = seriesSlug
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
      }
      
      // First try to find the series by ID
      let response;
      
      // Check if we have a UUID-like ID or a slug
      if (actualSeriesId && actualSeriesId.length === 36 && actualSeriesId.includes('-')) {
        // It's a UUID, use direct ID lookup
        response = await axiosClient.get(`series_info?id=${actualSeriesId}`);
        console.log('CricAPI series_info response by ID:', response);
      } else {
        // It's a slug, try to find the series in the list first
        const seriesListResponse = await axiosClient.get('series?offset=0');
        console.log('CricAPI series list response:', seriesListResponse);
        
        if (seriesListResponse.data && seriesListResponse.data.status === 'success' && seriesListResponse.data.data) {
          // Find the series that matches our slug
          const seriesList = seriesListResponse.data.data;
          const matchingSeries = seriesList.find(s => {
            // Generate a slug from the series name
            const generatedSlug = s.name.toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-+|-+$/g, '');
            
            // Check if the slug matches or if the name contains the slug text
            return generatedSlug === seriesSlug || 
                  s.name.toLowerCase().includes(seriesSlug.replace(/-/g, ' '));
          });
          
          if (matchingSeries) {
            console.log('Found matching series in list:', matchingSeries);
            // Now get the detailed info using the ID
            response = await axiosClient.get(`series_info?id=${matchingSeries.id}`);
            console.log('CricAPI series_info response for matched series:', response);
          } else {
            console.log('No matching series found in list, trying direct API call with slug');
            // Try direct lookup as fallback
            response = await axiosClient.get(`series_info?id=${actualSeriesId}`);
          }
        } else {
          // Fallback to direct lookup
          response = await axiosClient.get(`series_info?id=${actualSeriesId}`);
        }
      }
      
      if (response && response.data && response.data.status === 'success' && response.data.data) {
        // Transform the CricAPI response to match our expected format
        const apiData = response.data.data;
        
        // Ensure match formats are properly set
        let t20Count = 0;
        let odiCount = 0;
        let testCount = 0;
        
        // Try to extract match formats from matches array
        if (apiData.matches && Array.isArray(apiData.matches)) {
          apiData.matches.forEach(match => {
            if (match.matchType) {
              if (match.matchType.toLowerCase().includes('t20')) {
                t20Count++;
              } else if (match.matchType.toLowerCase().includes('odi')) {
                odiCount++;
              } else if (match.matchType.toLowerCase().includes('test')) {
                testCount++;
              }
            } else if (match.format) {
              if (match.format.toLowerCase().includes('t20')) {
                t20Count++;
              } else if (match.format.toLowerCase().includes('odi')) {
                odiCount++;
              } else if (match.format.toLowerCase().includes('test')) {
                testCount++;
              }
            }
          });
        }
        
        // If we couldn't determine formats from matches, check if it's IPL
        const isIpl = apiData.name && 
          (apiData.name.toLowerCase().includes('indian premier league') || 
           apiData.name.toLowerCase().includes('ipl'));
           
        if (isIpl && t20Count === 0 && odiCount === 0 && testCount === 0) {
          t20Count = apiData.matches ? apiData.matches.length : 74; // Default IPL match count
        }
        
        const formattedSeries = {
          id: apiData.id,
          name: apiData.name || readableName || 'Cricket Series',
          startDate: apiData.startDate,
          endDate: apiData.endDate,
          odi: apiData.odi || odiCount || 0,
          t20: apiData.t20 || t20Count || 0,
          test: apiData.test || testCount || 0,
          matches: apiData.matches || [],
          status: determineSeriesStatus(apiData.startDate, apiData.endDate),
          teams: extractTeamsFromMatches(apiData),
          pointsTable: generatePointsTable(apiData)
        };
        
        // Validate and fix dates
        const validatedSeries = validateAndFixDates(formattedSeries);
        setSeries(validatedSeries);
        console.log('Loaded series details from CricAPI:', validatedSeries);
        
        // Store in sessionStorage for future use
        try {
          const slug = slug || 
            validatedSeries.name.toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-+|-+$/g, '');
              
          sessionStorage.setItem(`series_${slug}`, JSON.stringify(validatedSeries));
        } catch (error) {
          console.error('Error storing series data in sessionStorage:', error);
        }
      } else {
        console.error('Invalid response format from CricAPI:', response?.data);
        setError('Invalid response format from CricAPI');
        // Try to use mock data as fallback
        tryFallbackData(actualSeriesId);
      }
    } catch (err) {
      console.error('Error fetching series details:', err);
      setError('Failed to fetch series details. Please try again later.');
      
      // Try to use mock data as fallback
      const seriesData = getSeriesData();
      tryFallbackData(seriesData.id);
    } finally {
      setLoading(false);
    }
  };

  // Determine series status based on dates
  const determineSeriesStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return 'upcoming';
    
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'upcoming';
    
    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'ongoing';
  };
  
  // Try to use mock data as fallback
  const tryFallbackData = (seriesId) => {
    console.log('Using fallback data for series ID/slug:', seriesId);
    
    // Check if we're looking at the IPL 2025 page specifically
    const isIpl2025 = seriesId && 
      (seriesId.toLowerCase().includes('2025') || 
       seriesId.toLowerCase().includes('indian-premier-league-2025'));
       
    // Check if we're looking at the IPL 2024 page
    const isIpl2024 = seriesId && 
      (seriesId.toLowerCase().includes('2024') || 
       seriesId.toLowerCase().includes('indian-premier-league-2024'));
    
    // Get current year for default dates
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    // Determine appropriate year for mock data
    let mockYear = currentYear;
    if (currentMonth < 2) { // If before March, use previous year
      mockYear = currentYear - 1;
    }
    
    // Generate appropriate dates
    const startDate = isIpl2025 ? '2025-03-22' : 
                     isIpl2024 ? '2024-03-23' : 
                     `${mockYear}-03-25`;
                     
    const endDate = isIpl2025 ? '2025-05-26' : 
                   isIpl2024 ? '2024-05-27' : 
                   `${mockYear}-05-28`;
    
    // Extract series name from slug if possible
    let seriesName = 'Cricket Series';
    if (seriesId) {
      // Convert slug to readable name
      seriesName = seriesId
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
    }
    
    // If it looks like IPL, use appropriate name
    if (isIpl2025) {
      seriesName = 'Indian Premier League 2025';
    } else if (isIpl2024) {
      seriesName = 'Indian Premier League 2024';
    } else if (seriesId && seriesId.toLowerCase().includes('ipl')) {
      seriesName = `Indian Premier League ${mockYear}`;
    }
    
    // Simple mock data for fallback
    const mockSeries = {
      id: seriesId || `mock-series-${Date.now()}`,
      name: seriesName,
      startDate: startDate,
      endDate: endDate,
      odi: 0,
      t20: isIpl2025 || isIpl2024 || seriesName.toLowerCase().includes('ipl') ? 74 : 0,
      test: 0,
      status: determineSeriesStatus(startDate, endDate),
      teams: ['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bangalore', 'Delhi Capitals', 
              'Kolkata Knight Riders', 'Punjab Kings', 'Rajasthan Royals', 'Sunrisers Hyderabad',
              'Gujarat Titans', 'Lucknow Super Giants'],
      matches: generateMockMatches(startDate, endDate, seriesName),
      pointsTable: generateMockPointsTable(seriesName)
    };
    
    console.log('Created mock series data:', mockSeries);
    setSeries(mockSeries);
  };
  
  // Generate mock matches for the series
  const generateMockMatches = (startDate, endDate, seriesName) => {
    const teams = ['Chennai Super Kings', 'Mumbai Indians', 'Royal Challengers Bangalore', 'Delhi Capitals', 
                  'Kolkata Knight Riders', 'Punjab Kings', 'Rajasthan Royals', 'Sunrisers Hyderabad',
                  'Gujarat Titans', 'Lucknow Super Giants'];
    
    const venues = [
      'M. A. Chidambaram Stadium, Chennai',
      'Wankhede Stadium, Mumbai',
      'M. Chinnaswamy Stadium, Bangalore',
      'Arun Jaitley Stadium, Delhi',
      'Eden Gardens, Kolkata',
      'Punjab Cricket Association Stadium, Mohali',
      'Sawai Mansingh Stadium, Jaipur',
      'Rajiv Gandhi International Cricket Stadium, Hyderabad',
      'Narendra Modi Stadium, Ahmedabad',
      'Ekana Cricket Stadium, Lucknow'
    ];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysBetween = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    
    // Generate between 10-20 matches or one per two days, whichever is less
    const numMatches = Math.min(Math.floor(daysBetween / 2), 20);
    const matches = [];
    
    for (let i = 0; i < numMatches; i++) {
      // Pick two random teams
      const teamIndexA = Math.floor(Math.random() * teams.length);
      let teamIndexB;
      do {
        teamIndexB = Math.floor(Math.random() * teams.length);
      } while (teamIndexB === teamIndexA);
      
      // Generate a random date within the series timeframe
      const matchDate = new Date(start);
      matchDate.setDate(start.getDate() + Math.floor(Math.random() * daysBetween));
      
      // Determine match status based on date
      const now = new Date();
      let status;
      if (matchDate < now) {
        status = 'completed';
      } else {
        status = 'upcoming';
      }
      
      // Create the match object
      matches.push({
        id: `mock-match-${i + 1}`,
        name: `${teams[teamIndexA]} vs ${teams[teamIndexB]}`,
        status: status,
        venue: venues[Math.floor(Math.random() * venues.length)],
        date: matchDate.toISOString(),
        matchType: seriesName.toLowerCase().includes('ipl') ? 'T20' : 
                  Math.random() > 0.7 ? 'ODI' : 
                  Math.random() > 0.5 ? 'T20' : 'Test',
        teams: [
          { name: teams[teamIndexA] },
          { name: teams[teamIndexB] }
        ],
        teamInfo: [
          { name: teams[teamIndexA], shortname: teams[teamIndexA].split(' ').map(word => word[0]).join('') },
          { name: teams[teamIndexB], shortname: teams[teamIndexB].split(' ').map(word => word[0]).join('') }
        ],
        score: status === 'completed' ? [
          { r: Math.floor(Math.random() * 100) + 150, w: Math.floor(Math.random() * 10), o: 20 },
          { r: Math.floor(Math.random() * 100) + 120, w: 10, o: Math.floor(Math.random() * 5) + 15 }
        ] : []
      });
    }
    
    return matches;
  };

  // Generate points table based on matches
  const generatePointsTable = (apiData) => {
    // If API already provides points table, use it
    if (apiData.pointsTable && Array.isArray(apiData.pointsTable)) {
      return apiData.pointsTable;
    }
    
    // Check if this is an IPL series
    const isIpl = apiData.name && 
      (apiData.name.toLowerCase().includes('indian premier league') || 
       apiData.name.toLowerCase().includes('ipl'));
    
    // If it's IPL, generate a default points table
    if (isIpl) {
      return [
        { team: 'CSK', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000' },
        { team: 'DC', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000' },
        { team: 'GT', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000' },
        { team: 'KKR', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000' },
        { team: 'LSG', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000' },
        { team: 'MI', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000' },
        { team: 'PBKS', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000' },
        { team: 'RR', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000' },
        { team: 'RCB', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000' },
        { team: 'SRH', matches: 0, won: 0, lost: 0, draw: 0, points: 0, nrr: '0.000' }
      ];
    }
    
    // If we have matches, try to generate a points table from them
    if (apiData.matches && Array.isArray(apiData.matches) && apiData.matches.length > 0) {
      const teams = new Map();
      
      // Process completed matches to build points table
      apiData.matches.forEach(match => {
        if (match.status !== 'completed' || !match.teams || !Array.isArray(match.teams)) {
          return;
        }
        
        // Extract team names
        let teamNames = [];
        if (match.teams.length >= 2) {
          teamNames = match.teams.map(t => t.name || t);
        } else if (match.teamInfo && match.teamInfo.length >= 2) {
          teamNames = match.teamInfo.map(t => t.name || t);
        } else if (match.name) {
          // Try to extract from match name
          const parts = match.name.split(/\s+vs\s+|\s+v\s+/i);
          if (parts.length >= 2) {
            teamNames = [parts[0].trim(), parts[1].trim()];
          }
        }
        
        if (teamNames.length < 2) return;
        
        // Initialize teams in the map if not already present
        teamNames.forEach(name => {
          if (!teams.has(name)) {
            teams.set(name, { 
              team: name,
              matches: 0,
              won: 0,
              lost: 0,
              draw: 0,
              points: 0,
              nrr: '0.000'
            });
          }
        });
        
        // Update matches played
        teamNames.forEach(name => {
          const team = teams.get(name);
          team.matches += 1;
        });
        
        // If match has a winner, update points
        if (match.winner) {
          const winnerName = match.winner;
          const loserName = teamNames.find(name => name !== winnerName);
          
          if (winnerName && teams.has(winnerName)) {
            const winner = teams.get(winnerName);
            winner.won += 1;
            winner.points += 2;
          }
          
          if (loserName && teams.has(loserName)) {
            const loser = teams.get(loserName);
            loser.lost += 1;
          }
        } else {
          // If no winner, it's a draw/tie
          teamNames.forEach(name => {
            const team = teams.get(name);
            team.draw += 1;
            team.points += 1;
          });
        }
      });
      
      // Convert map to array and sort by points
      return Array.from(teams.values())
        .sort((a, b) => b.points - a.points || parseFloat(b.nrr) - parseFloat(a.nrr));
    }
    
    // If we couldn't generate a points table, return empty array
    return [];
  };

  // Generate mock points table for the series
  const generateMockPointsTable = (seriesName) => {
    const isIpl = seriesName && 
      (seriesName.toLowerCase().includes('indian premier league') || 
       seriesName.toLowerCase().includes('ipl'));
       
    if (isIpl) {
      // For IPL, generate a realistic points table
      return [
        { team: 'CSK', matches: 14, won: 10, lost: 4, draw: 0, points: 20, nrr: '+0.652' },
        { team: 'GT', matches: 14, won: 9, lost: 5, draw: 0, points: 18, nrr: '+0.510' },
        { team: 'MI', matches: 14, won: 8, lost: 6, draw: 0, points: 16, nrr: '+0.321' },
        { team: 'RCB', matches: 14, won: 7, lost: 7, draw: 0, points: 14, nrr: '+0.195' },
        { team: 'LSG', matches: 14, won: 7, lost: 7, draw: 0, points: 14, nrr: '+0.087' },
        { team: 'RR', matches: 14, won: 7, lost: 7, draw: 0, points: 14, nrr: '-0.093' },
        { team: 'KKR', matches: 14, won: 6, lost: 8, draw: 0, points: 12, nrr: '-0.239' },
        { team: 'PBKS', matches: 14, won: 6, lost: 8, draw: 0, points: 12, nrr: '-0.304' },
        { team: 'DC', matches: 14, won: 5, lost: 9, draw: 0, points: 10, nrr: '-0.572' },
        { team: 'SRH', matches: 14, won: 4, lost: 10, draw: 0, points: 8, nrr: '-0.825' }
      ];
    }
    
    // For non-IPL series, generate a generic points table with 2-6 teams
    const teams = extractTeamsFromSeriesName(seriesName);
    if (teams.length >= 2) {
      return teams.map((team, index) => {
        const matches = Math.floor(Math.random() * 5) + 3;
        const won = Math.floor(Math.random() * matches);
        const lost = matches - won;
        const points = won * 2;
        const nrr = ((Math.random() * 2) - 1).toFixed(3);
        
        return {
          team,
          matches,
          won,
          lost,
          draw: 0,
          points,
          nrr: nrr > 0 ? `+${nrr}` : nrr
        };
      }).sort((a, b) => b.points - a.points);
    }
    
    return [];
  };
  
  // Extract team names from series name
  const extractTeamsFromSeriesName = (seriesName) => {
    if (!seriesName) return [];
    
    // Try to extract teams from "Team A vs Team B" format
    const vsMatch = seriesName.match(/(.+?)\s+(?:vs|v)\s+(.+?)(?:\s+|$)/i);
    if (vsMatch && vsMatch.length >= 3) {
      return [vsMatch[1].trim(), vsMatch[2].trim()];
    }
    
    // If we can't extract teams, return common international teams
    return ['India', 'Australia', 'England', 'New Zealand', 'South Africa', 'Pakistan'].slice(0, Math.floor(Math.random() * 4) + 2);
  };

  const handleGoBack = () => {
    navigate('/series');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'TBD';
    return date.toLocaleDateString();
  };

  // Extract teams from matches if not provided directly
  const extractTeamsFromMatches = (apiData) => {
    if (apiData.teams && Array.isArray(apiData.teams) && apiData.teams.length > 0) {
      return apiData.teams;
    }
    
    // If no teams array, try to extract from matches
    if (apiData.matches && Array.isArray(apiData.matches) && apiData.matches.length > 0) {
      const teamSet = new Set();
      
      apiData.matches.forEach(match => {
        if (match.teams && Array.isArray(match.teams)) {
          match.teams.forEach(team => {
            if (team && team.name) {
              teamSet.add(team.name);
            }
          });
        } else if (match.teamInfo && Array.isArray(match.teamInfo)) {
          match.teamInfo.forEach(team => {
            if (team && team.name) {
              teamSet.add(team.name);
            }
          });
        } else if (match.name) {
          // Try to extract team names from match name (e.g., "Team A vs Team B")
          const parts = match.name.split(/\s+vs\s+|\s+v\s+/i);
          if (parts.length >= 2) {
            teamSet.add(parts[0].trim());
            teamSet.add(parts[1].trim());
          }
        }
      });
      
      return Array.from(teamSet);
    }
    
    // If we couldn't extract teams, return empty array
    return [];
  };

  // Validate and fix dates if needed
  const validateAndFixDates = (seriesData) => {
    if (!seriesData) return seriesData;
    
    // Create a copy to avoid modifying the original
    const validatedData = { ...seriesData };
    
    // Check if dates are valid
    if (validatedData.startDate) {
      const startDate = new Date(validatedData.startDate);
      if (isNaN(startDate.getTime())) {
        // Invalid date, use current date as fallback
        validatedData.startDate = new Date().toISOString().split('T')[0];
      }
    } else {
      // Missing start date, use current date as fallback
      validatedData.startDate = new Date().toISOString().split('T')[0];
    }
    
    if (validatedData.endDate) {
      const endDate = new Date(validatedData.endDate);
      if (isNaN(endDate.getTime())) {
        // Invalid date, use start date + 30 days as fallback
        const fallbackEnd = new Date(validatedData.startDate);
        fallbackEnd.setDate(fallbackEnd.getDate() + 30);
        validatedData.endDate = fallbackEnd.toISOString().split('T')[0];
      }
    } else {
      // Missing end date, use start date + 30 days as fallback
      const fallbackEnd = new Date(validatedData.startDate);
      fallbackEnd.setDate(fallbackEnd.getDate() + 30);
      validatedData.endDate = fallbackEnd.toISOString().split('T')[0];
    }
    
    return validatedData;
  };

  const fetchIPLPointsTable = async (seriesSlug) => {
    try {
      console.log('Fetching IPL points table from dedicated endpoint for slug:', seriesSlug);
      
      // Add timestamp to URL to bypass cache
      const timestamp = new Date().getTime();
      
      // First try to update the points table to get the latest data
      try {
        console.log('Attempting to update points table first...');
        await axiosClient.post(`/api/series/${seriesSlug}/points/update`, {}, {
          headers: {
            'Cache-Control': 'no-cache, no-store',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        console.log('Points table update triggered successfully');
      } catch (updateError) {
        console.warn('Could not update points table:', updateError);
        // Continue to fetch the existing data
      }
      
      // Now fetch the points table (which should be updated)
      const response = await axiosClient.get(`/api/series/${seriesSlug}/points?_t=${timestamp}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.data && response.data.success && response.data.pointsTable) {
        console.log('Successfully fetched IPL points table:', response.data.pointsTable);
        
        // Force update by creating a new array with the data
        const freshPointsTable = [...response.data.pointsTable];
        setPointsTable(freshPointsTable);
        
        // Also update the series object with the points table
        setSeries(prevSeries => {
          if (prevSeries) {
            return { ...prevSeries, pointsTable: freshPointsTable };
          }
          return prevSeries;
        });
      } else {
        console.error('Invalid points table response format:', response.data);
      }
    } catch (error) {
      console.error('Error fetching IPL points table:', error);
      // We'll fall back to the default points table in the component
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', component: <SeriesOverview series={series} /> },
    { id: 'matches', label: 'Matches', component: <SeriesMatches seriesId={getSeriesData().id} /> },
    { id: 'live-points', label: 'Live Points', component: <LivePointsTable seriesId={getSeriesData().id} /> },
    { id: 'squads', label: 'Squads', component: <SeriesSquads seriesId={getSeriesData().id} /> },
    { id: 'analytics', label: 'Analytics', component: <SeriesAnalytics series={series} /> },
    { id: 'insights', label: 'AI Insights', component: <SeriesInsights series={series} /> },
  ];

  return (
    <SeriesDetailsContainer>
      <BackButton onClick={handleGoBack}>
        <ArrowLeftIcon /> Back to Series
      </BackButton>
      
      {loading ? (
        <LoadingContainer>
          <LoadingSpinner />
          <p>Loading series details...</p>
        </LoadingContainer>
      ) : error ? (
        <ErrorContainer>
          <ErrorIcon />
          <p>{error}</p>
          <RetryButton onClick={fetchSeriesDetails}>Retry</RetryButton>
        </ErrorContainer>
      ) : series ? (
        <>
          <SeriesHeader status={series.status}>
            <SeriesName>{series.name}</SeriesName>
            <SeriesDate>
              <CalendarIcon />
              {formatDate(series.startDate)} - {formatDate(series.endDate)}
            </SeriesDate>
            <SeriesStatusBadge status={series.status}>
              {series.status.charAt(0).toUpperCase() + series.status.slice(1)}
            </SeriesStatusBadge>
          </SeriesHeader>
          
          <TabsContainer>
            {tabs.map(tab => (
              <TabButton 
                key={tab.id} 
                active={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </TabButton>
            ))}
          </TabsContainer>
          
          <TabContent>
            {tabs.find(tab => tab.id === activeTab)?.component}
          </TabContent>
        </>
      ) : (
        <NoDataContainer>
          <p>No series data found.</p>
        </NoDataContainer>
      )}
    </SeriesDetailsContainer>
  );
};

// Styled components
const SeriesDetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', sans-serif;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${theme.colors.primary};
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 0;
  transition: ${theme.transitions.default};
  
  &:hover {
    text-decoration: underline;
  }
`;

const SeriesHeader = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${theme.shadows.small};
  padding: 20px;
  margin-bottom: 20px;
  border-left: 5px solid 
    ${props => props.status === 'ongoing' ? theme.colors.series.live.border : 
    props.status === 'upcoming' ? theme.colors.series.upcoming.border : 
    props.status === 'completed' ? theme.colors.series.completed.border : theme.colors.primary};
`;

const SeriesName = styled.h1`
  margin: 0 0 10px 0;
  color: ${theme.colors.primary};
  font-size: 24px;
`;

const SeriesDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${theme.colors.darkGray};
  margin-bottom: 10px;
`;

const SeriesStatusBadge = styled.div`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  background-color: ${props => 
    props.status === 'ongoing' ? theme.colors.series.live.bg : 
    props.status === 'upcoming' ? theme.colors.series.upcoming.bg : 
    props.status === 'completed' ? theme.colors.series.completed.bg : theme.colors.lightGray};
  color: ${props => 
    props.status === 'ongoing' ? theme.colors.series.live.text : 
    props.status === 'upcoming' ? theme.colors.series.upcoming.text : 
    props.status === 'completed' ? theme.colors.series.completed.text : theme.colors.text};
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const TabButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.active ? theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : theme.colors.primary};
  border: 1px solid ${props => props.active ? theme.colors.primary : '#ddd'};
  border-radius: 4px;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${props => props.active ? theme.colors.primaryDark : '#f5f5f5'};
  }
`;

const TabContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${theme.shadows.small};
  padding: 20px;
  min-height: 400px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: ${theme.colors.primary};
  gap: 20px;
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: ${theme.colors.danger};
  gap: 20px;
  text-align: center;
`;

const RetryButton = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary};
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: ${theme.transitions.default};
  
  &:hover {
    background-color: ${theme.colors.primary};
    color: white;
  }
`;

const NoDataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  color: ${theme.colors.darkGray};
  font-style: italic;
`;

// Custom icon components
const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${theme.colors.danger};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:before {
    content: "!";
    font-size: 24px;
    font-weight: bold;
  }
`;

const CalendarIcon = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${theme.colors.primary};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

const ArrowLeftIcon = styled.div`
  width: 16px;
  height: 16px;
  background-color: ${theme.colors.primary};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 448 512'%3E%3Cpath d='M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

export default SeriesDetails;
