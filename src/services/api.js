import axiosClient from './axiosClient';

// Base URL for our mock API (in a real application, this would be your actual API endpoint)
const API_BASE_URL = 'https://api.example.com/cricket';

// Create an axios instance with default config
const apiClient = axiosClient.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a local API client for our backend
const localApiClient = axiosClient.create({
  baseURL: 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000 // Add timeout to prevent hanging requests
});

// Mock data for development (remove this in production)
const mockData = {
  teams: [
    { id: 1, name: 'Mumbai Indians', shortName: 'MI', color: '#004BA0', logo: 'mi_logo.png' },
    { id: 2, name: 'Chennai Super Kings', shortName: 'CSK', color: '#FFFF00', logo: 'csk_logo.png' },
    { id: 3, name: 'Royal Challengers Bangalore', shortName: 'RCB', color: '#FF0000', logo: 'rcb_logo.png' },
    { id: 4, name: 'Kolkata Knight Riders', shortName: 'KKR', color: '#3A225D', logo: 'kkr_logo.png' },
    { id: 5, name: 'Delhi Capitals', shortName: 'DC', color: '#0078BC', logo: 'dc_logo.png' },
    { id: 6, name: 'Punjab Kings', shortName: 'PBKS', color: '#ED1B24', logo: 'pbks_logo.png' },
    { id: 7, name: 'Rajasthan Royals', shortName: 'RR', color: '#FF69B4', logo: 'rr_logo.png' },
    { id: 8, name: 'Sunrisers Hyderabad', shortName: 'SRH', color: '#FF822A', logo: 'srh_logo.png' },
    { id: 9, name: 'Gujarat Titans', shortName: 'GT', color: '#1C1C1C', logo: 'gt_logo.png' },
    { id: 10, name: 'Lucknow Super Giants', shortName: 'LSG', color: '#A7D5F6', logo: 'lsg_logo.png' },
  ],
  players: [
    { 
      id: 1, 
      name: 'Rohit Sharma', 
      teamId: 1, 
      role: 'Batsman', 
      battingStyle: 'Right-handed', 
      bowlingStyle: 'Right-arm off break',
      nationality: 'Indian',
      stats: {
        batting: { matches: 213, runs: 5879, average: 30.30, strikeRate: 130.6, fifties: 40, hundreds: 1 },
        bowling: { matches: 213, wickets: 15, economy: 7.97, average: 31.36 }
      }
    },
    { 
      id: 2, 
      name: 'MS Dhoni', 
      teamId: 2, 
      role: 'Wicket-keeper Batsman', 
      battingStyle: 'Right-handed', 
      bowlingStyle: 'Right-arm medium',
      nationality: 'Indian',
      stats: {
        batting: { matches: 234, runs: 4985, average: 39.20, strikeRate: 135.2, fifties: 24, hundreds: 0 },
        bowling: { matches: 234, wickets: 0, economy: 0, average: 0 }
      }
    },
    { 
      id: 3, 
      name: 'Virat Kohli', 
      teamId: 3, 
      role: 'Batsman', 
      battingStyle: 'Right-handed', 
      bowlingStyle: 'Right-arm medium',
      nationality: 'Indian',
      stats: {
        batting: { matches: 223, runs: 6624, average: 36.20, strikeRate: 129.8, fifties: 44, hundreds: 5 },
        bowling: { matches: 223, wickets: 4, economy: 8.8, average: 92.0 }
      }
    },
    { 
      id: 4, 
      name: 'Jasprit Bumrah', 
      teamId: 1, 
      role: 'Bowler', 
      battingStyle: 'Right-handed', 
      bowlingStyle: 'Right-arm fast',
      nationality: 'Indian',
      stats: {
        batting: { matches: 120, runs: 56, average: 4.67, strikeRate: 84.8, fifties: 0, hundreds: 0 },
        bowling: { matches: 120, wickets: 145, economy: 7.39, average: 23.31 }
      }
    },
    { 
      id: 5, 
      name: 'Andre Russell', 
      teamId: 4, 
      role: 'All-rounder', 
      battingStyle: 'Right-handed', 
      bowlingStyle: 'Right-arm fast-medium',
      nationality: 'West Indian',
      stats: {
        batting: { matches: 98, runs: 2035, average: 30.37, strikeRate: 177.9, fifties: 10, hundreds: 0 },
        bowling: { matches: 98, wickets: 89, economy: 9.13, average: 25.11 }
      }
    }
  ],
  matches: [
    {
      id: 1,
      homeTeamId: 1,
      awayTeamId: 2,
      date: '2025-04-01T14:00:00Z',
      venue: 'Wankhede Stadium, Mumbai',
      status: 'Upcoming',
      result: null
    },
    {
      id: 2,
      homeTeamId: 3,
      awayTeamId: 4,
      date: '2025-04-02T14:00:00Z',
      venue: 'M. Chinnaswamy Stadium, Bangalore',
      status: 'Upcoming',
      result: null
    },
    {
      id: 3,
      homeTeamId: 5,
      awayTeamId: 6,
      date: '2025-04-03T14:00:00Z',
      venue: 'Arun Jaitley Stadium, Delhi',
      status: 'Upcoming',
      result: null
    }
  ]
};

// API service functions
const apiService = {
  // Series
  getSeries: async () => {
    try {
      console.log('API Service: Fetching series from backend...');
      // Get series from our local database
      const response = await localApiClient.get('/series');
      console.log('API Service: Series response received:', response);
      
      // Check if the response has the expected structure
      if (response && response.data && response.data.success && Array.isArray(response.data.series)) {
        return response.data;
      } else {
        console.error('API Service: Unexpected series response format:', response);
        return { success: false, error: 'Invalid response format', series: [] };
      }
    } catch (error) {
      console.error('API Service: Error fetching series:', error);
      // Return a default response instead of throwing an error
      return { success: false, error: error.message, series: [] };
    }
  },
  
  getSeriesById: async (seriesId) => {
    try {
      const response = await localApiClient.get(`/series/${seriesId}`);
      return response;
    } catch (error) {
      console.error(`Error fetching series ${seriesId}:`, error);
      throw error;
    }
  },
  
  getSeriesBySlug: async (slug) => {
    try {
      const response = await localApiClient.get(`/series/${slug}`);
      return response;
    } catch (error) {
      console.error(`Error fetching series with slug ${slug}:`, error);
      throw error;
    }
  },
  
  syncSeriesFromCricAPI: async () => {
    try {
      const response = await localApiClient.post('/series/sync');
      return response;
    } catch (error) {
      console.error('Error syncing series from CricAPI:', error);
      throw error;
    }
  },
  
  // Teams
  getTeams: async () => {
    try {
      // For development, return mock data
      return { data: mockData.teams };
      
      // For production, uncomment this
      // const response = await apiClient.get('/teams');
      // return response;
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw error;
    }
  },
  
  getTeamById: async (teamId) => {
    try {
      // For development, return mock data
      const team = mockData.teams.find(team => team.id === parseInt(teamId));
      return { data: team };
      
      // For production, uncomment this
      // const response = await apiClient.get(`/teams/${teamId}`);
      // return response;
    } catch (error) {
      console.error(`Error fetching team ${teamId}:`, error);
      throw error;
    }
  },
  
  // Players
  getPlayers: async () => {
    try {
      // For development, return mock data
      return { data: mockData.players };
      
      // For production, uncomment this
      // const response = await apiClient.get('/players');
      // return response;
    } catch (error) {
      console.error('Error fetching players:', error);
      throw error;
    }
  },
  
  getPlayerById: async (playerId) => {
    try {
      // For development, return mock data
      const player = mockData.players.find(player => player.id === parseInt(playerId));
      return { data: player };
      
      // For production, uncomment this
      // const response = await apiClient.get(`/players/${playerId}`);
      // return response;
    } catch (error) {
      console.error(`Error fetching player ${playerId}:`, error);
      throw error;
    }
  },
  
  getPlayersByTeam: async (teamId) => {
    try {
      // For development, return mock data
      const teamPlayers = mockData.players.filter(player => player.teamId === parseInt(teamId));
      return { data: teamPlayers };
      
      // For production, uncomment this
      // const response = await apiClient.get(`/teams/${teamId}/players`);
      // return response;
    } catch (error) {
      console.error(`Error fetching players for team ${teamId}:`, error);
      throw error;
    }
  },
  
  // Matches
  getMatches: async () => {
    try {
      // For development, return mock data
      return { data: mockData.matches };
      
      // For production, uncomment this
      // const response = await apiClient.get('/matches');
      // return response;
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  },
  
  getMatchById: async (matchId) => {
    try {
      // For development, return mock data
      const match = mockData.matches.find(match => match.id === parseInt(matchId));
      return { data: match };
      
      // For production, uncomment this
      // const response = await apiClient.get(`/matches/${matchId}`);
      // return response;
    } catch (error) {
      console.error(`Error fetching match ${matchId}:`, error);
      throw error;
    }
  },
  
  getMatchesByTeam: async (teamId) => {
    try {
      // For development, return mock data
      const teamMatches = mockData.matches.filter(match => 
        match.homeTeamId === parseInt(teamId) || match.awayTeamId === parseInt(teamId)
      );
      return { data: teamMatches };
      
      // For production, uncomment this
      // const response = await apiClient.get(`/teams/${teamId}/matches`);
      // return response;
    } catch (error) {
      console.error(`Error fetching matches for team ${teamId}:`, error);
      throw error;
    }
  },
  
  // Analytics
  getPlayerAnalytics: async (playerId) => {
    try {
      // For development, return mock data
      const player = mockData.players.find(player => player.id === parseInt(playerId));
      return { data: player?.stats || {} };
      
      // For production, uncomment this
      // const response = await apiClient.get(`/analytics/players/${playerId}`);
      // return response;
    } catch (error) {
      console.error(`Error fetching analytics for player ${playerId}:`, error);
      throw error;
    }
  },
  
  getTeamAnalytics: async (teamId) => {
    try {
      // For production, uncomment this
      // const response = await apiClient.get(`/analytics/teams/${teamId}`);
      // return response;
      
      // For development, return mock data
      return { 
        data: {
          totalMatches: 14,
          wins: 8,
          losses: 6,
          winPercentage: 57.14,
          totalRuns: 2450,
          totalWickets: 85,
          avgRunRate: 8.75,
          avgEconomy: 8.25
        } 
      };
    } catch (error) {
      console.error(`Error fetching analytics for team ${teamId}:`, error);
      throw error;
    }
  },
  
  fetchPointsTable: async (seriesSlug) => {
    const response = await axiosClient.get(`/api/series/${seriesSlug}/points`);
    return response.data;
  },
  
  fetchLivePointsTable: async (seriesSlug) => {
    const response = await axiosClient.get(`/api/series/${seriesSlug}/live-points`);
    return response.data;
  },
};

export default apiService;
