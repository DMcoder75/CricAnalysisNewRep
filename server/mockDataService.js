/**
 * Mock Data Service for IPL Cricket Analytics
 * Provides mock data for development and testing when database is not available
 */

const mockData = require('../src/data/mockData');

const mockDataService = {
  /**
   * Get all teams
   * @returns {Promise<Array>} Array of team objects
   */
  getAllTeams: async () => {
    return Object.values(mockData.teams || {}).map(team => ({
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      color: team.color || '#1976d2',
      logo: team.logo || ''
    }));
  },

  /**
   * Get a team by ID
   * @param {string} id Team ID
   * @returns {Promise<Object>} Team object
   */
  getTeamById: async (id) => {
    const team = mockData.teams ? mockData.teams[id] : null;
    if (!team) return null;
    
    return {
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      color: team.color || '#1976d2',
      logo: team.logo || ''
    };
  },

  /**
   * Get all players
   * @returns {Promise<Array>} Array of player objects
   */
  getAllPlayers: async () => {
    return mockData.players || [];
  },

  /**
   * Get a player by ID
   * @param {string} id Player ID
   * @returns {Promise<Object>} Player object
   */
  getPlayerById: async (id) => {
    return mockData.players ? mockData.players.find(player => player.id === id) : null;
  },

  /**
   * Get players for a team
   * @param {string} teamId Team ID
   * @returns {Promise<Array>} Array of player objects
   */
  getPlayersByTeam: async (teamId) => {
    return mockData.players ? mockData.players.filter(player => player.teamId === teamId) : [];
  },

  /**
   * Get all matches
   * @returns {Promise<Array>} Array of match objects
   */
  getAllMatches: async () => {
    return mockData.currentMatches || [];
  },

  /**
   * Get a match by ID
   * @param {string} id Match ID
   * @returns {Promise<Object>} Match object
   */
  getMatchById: async (id) => {
    return mockData.currentMatches ? mockData.currentMatches.find(match => match.id === id) : null;
  },

  /**
   * Get matches for a team
   * @param {string} teamId Team ID
   * @returns {Promise<Array>} Array of match objects
   */
  getMatchesByTeam: async (teamId) => {
    return mockData.currentMatches ? 
      mockData.currentMatches.filter(match => 
        match.teams.home.id === teamId || match.teams.away.id === teamId
      ) : [];
  },

  /**
   * Get ball-by-ball data for a match
   * @param {string} matchId Match ID
   * @returns {Promise<Object>} Match data with ball-by-ball details
   */
  getMatchBallByBallData: async (matchId) => {
    const match = mockData.getLiveMatchData(matchId);
    if (!match) return null;
    
    const matchStats = mockData.matchStats[matchId];
    if (!matchStats) return match;
    
    return {
      ...match,
      ballByBall: {
        matchId,
        innings: matchStats.innings || []
      }
    };
  }
};

module.exports = mockDataService;
