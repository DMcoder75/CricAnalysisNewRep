/**
 * Browser-compatible Axios client that doesn't rely on Node.js core modules
 */

import axios from 'axios';

// CricAPI configuration
const CRICAPI_BASE_URL = 'https://api.cricapi.com/v1';
const CRICAPI_API_KEY = '1f2ad458-2220-4a94-888b-59b78221920b';

// Create a custom axios instance for server API calls
const serverAxiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create a custom axios instance for direct CricAPI calls
const cricApiAxiosClient = axios.create({
  baseURL: CRICAPI_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to handle API key for CricAPI
cricApiAxiosClient.interceptors.request.use(
  config => {
    // Add apikey parameter to all requests
    const separator = config.url.includes('?') ? '&' : '?';
    config.url = `${config.url}${separator}apikey=${CRICAPI_API_KEY}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
cricApiAxiosClient.interceptors.response.use(
  response => {
    // Check if the API returned a status that indicates an error
    if (response.data && response.data.status !== 'success' && response.data.status !== 'ok') {
      console.warn('CricAPI returned non-success status:', response.data.status);
      // Create a custom error object
      const error = new Error(response.data.message || 'API returned an error');
      error.response = response;
      error.apiError = true;
      return Promise.reject(error);
    }
    return response;
  },
  error => {
    // Log the error for debugging
    console.error('CricAPI Error:', error.message);
    
    // Customize error message based on error type
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timed out. Please try again later.';
    } else if (!navigator.onLine) {
      error.message = 'No internet connection. Please check your network.';
    } else if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.status === 429) {
        error.message = 'API rate limit exceeded. Please try again later.';
      } else if (error.response.status === 403) {
        error.message = 'API access denied. Please check your API key.';
      } else if (error.response.status >= 500) {
        error.message = 'Cricket API server error. Please try again later.';
      }
    } else if (error.request) {
      // The request was made but no response was received
      error.message = 'No response from Cricket API. Please try again later.';
    }
    
    // Add a flag to indicate this is an API error that should trigger fallback data
    error.shouldUseFallback = true;
    
    return Promise.reject(error);
  }
);

// Combined client that determines which axios instance to use based on the URL
const axiosClient = {
  get: (url, config) => {
    console.log('axiosClient.get called with URL:', url);
    
    // If URL starts with http or https, use direct axios
    if (url.startsWith('http')) {
      return axios.get(url, config);
    }
    
    // If URL is a CricAPI endpoint (doesn't start with /), use cricApiAxiosClient
    if (!url.startsWith('/')) {
      console.log('Using cricApiAxiosClient for:', url);
      return cricApiAxiosClient.get(url, config);
    }
    
    // Otherwise use serverAxiosClient for server API calls
    console.log('Using serverAxiosClient for:', url);
    return serverAxiosClient.get(url, config);
  },
  post: (url, data, config) => {
    // If URL starts with http or https, use direct axios
    if (url.startsWith('http')) {
      return axios.post(url, data, config);
    }
    
    // If URL is a CricAPI endpoint (doesn't start with /), use cricApiAxiosClient
    if (!url.startsWith('/')) {
      return cricApiAxiosClient.post(url, data, config);
    }
    
    // Otherwise use serverAxiosClient
    return serverAxiosClient.post(url, data, config);
  },
  put: (url, data, config) => {
    // If URL starts with http or https, use direct axios
    if (url.startsWith('http')) {
      return axios.put(url, data, config);
    }
    
    // If URL is a CricAPI endpoint (doesn't start with /), use cricApiAxiosClient
    if (!url.startsWith('/')) {
      return cricApiAxiosClient.put(url, data, config);
    }
    
    // Otherwise use serverAxiosClient
    return serverAxiosClient.put(url, data, config);
  },
  delete: (url, config) => {
    // If URL starts with http or https, use direct axios
    if (url.startsWith('http')) {
      return axios.delete(url, config);
    }
    
    // If URL is a CricAPI endpoint (doesn't start with /), use cricApiAxiosClient
    if (!url.startsWith('/')) {
      return cricApiAxiosClient.delete(url, config);
    }
    
    // Otherwise use serverAxiosClient
    return serverAxiosClient.delete(url, config);
  },
  create: (config = {}) => {
    // Create a new instance with custom configuration
    const customInstance = axios.create(config);
    
    // If baseURL is for CricAPI, add the API key interceptor
    if (config.baseURL && config.baseURL.includes('cricapi.com')) {
      customInstance.interceptors.request.use(
        config => {
          // Add apikey parameter to all requests
          const separator = config.url.includes('?') ? '&' : '?';
          config.url = `${config.url}${separator}apikey=${CRICAPI_API_KEY}`;
          return config;
        },
        error => {
          return Promise.reject(error);
        }
      );
    }
    
    return customInstance;
  }
};

export default axiosClient;
