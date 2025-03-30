/**
 * Database Initialization Script
 * This script initializes the MySQL database and tables for the IPL Cricket Analytics application
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const dbConfig = require('../src/config/db.config');

// Function to create database and tables
async function initializeDatabase() {
  let connection;
  
  try {
    // First connect without specifying a database to create it if it doesn't exist
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });
    
    console.log('Connected to MySQL server');
    
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log(`Database '${dbConfig.database}' created or already exists`);
    
    // Close connection and reconnect with the database selected
    await connection.end();
    
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    console.log(`Connected to database '${dbConfig.database}'`);
    
    // Create teams table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS teams (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        shortName VARCHAR(10) NOT NULL,
        color VARCHAR(20),
        logo VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('Teams table created or already exists');
    
    // Create players table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS players (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        teamId INT,
        role VARCHAR(50),
        battingStyle VARCHAR(50),
        bowlingStyle VARCHAR(50),
        nationality VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE SET NULL
      )
    `);
    console.log('Players table created or already exists');
    
    // Create player_stats table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS player_stats (
        id INT PRIMARY KEY AUTO_INCREMENT,
        playerId INT NOT NULL,
        matches INT DEFAULT 0,
        runs INT DEFAULT 0,
        batting_average DECIMAL(6,2) DEFAULT 0,
        strike_rate DECIMAL(6,2) DEFAULT 0,
        fifties INT DEFAULT 0,
        hundreds INT DEFAULT 0,
        wickets INT DEFAULT 0,
        bowling_economy DECIMAL(6,2) DEFAULT 0,
        bowling_average DECIMAL(6,2) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (playerId) REFERENCES players(id) ON DELETE CASCADE
      )
    `);
    console.log('Player stats table created or already exists');
    
    // Create matches table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS matches (
        id INT PRIMARY KEY AUTO_INCREMENT,
        homeTeamId INT,
        awayTeamId INT,
        date DATETIME NOT NULL,
        venue VARCHAR(255),
        status ENUM('Upcoming', 'Live', 'Completed') DEFAULT 'Upcoming',
        result TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (homeTeamId) REFERENCES teams(id) ON DELETE SET NULL,
        FOREIGN KEY (awayTeamId) REFERENCES teams(id) ON DELETE SET NULL
      )
    `);
    console.log('Matches table created or already exists');
    
    // Create match_innings table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS match_innings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        matchId INT NOT NULL,
        teamId INT NOT NULL,
        inningNumber INT NOT NULL,
        runs INT DEFAULT 0,
        wickets INT DEFAULT 0,
        overs DECIMAL(5,1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (matchId) REFERENCES matches(id) ON DELETE CASCADE,
        FOREIGN KEY (teamId) REFERENCES teams(id) ON DELETE CASCADE
      )
    `);
    console.log('Match innings table created or already exists');
    
    // Create ball_by_ball table for storing live match data
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ball_by_ball (
        id INT PRIMARY KEY AUTO_INCREMENT,
        matchId INT NOT NULL,
        inningId INT NOT NULL,
        over_number DECIMAL(5,1) NOT NULL,
        batsmanId INT,
        bowlerId INT,
        runs INT DEFAULT 0,
        extras INT DEFAULT 0,
        extras_type ENUM('wide', 'no-ball', 'bye', 'leg-bye', 'penalty', 'none') DEFAULT 'none',
        wicket BOOLEAN DEFAULT FALSE,
        wicket_type ENUM('bowled', 'caught', 'lbw', 'run-out', 'stumped', 'hit-wicket', 'retired-hurt', 'none') DEFAULT 'none',
        dismissed_player_id INT,
        commentary TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (matchId) REFERENCES matches(id) ON DELETE CASCADE,
        FOREIGN KEY (inningId) REFERENCES match_innings(id) ON DELETE CASCADE,
        FOREIGN KEY (batsmanId) REFERENCES players(id) ON DELETE SET NULL,
        FOREIGN KEY (bowlerId) REFERENCES players(id) ON DELETE SET NULL,
        FOREIGN KEY (dismissed_player_id) REFERENCES players(id) ON DELETE SET NULL
      )
    `);
    console.log('Ball-by-ball table created or already exists');
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// Run the initialization
initializeDatabase();
