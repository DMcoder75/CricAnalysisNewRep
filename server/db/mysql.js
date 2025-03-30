/**
 * MySQL database connection module for EC2 deployment
 */
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create database configuration from environment variables
const dbConfig = {
  host: process.env.RDS_HOSTNAME || 'database-1.c4rs0q4ymgrb.us-east-1.rds.amazonaws.com',
  user: process.env.RDS_USERNAME || 'admin',
  password: process.env.RDS_PASSWORD || 'R00tadmin',
  database: process.env.RDS_DATABASE || 'crichattric',
  port: parseInt(process.env.RDS_PORT || '3306'),
  connectionLimit: 10
};

// Add SSL configuration if certificate exists
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || 'C:\\ssl\\certs';
const sslCertPath = path.join(SSL_CERT_PATH, 'rds-combined-ca-bundle.pem');

if (fs.existsSync(sslCertPath)) {
  console.log(\Using SSL certificate at: \\);
  dbConfig.ssl = {
    ca: fs.readFileSync(sslCertPath)
  };
} else {
  console.log('SSL certificate not found, connecting without SSL');
}

// Create a connection pool
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  waitForConnections: true,
  connectionLimit: dbConfig.connectionLimit,
  queueLimit: 0,
  ssl: dbConfig.ssl
});

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error);
    console.error('Database config (without password):', {
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database,
      port: dbConfig.port,
      ssl: dbConfig.ssl ? 'Configured' : 'Not configured'
    });
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  dbConfig
};
