/**
 * Data Utility Functions for Crichattric
 * Includes robust fallback mechanisms
 */
import axiosClient from './axiosClient';
import fallbackData from './fallback/fallbackData';

/**
 * Fetch data with fallback mechanism
 * @param {string} url - API endpoint URL
 * @param {string} cacheKey - Key for sessionStorage cache
 * @param {Array|Object} fallbackData - Fallback data if API and cache fail
 * @param {Object} options - Additional options
 * @returns {Promise<Array|Object>} - Fetched data
 */
export const fetchDataWithFallback = async (url, cacheKey, fallbackData, options = {}) => {
  const { refreshCache = false, logPrefix = 'Data' } = options;
  
  try {
    // Try to get data from cache first if not refreshing
    if (!refreshCache && typeof window !== 'undefined' && window.sessionStorage) {
      const cachedData = sessionStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          console.log(\\: Using cached data\);
          return parsedData;
        } catch (error) {
          console.error(\\: Error parsing cached data\, error);
          // Continue to API call if cache parsing fails
        }
      }
    }
    
    // Try to get data from API
    console.log(\\: Fetching from API: \\);
    const response = await axiosClient.get(url);
    
    // Validate API response
    if (response.data && (Array.isArray(response.data) || Object.keys(response.data).length > 0)) {
      // Cache the successful response
      if (typeof window !== 'undefined' && window.sessionStorage) {
        sessionStorage.setItem(cacheKey, JSON.stringify(response.data));
      }
      console.log(\\: API fetch successful\);
      return response.data;
    } else {
      throw new Error('API returned empty or invalid data');
    }
  } catch (error) {
    console.error(\\: API fetch failed\, error);
    
    // Try to get data from cache as fallback
    if (typeof window !== 'undefined' && window.sessionStorage) {
      try {
        const cachedData = sessionStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          console.log(\\: Using cached data as fallback\);
          return parsedData;
        }
      } catch (cacheError) {
        console.error(\\: Cache fallback failed\, cacheError);
      }
    }
    
    // Use provided fallback data as last resort
    console.log(\\: Using static fallback data\);
    return fallbackData;
  }
};

/**
 * Fetch matches with fallback mechanism
 * @param {boolean} refreshCache - Whether to refresh cache
 * @returns {Promise<Array>} - Matches data
 */
export const fetchMatches = async (refreshCache = false) => {
  return fetchDataWithFallback(
    '/api/matches',
    'crichattric_matches',
    fallbackData.matches,
    { refreshCache, logPrefix: 'Matches' }
  );
};

/**
 * Fetch news with fallback mechanism
 * @param {boolean} refreshCache - Whether to refresh cache
 * @returns {Promise<Array>} - News data
 */
export const fetchNews = async (refreshCache = false) => {
  return fetchDataWithFallback(
    '/api/news',
    'crichattric_news',
    fallbackData.news,
    { refreshCache, logPrefix: 'News' }
  );
};

/**
 * Fetch teams with fallback mechanism
 * @param {boolean} refreshCache - Whether to refresh cache
 * @returns {Promise<Array>} - Teams data
 */
export const fetchTeams = async (refreshCache = false) => {
  return fetchDataWithFallback(
    '/api/teams',
    'crichattric_teams',
    fallbackData.teams,
    { refreshCache, logPrefix: 'Teams' }
  );
};

/**
 * Handle image loading errors
 * @param {Event} event - Error event
 */
export const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/150?text=No+Image';
};

export default {
  fetchDataWithFallback,
  fetchMatches,
  fetchNews,
  fetchTeams,
  handleImageError
};
