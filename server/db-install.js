/**
 * MySQL Database Installation Script for Crichattric
 * This script sets up the MySQL database for the Crichattric application on AWS
 * Supports both local MySQL and AWS RDS
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Database configuration
let dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  multipleStatements: true
};

// AWS RDS configuration
let rdsConfig = {
  hostname: '',
  username: '',
  password: '',
  dbname: '',
  port: '3306'
};

/**
 * Ask for database type (local or RDS)
 * @returns {Promise<string>} - Database type
 */
async function getDatabaseType() {
  return new Promise((resolve) => {
    console.log('===================================================');
    console.log('Crichattric - MySQL Database Setup');
    console.log('===================================================');
    console.log('');
    console.log('Select database type:');
    console.log('1. Local MySQL');
    console.log('2. AWS RDS');
    console.log('');
    
    rl.question('Enter your choice (1 or 2): ', (choice) => {
      if (choice === '1') {
        resolve('local');
      } else if (choice === '2') {
        resolve('rds');
      } else {
        console.log('Invalid choice. Defaulting to local MySQL.');
        resolve('local');
      }
    });
  });
}

/**
 * Ask for local database credentials
 * @returns {Promise<Object>} - Database configuration
 */
async function getLocalDatabaseCredentials() {
  return new Promise((resolve) => {
    console.log('');
    console.log('Local MySQL Configuration:');
    console.log('');
    
    rl.question('Enter MySQL host [localhost]: ', (host) => {
      dbConfig.host = host || dbConfig.host;
      
      rl.question('Enter MySQL username [root]: ', (user) => {
        dbConfig.user = user || dbConfig.user;
        
        rl.question('Enter MySQL password: ', (password) => {
          dbConfig.password = password;
          
          rl.question('Enter database name [crichattric_prod]: ', (database) => {
            dbConfig.database = database || 'crichattric_prod';
            
            console.log('');
            console.log('Database Configuration:');
            console.log(`- Host: ${dbConfig.host}`);
            console.log(`- User: ${dbConfig.user}`);
            console.log(`- Database: ${dbConfig.database}`);
            console.log('');
            
            rl.question('Is this correct? (y/n): ', (answer) => {
              if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                resolve(dbConfig);
              } else {
                console.log('Please run the script again with correct information.');
                process.exit(0);
              }
            });
          });
        });
      });
    });
  });
}

/**
 * Ask for AWS RDS credentials
 * @returns {Promise<Object>} - RDS configuration
 */
async function getRDSCredentials() {
  return new Promise((resolve) => {
    console.log('');
    console.log('AWS RDS Configuration:');
    console.log('');
    
    rl.question('Enter RDS endpoint (e.g., mydb.123456789012.us-east-1.rds.amazonaws.com): ', (hostname) => {
      rdsConfig.hostname = hostname;
      
      rl.question('Enter RDS username: ', (username) => {
        rdsConfig.username = username;
        
        rl.question('Enter RDS password: ', (password) => {
          rdsConfig.password = password;
          
          rl.question('Enter RDS database name [crichattric]: ', (dbname) => {
            rdsConfig.dbname = dbname || 'crichattric';
            
            rl.question('Enter RDS port [3306]: ', (port) => {
              rdsConfig.port = port || '3306';
              
              console.log('');
              console.log('RDS Configuration:');
              console.log(`- Endpoint: ${rdsConfig.hostname}`);
              console.log(`- Username: ${rdsConfig.username}`);
              console.log(`- Database: ${rdsConfig.dbname}`);
              console.log(`- Port: ${rdsConfig.port}`);
              console.log('');
              
              rl.question('Is this correct? (y/n): ', (answer) => {
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                  // Convert RDS config to database config format
                  dbConfig = {
                    host: rdsConfig.hostname,
                    user: rdsConfig.username,
                    password: rdsConfig.password,
                    database: rdsConfig.dbname,
                    port: parseInt(rdsConfig.port),
                    ssl: {
                      rejectUnauthorized: true
                    },
                    multipleStatements: true
                  };
                  resolve(dbConfig);
                } else {
                  console.log('Please run the script again with correct information.');
                  process.exit(0);
                }
              });
            });
          });
        });
      });
    });
  });
}

/**
 * Run SQL script
 * @param {Object} config - Database configuration
 * @param {string} sqlFile - Path to SQL file
 * @returns {Promise<boolean>} - Success status
 */
async function runSqlScript(config, sqlFile) {
  try {
    // Read SQL file
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Create connection
    const connection = await mysql.createConnection(config);
    
    console.log(`Executing SQL script: ${path.basename(sqlFile)}`);
    
    // Execute SQL script
    await connection.query(sql);
    
    console.log('SQL script executed successfully.');
    
    // Close connection
    await connection.end();
    
    return true;
  } catch (error) {
    console.error('Error executing SQL script:', error);
    return false;
  }
}

/**
 * Test database connection
 * @param {Object} config - Database configuration
 * @returns {Promise<boolean>} - Connection status
 */
async function testConnection(config) {
  try {
    // Create connection
    const testConfig = { ...config };
    delete testConfig.database; // Remove database to test connection to server only
    delete testConfig.multipleStatements; // Not needed for connection test
    
    const connection = await mysql.createConnection(testConfig);
    
    console.log('Database connection successful.');
    
    // Close connection
    await connection.end();
    
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

/**
 * Create database if it doesn't exist
 * @param {Object} config - Database configuration
 * @returns {Promise<boolean>} - Success status
 */
async function createDatabase(config) {
  try {
    // Create connection without database
    const testConfig = { ...config };
    delete testConfig.database; // Remove database to connect to server only
    
    const connection = await mysql.createConnection(testConfig);
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database}`);
    
    console.log(`Database '${config.database}' created or already exists.`);
    
    // Close connection
    await connection.end();
    
    return true;
  } catch (error) {
    console.error('Error creating database:', error);
    return false;
  }
}

/**
 * Update environment file with database credentials
 * @param {Object} config - Database configuration
 * @param {string} dbType - Database type (local or rds)
 * @returns {Promise<boolean>} - Success status
 */
async function createEnvFile(config, dbType) {
  try {
    const envFile = path.join(__dirname, '..', '.env');
    
    let envContent;
    
    if (dbType === 'local') {
      // Create or update .env file for local MySQL
      envContent = `# Crichattric Environment Variables
NODE_ENV=production
PORT=3002

# Database Configuration
DB_HOST=${config.host}
DB_USER=${config.user}
DB_PASSWORD=${config.password}
DB_NAME=${config.database}
DB_PORT=${config.port || 3306}

# AWS Configuration
AWS_DOMAIN=ec2-34-224-237-254.compute-1.amazonaws.com

# API Keys
CRICKET_API_KEY=your_cricket_api_key
`;
    } else {
      // Create or update .env file for AWS RDS
      envContent = `# Crichattric Environment Variables
NODE_ENV=production
PORT=3002

# AWS RDS Configuration
RDS_HOSTNAME=${rdsConfig.hostname}
RDS_USERNAME=${rdsConfig.username}
RDS_PASSWORD=${rdsConfig.password}
RDS_DB_NAME=${rdsConfig.dbname}
RDS_PORT=${rdsConfig.port}

# AWS Configuration
AWS_DOMAIN=ec2-34-224-237-254.compute-1.amazonaws.com

# API Keys
CRICKET_API_KEY=your_cricket_api_key
`;
    }
    
    // Write .env file
    fs.writeFileSync(envFile, envContent, 'utf8');
    
    console.log('Environment file (.env) created with database credentials.');
    
    return true;
  } catch (error) {
    console.error('Error creating environment file:', error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  try {
    // Get database type
    const dbType = await getDatabaseType();
    
    // Get database credentials
    let config;
    if (dbType === 'local') {
      config = await getLocalDatabaseCredentials();
    } else {
      config = await getRDSCredentials();
    }
    
    // Test database connection
    const connectionSuccessful = await testConnection(config);
    if (!connectionSuccessful) {
      console.error('Database connection failed. Please check your credentials.');
      process.exit(1);
    }
    
    // Create database
    const databaseCreated = await createDatabase(config);
    if (!databaseCreated) {
      console.error('Failed to create database.');
      process.exit(1);
    }
    
    // Run SQL script
    const sqlFile = path.join(__dirname, 'db-setup.sql');
    const scriptExecuted = await runSqlScript({
      ...config,
      database: config.database
    }, sqlFile);
    
    if (!scriptExecuted) {
      console.error('Failed to execute SQL script.');
      process.exit(1);
    }
    
    // Create environment file
    await createEnvFile(config, dbType);
    
    console.log('');
    console.log('===================================================');
    console.log('Database setup completed successfully!');
    console.log('===================================================');
    console.log('');
    console.log('Your Crichattric application is now configured to use MySQL.');
    console.log('');
    console.log('To start the application:');
    console.log('1. Navigate to the application directory');
    console.log('2. Run: npm start');
    console.log('');
    console.log('For AWS deployment:');
    console.log('1. Copy all files to your EC2 instance');
    console.log('2. Run: node server/db-install.js');
    console.log('3. Start the application using PM2');
    console.log('');
    
    // Close readline interface
    rl.close();
  } catch (error) {
    console.error('An error occurred:', error);
    process.exit(1);
  }
}

// Run the main function
main();
