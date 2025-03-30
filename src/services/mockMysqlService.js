/**
 * Mock MySQL Service
 * This service simulates database interactions for the frontend
 * without requiring actual MySQL connections
 */

import mockData from '../data/mockData';

/**
 * Mock MySQL service object with methods to simulate database operations
 */
const mockMysqlService = {
  /**
   * Simulate connecting to the database
   * @returns {Promise<boolean>} - Connection success status
   */
  connect: async () => {
    console.log('Mock MySQL service connected');
    return true;
  },
  
  /**
   * Simulate executing a SQL query
   * @param {string} query - SQL query string
   * @param {Array} params - Query parameters
   * @returns {Promise<Array>} - Query results
   */
  executeQuery: async (query, params = []) => {
    console.log('Mock executing query:', query);
    console.log('With parameters:', params);
    
    // Simulate query execution delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Return empty array as default result
    return [];
  },
  
  /**
   * Get all current matches
   * @returns {Promise<Array>} - Array of current matches
   */
  getCurrentMatches: async () => {
    return mockData.currentMatches;
  },
  
  /**
   * Get match by ID
   * @param {string} matchId - Match ID
   * @returns {Promise<Object>} - Match object
   */
  getMatchById: async (matchId) => {
    return mockData.currentMatches.find(match => match.id === matchId) || null;
  },
  
  /**
   * Get match statistics by match ID
   * @param {string} matchId - Match ID
   * @returns {Promise<Object>} - Match statistics
   */
  getMatchStats: async (matchId) => {
    return mockData.matchStats[matchId] || null;
  },
  
  /**
   * Get all teams
   * @returns {Promise<Array>} - Array of teams
   */
  getTeams: async () => {
    return mockData.teams;
  },
  
  /**
   * Get team by ID
   * @param {string} teamId - Team ID
   * @returns {Promise<Object>} - Team object
   */
  getTeamById: async (teamId) => {
    return mockData.teams.find(team => team.id === teamId) || null;
  },
  
  /**
   * Get players by team ID
   * @param {string} teamId - Team ID
   * @returns {Promise<Array>} - Array of players
   */
  getPlayersByTeam: async (teamId) => {
    return mockData.players.filter(player => player.team === teamId);
  },
  
  /**
   * Get live match data including stats, commentary, and current state
   * @param {string} matchId - Match ID
   * @returns {Promise<Object>} - Live match data
   */
  getLiveMatchData: async (matchId) => {
    return mockData.getLiveMatchData(matchId);
  },
  
  /**
   * Close the database connection
   * @returns {Promise<boolean>} - Success status
   */
  close: async () => {
    console.log('Mock MySQL service disconnected');
    return true;
  }
};

export default mockMysqlService;
