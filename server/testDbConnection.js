/**
 * Test Database Connection
 * This script tests the connection to the MySQL database and displays data
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const dbConfig = require('../src/config/db.config');

async function testDatabaseConnection() {
  let connection;
  
  try {
    console.log('Attempting to connect to MySQL database...');
    console.log(`Host: ${dbConfig.host}, Database: ${dbConfig.database}, User: ${dbConfig.user}`);
    
    // Create a connection to the database
    connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      port: dbConfig.port
    });
    
    console.log('Successfully connected to the database!');
    
    // Test query to get teams
    console.log('\nFetching teams from database:');
    const [teams] = await connection.query('SELECT * FROM teams LIMIT 10');
    
    if (teams.length > 0) {
      console.log(`Found ${teams.length} teams:`);
      teams.forEach(team => {
        console.log(`- ${team.name} (${team.shortName})`);
      });
    } else {
      console.log('No teams found in the database.');
    }
    
    // Test query to get matches
    console.log('\nFetching matches from database:');
    const [matches] = await connection.query('SELECT * FROM matches LIMIT 10');
    
    if (matches.length > 0) {
      console.log(`Found ${matches.length} matches:`);
      matches.forEach(match => {
        console.log(`- ${match.title} (${match.status})`);
      });
    } else {
      console.log('No matches found in the database.');
    }
    
    // Test query to get players
    console.log('\nFetching players from database:');
    const [players] = await connection.query('SELECT * FROM players LIMIT 10');
    
    if (players.length > 0) {
      console.log(`Found ${players.length} players:`);
      players.forEach(player => {
        console.log(`- ${player.name} (${player.role})`);
      });
    } else {
      console.log('No players found in the database.');
    }
    
  } catch (error) {
    console.error('Failed to connect to the database:');
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\nDatabase connection closed.');
    }
  }
}

// Run the test
testDatabaseConnection();
