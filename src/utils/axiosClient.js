/**
 * Enhanced Axios Client for Crichattric
 * Includes robust error handling and fallback mechanisms
 */
import axios from 'axios';

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';
const CRICAPI_KEY = process.env.REACT_APP_CRICAPI_KEY || '1f2ad458-2220-4a94-888b-59b78221920b';
const CRICAPI_BASE_URL = process.env.REACT_APP_CRICAPI_BASE_URL || 'https://api.cricapi.com/v1';
const USE_FALLBACK = process.env.REACT_APP_USE_FALLBACK === 'true';

// Create axios instances
const serverAxiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

const cricApiAxiosClient = axios.create({
  baseURL: CRICAPI_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  },
  params: {
    apikey: CRICAPI_KEY
  }
});

// Add response interceptor for error handling
serverAxiosClient.interceptors.response.use(
  response => response,
  error => {
    console.error('Server API Error:', error);
    
    // Create a custom error object with additional context
    const customError = {
      message: error.message || 'Unknown error occurred',
      status: error.response?.status,
      data: error.response?.data,
      shouldUseFallback: true
    };
    
    return Promise.reject(customError);
  }
);

cricApiAxiosClient.interceptors.response.use(
  response => response,
  error => {
    console.error('CricAPI Error:', error);
    
    // Create a custom error object with additional context
    const customError = {
      message: error.message || 'Unknown error occurred',
      status: error.response?.status,
      data: error.response?.data,
      shouldUseFallback: true
    };
    
    return Promise.reject(customError);
  }
);

// Combined client that determines which axios instance to use based on the URL
const axiosClient = {
  get: (url, config) => {
    if (url.startsWith(CRICAPI_BASE_URL)) {
      return cricApiAxiosClient.get(url.replace(CRICAPI_BASE_URL, ''), config);
    } else if (url.startsWith(API_BASE_URL)) {
      return serverAxiosClient.get(url.replace(API_BASE_URL, ''), config);
    } else if (url.startsWith('/api/')) {
      return serverAxiosClient.get(url.replace('/api/', ''), config);
    } else {
      return axios.get(url, config);
    }
  },
  post: (url, data, config) => {
    if (url.startsWith(CRICAPI_BASE_URL)) {
      return cricApiAxiosClient.post(url.replace(CRICAPI_BASE_URL, ''), data, config);
    } else if (url.startsWith(API_BASE_URL)) {
      return serverAxiosClient.post(url.replace(API_BASE_URL, ''), data, config);
    } else if (url.startsWith('/api/')) {
      return serverAxiosClient.post(url.replace('/api/', ''), data, config);
    } else {
      return axios.post(url, data, config);
    }
  },
  // Add other methods as needed
  create: (config) => axios.create(config)
};

export default axiosClient;
