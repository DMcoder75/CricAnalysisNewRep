/**
 * Client-side Fallback Implementation for Crichattric
 * Ensures the application remains functional even when APIs fail
 */

// Fallback match data
export const fallbackMatches = [
  {
    id: 'fallback-1',
    name: 'Chennai Super Kings vs Mumbai Indians',
    matchType: 'T20',
    status: 'Chennai Super Kings won by 5 wickets',
    venue: 'M.A. Chidambaram Stadium, Chennai',
    date: new Date().toISOString(),
    teams: {
      team1: {
        name: 'Chennai Super Kings',
        shortname: 'CSK',
        logo: 'https://static.cricbuzz.com/img/teams/5_flag.png'
      },
      team2: {
        name: 'Mumbai Indians',
        shortname: 'MI',
        logo: 'https://static.cricbuzz.com/img/teams/6_flag.png'
      }
    },
    score: {
      team1: {
        runs: 156,
        wickets: 7,
        overs: 20
      },
      team2: {
        runs: 157,
        wickets: 5,
        overs: 19.2
      }
    }
  },
  {
    id: 'fallback-2',
    name: 'Royal Challengers Bangalore vs Kolkata Knight Riders',
    matchType: 'T20',
    status: 'Kolkata Knight Riders won by 8 wickets',
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    date: new Date().toISOString(),
    teams: {
      team1: {
        name: 'Royal Challengers Bangalore',
        shortname: 'RCB',
        logo: 'https://static.cricbuzz.com/img/teams/4_flag.png'
      },
      team2: {
        name: 'Kolkata Knight Riders',
        shortname: 'KKR',
        logo: 'https://static.cricbuzz.com/img/teams/3_flag.png'
      }
    },
    score: {
      team1: {
        runs: 148,
        wickets: 10,
        overs: 19.2
      },
      team2: {
        runs: 149,
        wickets: 2,
        overs: 16.4
      }
    }
  }
];

// Fallback news data
export const fallbackNews = [
  {
    id: 'news-fallback-1',
    title: 'MS Dhoni confirms he will play IPL 2024',
    summary: 'Chennai Super Kings captain MS Dhoni has confirmed he will return for IPL 2024, delighting fans across the world.',
    date: new Date().toISOString(),
    source: 'Crichattric News',
    url: '#',
    image: 'https://static.cricbuzz.com/img/players/dhoni_190.png'
  },
  {
    id: 'news-fallback-2',
    title: 'Virat Kohli aims for IPL title with RCB',
    summary: 'Royal Challengers Bangalore star Virat Kohli has expressed his determination to win the elusive IPL title with RCB.',
    date: new Date().toISOString(),
    source: 'Crichattric News',
    url: '#',
    image: 'https://static.cricbuzz.com/img/players/kohli_190.png'
  }
];

/**
 * Safely access nested properties without throwing errors
 * @param {Object} obj - The object to access
 * @param {string} path - The path to the property (e.g., 'teams.team1.name')
 * @param {*} defaultValue - Default value if property doesn't exist
 * @returns {*} - The property value or default value
 */
export const safeGet = (obj, path, defaultValue = null) => {
  if (!obj) return defaultValue;
  
  const keys = path.split('.');
  let result = obj;
  
  for (const key of keys) {
    if (result === null || result === undefined || typeof result !== 'object') {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result !== undefined ? result : defaultValue;
};

/**
 * Handle image loading errors
 * @param {Event} event - Error event
 */
export const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/150?text=No+Image';
};

/**
 * Get data with fallback mechanism
 * @param {Array|Object} data - The primary data
 * @param {Array|Object} fallback - Fallback data
 * @returns {Array|Object} - The primary data or fallback
 */
export const getDataWithFallback = (data, fallback) => {
  if (!data || (Array.isArray(data) && data.length === 0) || 
      (!Array.isArray(data) && Object.keys(data).length === 0)) {
    return fallback;
  }
  return data;
};

export default {
  fallbackMatches,
  fallbackNews,
  safeGet,
  handleImageError,
  getDataWithFallback
};
