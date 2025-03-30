/**
 * API configuration file
 * This file contains environment-specific API configuration settings
 * Edit this file when moving from development to production environment
 */

const apiConfig = {
  development: {
    // Cricket API configuration
    cricketApiBaseUrl: 'https://api.cricapi.com/v1',
    apiKey: 'YOUR_CRICAPI_KEY_HERE', // Replace with your actual API key
    endpoints: {
      matches: '/matches',
      match: '/match_info',
      scorecard: '/match_scorecard',
      ballByBall: '/match_bbb',
      players: '/players',
      playerInfo: '/players_info',
      search: '/players_search',
      currentMatches: '/currentMatches',
      series: '/series',
      seriesInfo: '/series_info'
    },
    // Request parameters
    requestParams: {
      offset: 0,
      limit: 100
    },
    // Test match data for Zimbabwe A vs Durham
    testMatchData: {
      id: 'zim-a-vs-durham-2025',
      name: 'Zimbabwe A vs Durham, 2nd Match',
      matchType: 'ODI',
      status: 'Live',
      venue: 'Harare Sports Club, Harare',
      date: '2025-03-18T09:30:00.000Z',
      teams: [
        {
          id: 'zim-a',
          name: 'Zimbabwe A',
          shortName: 'ZIM A',
          color: '#C01D2E'
        },
        {
          id: 'durham',
          name: 'Durham',
          shortName: 'DURH',
          color: '#0A2240'
        }
      ],
      score: [
        {
          team: 'zim-a',
          inning: 1,
          runs: 248,
          wickets: 10,
          overs: 49.5
        },
        {
          team: 'durham',
          inning: 2,
          runs: 187,
          wickets: 6,
          overs: 38.2
        }
      ],
      useTestData: true // Set to true to use test data instead of API
    }
  },
  production: {
    // Cricket API configuration
    cricketApiBaseUrl: process.env.CRICKET_API_BASE_URL || 'https://api.cricapi.com/v1',
    apiKey: process.env.CRICKET_API_KEY || 'YOUR_CRICAPI_KEY_HERE',
    endpoints: {
      matches: '/matches',
      match: '/match_info',
      scorecard: '/match_scorecard',
      ballByBall: '/match_bbb',
      players: '/players',
      playerInfo: '/players_info',
      search: '/players_search',
      currentMatches: '/currentMatches',
      series: '/series',
      seriesInfo: '/series_info'
    },
    // Request parameters
    requestParams: {
      offset: 0,
      limit: 100
    },
    // Test match data is not used in production
    useTestData: false
  }
};

// Set the current environment
const env = process.env.NODE_ENV || 'development';

// Export the configuration for the current environment
module.exports = apiConfig[env];
