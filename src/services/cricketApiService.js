/**
 * Cricket API Service
 * This service handles all API calls to the cricket data API
 */
import axiosClient from './axiosClient';
import mockData from '../data/mockData';

// Use mock data for development
const USE_MOCK_DATA = false;

const API_BASE_URL = 'https://api.cricket-data.org/v1';
const API_KEY = process.env.REACT_APP_CRICKET_API_KEY || 'your-api-key';

const cricketApiService = {
  /**
   * Get all matches
   * @returns {Promise} Promise object with match data
   */
  getAllMatches: async () => {
    if (USE_MOCK_DATA) {
      return { data: mockData.getAllMatches() };
    }
    
    return axiosClient.get(`${API_BASE_URL}/matches`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
  },
  
  /**
   * Get match by ID
   * @param {string} matchId - The match ID
   * @returns {Promise} Promise object with match data
   */
  getMatchById: async (matchId) => {
    if (USE_MOCK_DATA) {
      const matchData = mockData.getLiveMatchData(matchId);
      return { data: { data: matchData.matchDetails } };
    }
    
    return axiosClient.get(`${API_BASE_URL}/matches/${matchId}`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
  },
  
  /**
   * Get match scorecard
   * @param {string} matchId - The match ID
   * @returns {Promise} Promise object with scorecard data
   */
  getMatchScorecard: async (matchId) => {
    if (USE_MOCK_DATA) {
      const matchData = mockData.getLiveMatchData(matchId);
      return { data: { data: matchData.scorecard } };
    }
    
    return axiosClient.get(`${API_BASE_URL}/matches/${matchId}/scorecard`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
  },
  
  /**
   * Get ball-by-ball data for a match
   * @param {string} matchId - The match ID
   * @returns {Promise} Promise object with ball-by-ball data
   */
  getBallByBallData: async (matchId) => {
    if (USE_MOCK_DATA) {
      const matchData = mockData.getLiveMatchData(matchId);
      return { data: { data: matchData.ballByBall } };
    }
    
    return axiosClient.get(`${API_BASE_URL}/matches/${matchId}/ball-by-ball`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
  },
  
  /**
   * Get all teams
   * @returns {Promise} Promise object with team data
   */
  getAllTeams: async () => {
    if (USE_MOCK_DATA) {
      return { data: mockData.getAllTeams() };
    }
    
    return axiosClient.get(`${API_BASE_URL}/teams`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
  },
  
  /**
   * Get team by ID
   * @param {string} teamId - The team ID
   * @returns {Promise} Promise object with team data
   */
  getTeamById: async (teamId) => {
    if (USE_MOCK_DATA) {
      return { data: mockData.getTeamById(teamId) };
    }
    
    return axiosClient.get(`${API_BASE_URL}/teams/${teamId}`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
  },
  
  /**
   * Get all players
   * @returns {Promise} Promise object with player data
   */
  getAllPlayers: async () => {
    if (USE_MOCK_DATA) {
      return { data: mockData.getAllPlayers() };
    }
    
    return axiosClient.get(`${API_BASE_URL}/players`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
  },
  
  /**
   * Get player by ID
   * @param {string} playerId - The player ID
   * @returns {Promise} Promise object with player data
   */
  getPlayerById: async (playerId) => {
    if (USE_MOCK_DATA) {
      return { data: mockData.getPlayerById(playerId) };
    }
    
    return axiosClient.get(`${API_BASE_URL}/players/${playerId}`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
  }
};

export default cricketApiService;
