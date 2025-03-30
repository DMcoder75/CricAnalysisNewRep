/**
 * Server-compatible Axios client for Node.js
 */

const axios = require('axios');

// API base URL and key
const API_BASE_URL = 'https://api.cricapi.com/v1';
const API_KEY = '1f2ad458-2220-4a94-888b-59b78221920b';

// Debug mode
const DEBUG = true;

// Helper function to build full URL
const buildUrl = (url) => {
  // If the URL already starts with http:// or https://, return it as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Remove leading slash if present
  const urlWithoutLeadingSlash = url.startsWith('/') ? url.slice(1) : url;
  
  // Add the API key as a query parameter
  const separator = urlWithoutLeadingSlash.includes('?') ? '&' : '?';
  const fullUrl = `${API_BASE_URL}/${urlWithoutLeadingSlash}${separator}apikey=${API_KEY}`;
  
  if (DEBUG) {
    console.log('Making request to:', fullUrl);
  }
  
  return fullUrl;
};

// Create a custom axios instance
const axiosClient = {
  get: async (url, config = {}) => {
    try {
      const fullUrl = buildUrl(url);
      
      if (DEBUG) {
        console.log('GET request to:', fullUrl);
      }
      
      const response = await axios.get(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers || {})
        },
        ...config
      });
      
      return response;
    } catch (error) {
      console.error('Error in GET request:', error.message);
      throw error;
    }
  },
  
  post: async (url, body = {}, config = {}) => {
    try {
      const fullUrl = buildUrl(url);
      
      if (DEBUG) {
        console.log('POST request to:', fullUrl);
        console.log('POST body:', body);
      }
      
      const response = await axios.post(fullUrl, body, {
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers || {})
        },
        ...config
      });
      
      return response;
    } catch (error) {
      console.error('Error in POST request:', error.message);
      throw error;
    }
  },
  
  put: async (url, body = {}, config = {}) => {
    try {
      const fullUrl = buildUrl(url);
      
      if (DEBUG) {
        console.log('PUT request to:', fullUrl);
        console.log('PUT body:', body);
      }
      
      const response = await axios.put(fullUrl, body, {
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers || {})
        },
        ...config
      });
      
      return response;
    } catch (error) {
      console.error('Error in PUT request:', error.message);
      throw error;
    }
  },
  
  delete: async (url, config = {}) => {
    try {
      const fullUrl = buildUrl(url);
      
      if (DEBUG) {
        console.log('DELETE request to:', fullUrl);
      }
      
      const response = await axios.delete(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(config.headers || {})
        },
        ...config
      });
      
      return response;
    } catch (error) {
      console.error('Error in DELETE request:', error.message);
      throw error;
    }
  },
  
  // Create a new instance with custom config (similar to axios.create())
  create: (config = {}) => {
    const customInstance = axios.create(config);
    
    return {
      get: async (url, requestConfig = {}) => {
        try {
          const fullUrl = buildUrl(url);
          return await customInstance.get(fullUrl, requestConfig);
        } catch (error) {
          console.error('Error in custom GET request:', error.message);
          throw error;
        }
      },
      post: async (url, body = {}, requestConfig = {}) => {
        try {
          const fullUrl = buildUrl(url);
          return await customInstance.post(fullUrl, body, requestConfig);
        } catch (error) {
          console.error('Error in custom POST request:', error.message);
          throw error;
        }
      },
      put: async (url, body = {}, requestConfig = {}) => {
        try {
          const fullUrl = buildUrl(url);
          return await customInstance.put(fullUrl, body, requestConfig);
        } catch (error) {
          console.error('Error in custom PUT request:', error.message);
          throw error;
        }
      },
      delete: async (url, requestConfig = {}) => {
        try {
          const fullUrl = buildUrl(url);
          return await customInstance.delete(fullUrl, requestConfig);
        } catch (error) {
          console.error('Error in custom DELETE request:', error.message);
          throw error;
        }
      }
    };
  }
};

module.exports = axiosClient;
