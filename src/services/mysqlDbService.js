/**
 * MySQL Database service for IPL Cricket Analytics application
 * Handles storing and retrieving data from MySQL database
 */
import axios from 'axios';

// Base URL for API endpoints
const API_BASE_URL = 'http://localhost:3003/api';

/**
 * Database service object with methods for data operations
 */
const mysqlDbService = {
  /**
   * Store multiple matches in the database
   * @param {Array} matches - Array of match objects to store
   * @returns {Promise<boolean>} - Success status
   */
  storeMatches: async (matches) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/matches/batch`, { matches });
      return response.data.success;
    } catch (error) {
      console.error('Error storing matches:', error);
      throw error;
    }
  },
  
  /**
   * Get all matches from the database
   * @returns {Promise<Array>} - Array of match objects
   */
  getAllMatches: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/matches`);
      return response.data.matches || [];
    } catch (error) {
      console.error('Error getting matches:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific match by ID
   * @param {string} id - Match ID
   * @returns {Promise<Object>} - Match object
   */
  getMatchById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/matches/${id}`);
      return response.data.match || null;
    } catch (error) {
      console.error(`Error getting match with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get matches for a specific team
   * @param {number} teamId - Team ID
   * @returns {Promise<Array>} - Array of match objects
   */
  getMatchesByTeam: async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/matches/team/${teamId}`);
      return response.data.matches || [];
    } catch (error) {
      console.error(`Error getting matches for team ${teamId}:`, error);
      throw error;
    }
  },
  
  /**
   * Store multiple teams in the database
   * @param {Array} teams - Array of team objects to store
   * @returns {Promise<boolean>} - Success status
   */
  storeTeams: async (teams) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/teams/batch`, { teams });
      return response.data.success;
    } catch (error) {
      console.error('Error storing teams:', error);
      throw error;
    }
  },
  
  /**
   * Get all teams from the database
   * @returns {Promise<Array>} - Array of team objects
   */
  getAllTeams: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teams`);
      return response.data.teams || [];
    } catch (error) {
      console.error('Error getting teams:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific team by ID
   * @param {number} id - Team ID
   * @returns {Promise<Object>} - Team object
   */
  getTeamById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teams/${id}`);
      return response.data.team || null;
    } catch (error) {
      console.error(`Error getting team with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Store multiple players in the database
   * @param {Array} players - Array of player objects to store
   * @returns {Promise<boolean>} - Success status
   */
  storePlayers: async (players) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/players/batch`, { players });
      return response.data.success;
    } catch (error) {
      console.error('Error storing players:', error);
      throw error;
    }
  },
  
  /**
   * Get all players from the database
   * @returns {Promise<Array>} - Array of player objects
   */
  getAllPlayers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/players`);
      return response.data.players || [];
    } catch (error) {
      console.error('Error getting players:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific player by ID
   * @param {number} id - Player ID
   * @returns {Promise<Object>} - Player object
   */
  getPlayerById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/players/${id}`);
      return response.data.player || null;
    } catch (error) {
      console.error(`Error getting player with ID ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Get players for a specific team
   * @param {number} teamId - Team ID
   * @returns {Promise<Array>} - Array of player objects
   */
  getPlayersByTeam: async (teamId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/players/team/${teamId}`);
      return response.data.players || [];
    } catch (error) {
      console.error(`Error getting players for team ${teamId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get match statistics
   * @param {string} matchId - Match ID
   * @returns {Promise<Object>} - Match statistics
   */
  getMatchStats: async (matchId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/matches/${matchId}/stats`);
      return response.data.stats || null;
    } catch (error) {
      console.error(`Error getting stats for match ${matchId}:`, error);
      throw error;
    }
  },
  
  /**
   * Get ball-by-ball data for a match
   * @param {string} matchId - Match ID
   * @returns {Promise<Object>} - Ball-by-ball data
   */
  getBallByBallData: async (matchId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/matches/${matchId}/ball-by-ball`);
      return response.data.ballByBall || null;
    } catch (error) {
      console.error(`Error getting ball-by-ball data for match ${matchId}:`, error);
      throw error;
    }
  },
  
  /**
   * Check database connection status
   * @returns {Promise<Object>} - Connection status
   */
  checkDbStatus: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/db-status`);
      return response.data;
    } catch (error) {
      console.error('Error checking database status:', error);
      throw error;
    }
  }
};

export default mysqlDbService;
