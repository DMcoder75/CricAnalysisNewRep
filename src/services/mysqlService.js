/**
 * MySQL Database Service for IPL Cricket Analytics
 * Handles database operations for storing and retrieving cricket match data
 */

const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

// Create a connection pool
const pool = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  port: dbConfig.port,
  connectionLimit: dbConfig.connectionLimit,
  waitForConnections: true
});

/**
 * Initialize the database by creating necessary tables if they don't exist
 */
const initDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
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
    
    // Create points table for IPL standings
    await connection.query(`
      CREATE TABLE IF NOT EXISTS points_table (
        id INT PRIMARY KEY AUTO_INCREMENT,
        team_id INT NOT NULL,
        series_id VARCHAR(100) NOT NULL,
        matches_played INT DEFAULT 0,
        wins INT DEFAULT 0,
        losses INT DEFAULT 0,
        draws INT DEFAULT 0,
        no_results INT DEFAULT 0,
        points INT DEFAULT 0,
        net_run_rate DECIMAL(5,3) DEFAULT 0.000,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (team_id) REFERENCES teams(id),
        UNIQUE KEY series_team_idx (series_id, team_id)
      )
    `);
    
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
    
    console.log('Database initialized successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

/**
 * MySQL Database service object with methods for data operations
 */
const mysqlService = {
  /**
   * Initialize the database
   */
  init: async () => {
    return await initDatabase();
  },
  
  /**
   * Store multiple teams in the database
   * @param {Array} teams - Array of team objects to store
   * @returns {Promise<boolean>} - Success status
   */
  storeTeams: async (teams) => {
    try {
      const connection = await pool.getConnection();
      
      for (const team of teams) {
        await connection.query(
          'INSERT INTO teams (id, name, shortName, color, logo) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, shortName=?, color=?, logo=?',
          [team.id, team.name, team.shortName, team.color, team.logo, team.name, team.shortName, team.color, team.logo]
        );
      }
      
      connection.release();
      console.log(`Successfully stored ${teams.length} teams in the database`);
      return true;
    } catch (error) {
      console.error('Error storing teams:', error);
      throw error;
    }
  },
  
  /**
   * Get all teams from the database
   * @returns {Promise<Array>} - Array of team objects
   */
  getAllTeams: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM teams');
      return rows;
    } catch (error) {
      console.error('Error getting teams:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific team by ID
   * @param {number} id - Team ID
   * @returns {Promise<Object>} - Team object
   */
  getTeamById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting team:', error);
      throw error;
    }
  },
  
  /**
   * Store multiple players in the database
   * @param {Array} players - Array of player objects to store
   * @returns {Promise<boolean>} - Success status
   */
  storePlayers: async (players) => {
    try {
      const connection = await pool.getConnection();
      
      for (const player of players) {
        // Insert or update player
        await connection.query(
          'INSERT INTO players (id, name, teamId, role, battingStyle, bowlingStyle, nationality) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, teamId=?, role=?, battingStyle=?, bowlingStyle=?, nationality=?',
          [
            player.id, player.name, player.teamId, player.role, player.battingStyle, player.bowlingStyle, player.nationality,
            player.name, player.teamId, player.role, player.battingStyle, player.bowlingStyle, player.nationality
          ]
        );
        
        // Insert or update player stats
        if (player.stats) {
          const batting = player.stats.batting || {};
          const bowling = player.stats.bowling || {};
          
          await connection.query(
            'INSERT INTO player_stats (playerId, matches, runs, batting_average, strike_rate, fifties, hundreds, wickets, bowling_economy, bowling_average) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE matches=?, runs=?, batting_average=?, strike_rate=?, fifties=?, hundreds=?, wickets=?, bowling_economy=?, bowling_average=?',
            [
              player.id, batting.matches || 0, batting.runs || 0, batting.average || 0, batting.strikeRate || 0, 
              batting.fifties || 0, batting.hundreds || 0, bowling.wickets || 0, bowling.economy || 0, bowling.average || 0,
              batting.matches || 0, batting.runs || 0, batting.average || 0, batting.strikeRate || 0, 
              batting.fifties || 0, batting.hundreds || 0, bowling.wickets || 0, bowling.economy || 0, bowling.average || 0
            ]
          );
        }
      }
      
      connection.release();
      console.log(`Successfully stored ${players.length} players in the database`);
      return true;
    } catch (error) {
      console.error('Error storing players:', error);
      throw error;
    }
  },
  
  /**
   * Get all players from the database
   * @returns {Promise<Array>} - Array of player objects
   */
  getAllPlayers: async () => {
    try {
      const [players] = await pool.query('SELECT * FROM players');
      
      // Get stats for each player
      for (const player of players) {
        const [stats] = await pool.query('SELECT * FROM player_stats WHERE playerId = ?', [player.id]);
        if (stats.length > 0) {
          player.stats = {
            batting: {
              matches: stats[0].matches,
              runs: stats[0].runs,
              average: stats[0].batting_average,
              strikeRate: stats[0].strike_rate,
              fifties: stats[0].fifties,
              hundreds: stats[0].hundreds
            },
            bowling: {
              matches: stats[0].matches,
              wickets: stats[0].wickets,
              economy: stats[0].bowling_economy,
              average: stats[0].bowling_average
            }
          };
        }
      }
      
      return players;
    } catch (error) {
      console.error('Error getting players:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific player by ID
   * @param {number} id - Player ID
   * @returns {Promise<Object>} - Player object
   */
  getPlayerById: async (id) => {
    try {
      const [players] = await pool.query('SELECT * FROM players WHERE id = ?', [id]);
      
      if (players.length === 0) {
        return null;
      }
      
      const player = players[0];
      
      // Get stats for the player
      const [stats] = await pool.query('SELECT * FROM player_stats WHERE playerId = ?', [id]);
      if (stats.length > 0) {
        player.stats = {
          batting: {
            matches: stats[0].matches,
            runs: stats[0].runs,
            average: stats[0].batting_average,
            strikeRate: stats[0].strike_rate,
            fifties: stats[0].fifties,
            hundreds: stats[0].hundreds
          },
          bowling: {
            matches: stats[0].matches,
            wickets: stats[0].wickets,
            economy: stats[0].bowling_economy,
            average: stats[0].bowling_average
          }
        };
      }
      
      return player;
    } catch (error) {
      console.error('Error getting player:', error);
      throw error;
    }
  },
  
  /**
   * Get players for a specific team
   * @param {number} teamId - Team ID
   * @returns {Promise<Array>} - Array of player objects
   */
  getPlayersByTeam: async (teamId) => {
    try {
      const [players] = await pool.query('SELECT * FROM players WHERE teamId = ?', [teamId]);
      
      // Get stats for each player
      for (const player of players) {
        const [stats] = await pool.query('SELECT * FROM player_stats WHERE playerId = ?', [player.id]);
        if (stats.length > 0) {
          player.stats = {
            batting: {
              matches: stats[0].matches,
              runs: stats[0].runs,
              average: stats[0].batting_average,
              strikeRate: stats[0].strike_rate,
              fifties: stats[0].fifties,
              hundreds: stats[0].hundreds
            },
            bowling: {
              matches: stats[0].matches,
              wickets: stats[0].wickets,
              economy: stats[0].bowling_economy,
              average: stats[0].bowling_average
            }
          };
        }
      }
      
      return players;
    } catch (error) {
      console.error('Error getting players by team:', error);
      throw error;
    }
  },
  
  /**
   * Store multiple matches in the database
   * @param {Array} matches - Array of match objects to store
   * @returns {Promise<boolean>} - Success status
   */
  storeMatches: async (matches) => {
    try {
      const connection = await pool.getConnection();
      
      for (const match of matches) {
        await connection.query(
          'INSERT INTO matches (id, homeTeamId, awayTeamId, date, venue, status, result) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE homeTeamId=?, awayTeamId=?, date=?, venue=?, status=?, result=?',
          [
            match.id, match.homeTeamId, match.awayTeamId, match.date, match.venue, match.status, match.result,
            match.homeTeamId, match.awayTeamId, match.date, match.venue, match.status, match.result
          ]
        );
      }
      
      connection.release();
      console.log(`Successfully stored ${matches.length} matches in the database`);
      return true;
    } catch (error) {
      console.error('Error storing matches:', error);
      throw error;
    }
  },
  
  /**
   * Get all matches from the database
   * @returns {Promise<Array>} - Array of match objects
   */
  getAllMatches: async () => {
    try {
      const [rows] = await pool.query('SELECT * FROM matches ORDER BY date');
      return rows;
    } catch (error) {
      console.error('Error getting matches:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific match by ID
   * @param {number} id - Match ID
   * @returns {Promise<Object>} - Match object
   */
  getMatchById: async (id) => {
    try {
      const [rows] = await pool.query('SELECT * FROM matches WHERE id = ?', [id]);
      return rows[0] || null;
    } catch (error) {
      console.error('Error getting match:', error);
      throw error;
    }
  },
  
  /**
   * Get matches for a specific team
   * @param {number} teamId - Team ID
   * @returns {Promise<Array>} - Array of match objects
   */
  getMatchesByTeam: async (teamId) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM matches WHERE homeTeamId = ? OR awayTeamId = ? ORDER BY date',
        [teamId, teamId]
      );
      return rows;
    } catch (error) {
      console.error('Error getting matches by team:', error);
      throw error;
    }
  },
  
  /**
   * Store ball-by-ball data for a live match
   * @param {Object} ballData - Ball data object
   * @returns {Promise<boolean>} - Success status
   */
  storeBallByBallData: async (ballData) => {
    try {
      const connection = await pool.getConnection();
      
      // Check if innings exists, create if not
      const [innings] = await connection.query(
        'SELECT id FROM match_innings WHERE matchId = ? AND teamId = ? AND inningNumber = ?',
        [ballData.matchId, ballData.teamId, ballData.inningNumber]
      );
      
      let inningId;
      
      if (innings.length === 0) {
        // Create new innings
        const [result] = await connection.query(
          'INSERT INTO match_innings (matchId, teamId, inningNumber) VALUES (?, ?, ?)',
          [ballData.matchId, ballData.teamId, ballData.inningNumber]
        );
        inningId = result.insertId;
      } else {
        inningId = innings[0].id;
      }
      
      // Insert ball data
      await connection.query(
        `INSERT INTO ball_by_ball (
          matchId, inningId, over_number, batsmanId, bowlerId, 
          runs, extras, extras_type, wicket, wicket_type, 
          dismissed_player_id, commentary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ballData.matchId, inningId, ballData.overNumber, ballData.batsmanId, ballData.bowlerId,
          ballData.runs, ballData.extras, ballData.extrasType, ballData.wicket, ballData.wicketType,
          ballData.dismissedPlayerId, ballData.commentary
        ]
      );
      
      // Update innings totals
      await connection.query(
        'UPDATE match_innings SET runs = runs + ?, wickets = wickets + ?, overs = ? WHERE id = ?',
        [
          ballData.runs + ballData.extras,
          ballData.wicket ? 1 : 0,
          ballData.overNumber,
          inningId
        ]
      );
      
      // Update match status to Live if it's not already
      await connection.query(
        'UPDATE matches SET status = "Live" WHERE id = ? AND status != "Completed"',
        [ballData.matchId]
      );
      
      connection.release();
      return true;
    } catch (error) {
      console.error('Error storing ball-by-ball data:', error);
      throw error;
    }
  },
  
  /**
   * Get ball-by-ball data for a match
   * @param {number} matchId - Match ID
   * @returns {Promise<Object>} - Match data with ball-by-ball details
   */
  getMatchBallByBallData: async (matchId) => {
    try {
      // Get match details
      const [matches] = await pool.query('SELECT * FROM matches WHERE id = ?', [matchId]);
      if (matches.length === 0) {
        return null;
      }
      
      const match = matches[0];
      
      // Get innings
      const [innings] = await pool.query('SELECT * FROM match_innings WHERE matchId = ? ORDER BY inningNumber', [matchId]);
      match.innings = innings;
      
      // Get ball-by-ball data for each innings
      for (const inning of match.innings) {
        const [balls] = await pool.query(
          'SELECT * FROM ball_by_ball WHERE inningId = ? ORDER BY over_number',
          [inning.id]
        );
        inning.balls = balls;
      }
      
      return match;
    } catch (error) {
      console.error('Error getting ball-by-ball data:', error);
      throw error;
    }
  },
  
  /**
   * Complete a match and update its status
   * @param {number} matchId - Match ID
   * @param {string} result - Match result description
   * @returns {Promise<boolean>} - Success status
   */
  completeMatch: async (matchId, result) => {
    try {
      await pool.query(
        'UPDATE matches SET status = "Completed", result = ? WHERE id = ?',
        [result, matchId]
      );
      return true;
    } catch (error) {
      console.error('Error completing match:', error);
      throw error;
    }
  }
};

module.exports = mysqlService;
