import axiosClient from './axiosClient';
import { parseMatchData } from '../utils/dataParser';

/**
 * Service for fetching and processing IPL match data
 */
const dataFetchService = {
  /**
   * Fetches match data from the IPL website
   * @returns {Promise<Array>} - Array of processed match data
   */
  fetchIPLMatches: async () => {
    try {
      // In a production environment, you would need to handle CORS issues
      // This would typically be done through a proxy server or backend API
      // For development purposes, we're demonstrating the approach
      
      const response = await axiosClient.get('https://www.iplt20.com/matches/fixtures');
      
      // Parse the HTML response to extract match data
      // This is a simplified approach - in production, you might need more robust parsing
      const matchData = parseMatchData(response.data);
      
      return matchData;
    } catch (error) {
      console.error('Error fetching IPL match data:', error);
      throw error;
    }
  },
  
  /**
   * Stores match data in the database
   * @param {Array} matches - Array of match data to store
   * @returns {Promise<boolean>} - Success status
   */
  storeMatchesInDB: async (matches) => {
    try {
      // In a real implementation, this would connect to your actual database
      // For this example, we'll use localStorage as a simple storage mechanism
      
      // Store the matches data in localStorage
      localStorage.setItem('iplMatches', JSON.stringify(matches));
      
      console.log(`Successfully stored ${matches.length} matches in the database`);
      return true;
    } catch (error) {
      console.error('Error storing matches in database:', error);
      throw error;
    }
  },
  
  /**
   * Retrieves match data from the database
   * @returns {Promise<Array>} - Array of match data
   */
  getMatchesFromDB: async () => {
    try {
      // In a real implementation, this would fetch from your actual database
      // For this example, we'll use localStorage
      
      const matches = localStorage.getItem('iplMatches');
      return matches ? JSON.parse(matches) : [];
    } catch (error) {
      console.error('Error retrieving matches from database:', error);
      throw error;
    }
  },
  
  /**
   * Synchronizes match data from the IPL website to the database
   * @returns {Promise<Array>} - Array of updated match data
   */
  syncMatchData: async () => {
    try {
      // Fetch the latest match data
      const latestMatches = await dataFetchService.fetchIPLMatches();
      
      // Store in database
      await dataFetchService.storeMatchesInDB(latestMatches);
      
      return latestMatches;
    } catch (error) {
      console.error('Error syncing match data:', error);
      throw error;
    }
  }
};

export default dataFetchService;
