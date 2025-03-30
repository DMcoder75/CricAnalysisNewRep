/**
 * Database Configuration for Crichattric
 * Supports multiple environments including AWS RDS
 */

// Load environment variables if .env file exists
try {
  require('dotenv').config();
} catch (err) {
  console.log('No .env file found, using default configuration');
}

// Database configuration for different environments
const environments = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'crichattric_dev',
    password: process.env.DB_PASSWORD || 'dev_password',
    database: process.env.DB_NAME || 'crichattric_dev',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  test: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'crichattric_test',
    password: process.env.DB_PASSWORD || 'test_password',
    database: process.env.DB_NAME || 'crichattric_test',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  production: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'crichattric_prod',
    password: process.env.DB_PASSWORD || 'your_secure_password',
    database: process.env.DB_NAME || 'crichattric_prod',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  aws: {
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME,
    port: process.env.RDS_PORT || 3306,
    ssl: {
      rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
};

// Determine which environment to use
const env = process.env.NODE_ENV || 'development';
const isAws = process.env.RDS_HOSTNAME ? true : false;

// Use AWS configuration if RDS environment variables are present, otherwise use the environment-specific config
const dbConfig = isAws ? environments.aws : environments[env];

// Export the configuration
module.exports = dbConfig;
