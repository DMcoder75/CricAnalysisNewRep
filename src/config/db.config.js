/**
 * Database configuration file
 * This file contains environment-specific database configuration settings
 * Edit this file when moving from development to production environment
 */

const dbConfig = {
  development: {
    host: 'localhost',
    user: 'root',
    password: 'D@lveer@123',
    database: 'ipl_cricket_db',
    port: 3306,
    connectionLimit: 10
  },
  production: {
    host: process.env.DB_HOST || 'your-aws-rds-endpoint.amazonaws.com',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'your-secure-password',
    database: process.env.DB_NAME || 'ipl_cricket_db',
    port: process.env.DB_PORT || 3306,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 10
  }
};

// Set the current environment
const env = process.env.NODE_ENV || 'development';

// Export the configuration for the current environment
module.exports = dbConfig[env];
