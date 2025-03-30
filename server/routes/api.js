/**
 * API Routes for IPL Cricket Analytics application
 */
const express = require('express');
const router = express.Router();
const fallbackData = require('../utils/fallback/fallbackData');
const { pool } = require('../db/mysql');
const axiosClient = require('../services/axiosClient');

// CricAPI configuration
const CRICAPI_BASE_URL = 'https://api.cricapi.com/v1';
const CRICAPI_KEY = '1f2ad458-2220-4a94-888b-59b78221920b';
const IPL_SERIES_ID = 'd5a498c8-7596-4b93-8ab0-e0efc3345312';

// Helper function to generate slug from series name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
};

// Helper function to generate mock series data
function generateMockSeries() {
  const currentDate = new Date();
  const seriesTypes = ['T20', 'ODI', 'Test', 'T20I', 'ODI World Cup', 'T20 World Cup'];
  const teams = ['India', 'Australia', 'England', 'New Zealand', 'South Africa', 'Pakistan', 'Sri Lanka', 'West Indies', 'Bangladesh', 'Afghanistan'];
  
  // Generate 15 mock series
  return Array.from({ length: 15 }, (_, index) => {
    // Random start date between 6 months ago and 3 months from now
    const startOffset = Math.floor(Math.random() * 270) - 180; // -180 to +90 days
    const startDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() + startOffset);
    
    // End date is 2-4 weeks after start date
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 14) + 14); // 14-28 days
    
    // Determine status based on dates
    let status;
    if (endDate < currentDate) {
      status = 'completed';
    } else if (startDate <= currentDate && endDate >= currentDate) {
      status = 'ongoing';
    } else {
      status = 'upcoming';
    }
    
    // Generate a series name
    const seriesType = seriesTypes[Math.floor(Math.random() * seriesTypes.length)];
    const teamA = teams[Math.floor(Math.random() * teams.length)];
    let teamB;
    do {
      teamB = teams[Math.floor(Math.random() * teams.length)];
    } while (teamB === teamA);
    
    const year = startDate.getFullYear();
    const name = `${teamA} vs ${teamB} ${seriesType} Series ${year}`;
    
    // Generate a slug
    const slug = name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    return {
      id: index + 1,
      name,
      slug,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status,
      description: `${teamA} takes on ${teamB} in this exciting ${seriesType} cricket series.`,
      venue: `Multiple venues in ${Math.random() > 0.5 ? teamA : teamB}`,
      total_matches: Math.floor(Math.random() * 5) + 3, // 3-7 matches
      format: seriesType
    };
  });
}

// Get all series
router.get('/series', async (req, res) => {
  try {
    console.log('API route: Received request for all series');
    
    // Check database connection
    const [connectionTest] = await pool.query('SELECT 1 as test');
    console.log('Database connection test:', connectionTest);
    
    try {
      const [rows] = await pool.query('SELECT * FROM series ORDER BY start_date DESC');
      console.log('Series data from database:', rows);
      
      if (rows && rows.length > 0) {
        // Format dates for frontend consumption
        const formattedSeries = rows.map(series => ({
          ...series,
          start_date: series.start_date ? new Date(series.start_date).toISOString() : null,
          end_date: series.end_date ? new Date(series.end_date).toISOString() : null
        }));
        
        console.log('Formatted series data:', formattedSeries);
        return res.json({ success: true, series: formattedSeries });
      } else {
        console.log('No series found in database, generating mock data');
        // Generate mock series data as fallback
        const mockSeries = generateMockSeries();
        return res.json({ success: true, series: mockSeries });
      }
    } catch (dbError) {
      console.error('Database error when fetching series:', dbError);
      // Fallback to mock data
      console.log('Falling back to mock series data');
      const mockSeries = generateMockSeries();
      return res.json({ success: true, series: mockSeries });
    }
  } catch (error) {
    console.error('Error fetching series:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get series by ID or slug
router.get('/series/:idOrSlug', async (req, res) => {
  try {
    const idOrSlug = req.params.idOrSlug;
    const isNumeric = /^\d+$/.test(idOrSlug);
    
    let query;
    let params;
    
    if (isNumeric) {
      query = 'SELECT * FROM series WHERE id = ?';
      params = [idOrSlug];
    } else {
      query = 'SELECT * FROM series WHERE slug = ?';
      params = [idOrSlug];
    }
    
    const [rows] = await pool.query(query, params);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Series not found' });
    }
    
    res.json({ success: true, series: rows[0] });
  } catch (error) {
    console.error(`Error fetching series with ID/slug ${req.params.idOrSlug}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create or update multiple series
router.post('/series/batch', async (req, res) => {
  try {
    const { series } = req.body;
    if (!series || !Array.isArray(series)) {
      return res.status(400).json({ success: false, error: 'Invalid series data' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const item of series) {
        const { id, name, startDate, endDate, status } = item;
        const slug = item.slug || generateSlug(name);
        
        if (id) {
          // Update existing series
          await connection.query(
            'UPDATE series SET name = ?, slug = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?',
            [name, slug, startDate, endDate, status, id]
          );
        } else {
          // Check if series with this slug already exists
          const [existingRows] = await connection.query('SELECT id FROM series WHERE slug = ?', [slug]);
          
          if (existingRows.length > 0) {
            // Update existing series by slug
            await connection.query(
              'UPDATE series SET name = ?, start_date = ?, end_date = ?, status = ? WHERE slug = ?',
              [name, startDate, endDate, status, slug]
            );
          } else {
            // Insert new series
            await connection.query(
              'INSERT INTO series (name, slug, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
              [name, slug, startDate, endDate, status]
            );
          }
        }
      }

      await connection.commit();
      res.json({ success: true, message: `Successfully stored ${series.length} series` });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error storing series:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sync series data from CricAPI
router.post('/series/sync', async (req, res) => {
  try {
    // Fetch series from CricAPI
    const apiUrl = `${CRICAPI_BASE_URL}/series`;
    console.log(`Making API request to ${apiUrl}`);
    
    const response = await axiosClient.get(apiUrl, {
      params: {
        apikey: CRICAPI_KEY,
        offset: 0
      }
    });
    
    if (response.data && response.data.status === 'success' && response.data.data) {
      const seriesData = response.data.data;
      console.log(`Retrieved ${seriesData.length} series from CricAPI`);
      
      // Transform the data
      const formattedSeries = seriesData.map(item => {
        // Validate dates
        let startDate = item.startDate;
        let endDate = item.endDate;
        
        const startDateObj = new Date(startDate);
        const endDateObj = new Date(endDate);
        
        // Determine status
        const now = new Date();
        let status = 'upcoming';
        
        if (!isNaN(startDateObj.getTime()) && !isNaN(endDateObj.getTime())) {
          if (now < startDateObj) status = 'upcoming';
          else if (now > endDateObj) status = 'completed';
          else status = 'ongoing';
        }
        
        return {
          name: item.name,
          slug: generateSlug(item.name),
          startDate: startDate,
          endDate: endDate,
          status: status
        };
      });
      
      // Store in database
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();
        
        for (const series of formattedSeries) {
          // Check if series already exists
          const [existingRows] = await connection.query('SELECT id FROM series WHERE slug = ?', [series.slug]);
          
          if (existingRows.length > 0) {
            // Update existing series
            await connection.query(
              'UPDATE series SET name = ?, start_date = ?, end_date = ?, status = ? WHERE slug = ?',
              [series.name, series.startDate, series.endDate, series.status, series.slug]
            );
          } else {
            // Insert new series
            await connection.query(
              'INSERT INTO series (name, slug, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)',
              [series.name, series.slug, series.startDate, series.endDate, series.status]
            );
          }
        }
        
        await connection.commit();
        res.json({ 
          success: true, 
          message: `Successfully synced ${formattedSeries.length} series from CricAPI` 
        });
      } catch (error) {
        await connection.rollback();
        throw error;
      } finally {
        connection.release();
      }
    } else {
      throw new Error('Invalid response from CricAPI');
    }
  } catch (error) {
    console.error('Error syncing series from CricAPI:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to sync series data. Please try again later.' 
    });
  }
});

// Delete a series
router.delete('/series/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM series WHERE id = ?', [req.params.id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Series not found' });
    }
    
    res.json({ success: true, message: 'Series deleted successfully' });
  } catch (error) {
    console.error(`Error deleting series with ID ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all teams
router.get('/teams', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teams');
    res.json({ success: true, teams: rows });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get team by ID
router.get('/teams/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM teams WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Team not found' });
    }
    res.json({ success: true, team: rows[0] });
  } catch (error) {
    console.error(`Error fetching team with ID ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create or update multiple teams
router.post('/teams/batch', async (req, res) => {
  try {
    const { teams } = req.body;
    if (!teams || !Array.isArray(teams)) {
      return res.status(400).json({ success: false, error: 'Invalid teams data' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const team of teams) {
        const { id, name, shortName, color, logo } = team;
        if (id) {
          // Update existing team
          await connection.query(
            'UPDATE teams SET name = ?, shortName = ?, color = ?, logo = ? WHERE id = ?',
            [name, shortName, color, logo, id]
          );
        } else {
          // Insert new team
          await connection.query(
            'INSERT INTO teams (name, shortName, color, logo) VALUES (?, ?, ?, ?)',
            [name, shortName, color, logo]
          );
        }
      }

      await connection.commit();
      res.json({ success: true, message: `Successfully stored ${teams.length} teams` });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error storing teams:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all players
router.get('/players', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, t.name as teamName, t.shortName as teamShortName 
      FROM players p
      LEFT JOIN teams t ON p.teamId = t.id
    `);
    res.json({ success: true, players: rows });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get player by ID
router.get('/players/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, t.name as teamName, t.shortName as teamShortName 
      FROM players p
      LEFT JOIN teams t ON p.teamId = t.id
      WHERE p.id = ?
    `, [req.params.id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Player not found' });
    }
    
    res.json({ success: true, player: rows[0] });
  } catch (error) {
    console.error(`Error fetching player with ID ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get players by team
router.get('/players/team/:teamId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, t.name as teamName, t.shortName as teamShortName 
      FROM players p
      LEFT JOIN teams t ON p.teamId = t.id
      WHERE p.teamId = ?
    `, [req.params.teamId]);
    
    res.json({ success: true, players: rows });
  } catch (error) {
    console.error(`Error fetching players for team ${req.params.teamId}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create or update multiple players
router.post('/players/batch', async (req, res) => {
  try {
    const { players } = req.body;
    if (!players || !Array.isArray(players)) {
      return res.status(400).json({ success: false, error: 'Invalid players data' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const player of players) {
        const { id, name, teamId, role, battingStyle, bowlingStyle, nationality, age, isCaptain, image } = player;
        
        if (id) {
          // Update existing player
          await connection.query(
            `UPDATE players 
             SET name = ?, teamId = ?, role = ?, battingStyle = ?, bowlingStyle = ?, 
                 nationality = ?, age = ?, isCaptain = ?, image = ?
             WHERE id = ?`,
            [name, teamId, role, battingStyle, bowlingStyle, nationality, age, isCaptain, image, id]
          );
        } else {
          // Insert new player
          await connection.query(
            `INSERT INTO players 
             (name, teamId, role, battingStyle, bowlingStyle, nationality, age, isCaptain, image)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, teamId, role, battingStyle, bowlingStyle, nationality, age, isCaptain, image]
          );
        }
      }

      await connection.commit();
      res.json({ success: true, message: `Successfully stored ${players.length} players` });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error storing players:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all matches
router.get('/matches', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, 
             ht.name as homeTeamName, ht.shortName as homeTeamShortName,
             at.name as awayTeamName, at.shortName as awayTeamShortName
      FROM matches m
      LEFT JOIN teams ht ON m.homeTeamId = ht.id
      LEFT JOIN teams at ON m.awayTeamId = at.id
      ORDER BY m.date DESC
    `);
    
    res.json({ success: true, matches: rows });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get match by ID
router.get('/matches/:id', async (req, res) => {
  try {
    // First check if it's a numeric ID or a matchId string
    const isNumeric = /^\d+$/.test(req.params.id);
    let query;
    let params;
    
    if (isNumeric) {
      query = `
        SELECT m.*, 
               ht.name as homeTeamName, ht.shortName as homeTeamShortName, ht.color as homeTeamColor,
               at.name as awayTeamName, at.shortName as awayTeamShortName, at.color as awayTeamColor
        FROM matches m
        LEFT JOIN teams ht ON m.homeTeamId = ht.id
        LEFT JOIN teams at ON m.awayTeamId = at.id
        WHERE m.id = ?
      `;
      params = [req.params.id];
    } else {
      query = `
        SELECT m.*, 
               ht.name as homeTeamName, ht.shortName as homeTeamShortName, ht.color as homeTeamColor,
               at.name as awayTeamName, at.shortName as awayTeamShortName, at.color as awayTeamColor
        FROM matches m
        LEFT JOIN teams ht ON m.homeTeamId = ht.id
        LEFT JOIN teams at ON m.awayTeamId = at.id
        WHERE m.matchId = ?
      `;
      params = [req.params.id];
    }
    
    const [rows] = await pool.query(query, params);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }
    
    const match = rows[0];
    
    // Get innings data
    const [innings] = await pool.query(`
      SELECT i.*, t.name as teamName, t.shortName as teamShortName
      FROM innings i
      LEFT JOIN teams t ON i.teamId = t.id
      WHERE i.matchId = ?
      ORDER BY i.inningNumber
    `, [match.id]);
    
    // For each innings, get batting and bowling performances
    for (let i = 0; i < innings.length; i++) {
      const inning = innings[i];
      
      // Get batting performances
      const [battingPerformances] = await pool.query(`
        SELECT bp.*, p.name as playerName, p.teamId
        FROM batting_performances bp
        JOIN players p ON bp.playerId = p.id
        WHERE bp.inningId = ?
        ORDER BY bp.id
      `, [inning.id]);
      
      // Get bowling performances
      const [bowlingPerformances] = await pool.query(`
        SELECT bp.*, p.name as playerName, p.teamId
        FROM bowling_performances bp
        JOIN players p ON bp.playerId = p.id
        WHERE bp.inningId = ?
        ORDER BY bp.id
      `, [inning.id]);
      
      inning.batting = battingPerformances;
      inning.bowling = bowlingPerformances;
    }
    
    match.innings = innings;
    
    res.json({ success: true, match });
  } catch (error) {
    console.error(`Error fetching match with ID ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get matches by team
router.get('/matches/team/:teamId', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT m.*, 
             ht.name as homeTeamName, ht.shortName as homeTeamShortName,
             at.name as awayTeamName, at.shortName as awayTeamShortName
      FROM matches m
      LEFT JOIN teams ht ON m.homeTeamId = ht.id
      LEFT JOIN teams at ON m.awayTeamId = at.id
      WHERE m.homeTeamId = ? OR m.awayTeamId = ?
      ORDER BY m.date DESC
    `, [req.params.teamId, req.params.teamId]);
    
    res.json({ success: true, matches: rows });
  } catch (error) {
    console.error(`Error fetching matches for team ${req.params.teamId}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get match statistics
router.get('/matches/:id/stats', async (req, res) => {
  try {
    // First get the match
    const [matchRows] = await pool.query(`
      SELECT m.*, 
             ht.name as homeTeamName, ht.shortName as homeTeamShortName, ht.color as homeTeamColor,
             at.name as awayTeamName, at.shortName as awayTeamShortName, at.color as awayTeamColor
      FROM matches m
      LEFT JOIN teams ht ON m.homeTeamId = ht.id
      LEFT JOIN teams at ON m.awayTeamId = at.id
      WHERE m.id = ? OR m.matchId = ?
    `, [req.params.id, req.params.id]);
    
    if (matchRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }
    
    const match = matchRows[0];
    
    // Get innings data
    const [innings] = await pool.query(`
      SELECT i.*, t.name as teamName, t.shortName as teamShortName, t.color as teamColor
      FROM innings i
      LEFT JOIN teams t ON i.teamId = t.id
      WHERE i.matchId = ?
      ORDER BY i.inningNumber
    `, [match.id]);
    
    // For each innings, get batting and bowling performances
    for (let i = 0; i < innings.length; i++) {
      const inning = innings[i];
      
      // Get batting performances
      const [battingPerformances] = await pool.query(`
        SELECT bp.*, p.name as playerName, p.teamId, p.role
        FROM batting_performances bp
        JOIN players p ON bp.playerId = p.id
        WHERE bp.inningId = ?
        ORDER BY bp.id
      `, [inning.id]);
      
      // Get bowling performances
      const [bowlingPerformances] = await pool.query(`
        SELECT bp.*, p.name as playerName, p.teamId, p.role
        FROM bowling_performances bp
        JOIN players p ON bp.playerId = p.id
        WHERE bp.inningId = ?
        ORDER BY bp.id
      `, [inning.id]);
      
      inning.batting = battingPerformances;
      inning.bowling = bowlingPerformances;
    }
    
    // Get ball-by-ball data
    const [ballByBall] = await pool.query(`
      SELECT bbb.*, 
             batsman.name as batsmanName,
             bowler.name as bowlerName,
             dismissed.name as playerDismissedName
      FROM ball_by_ball bbb
      LEFT JOIN players batsman ON bbb.batsmanId = batsman.id
      LEFT JOIN players bowler ON bbb.bowlerId = bowler.id
      LEFT JOIN players dismissed ON bbb.player_dismissed_id = dismissed.id
      WHERE bbb.inningId IN (SELECT id FROM innings WHERE matchId = ?)
      ORDER BY bbb.inningId, bbb.over_number, bbb.ball_number
    `, [match.id]);
    
    // Group ball-by-ball data by innings
    const ballByBallByInnings = {};
    for (const ball of ballByBall) {
      if (!ballByBallByInnings[ball.inningId]) {
        ballByBallByInnings[ball.inningId] = [];
      }
      ballByBallByInnings[ball.inningId].push(ball);
    }
    
    // Add ball-by-ball data to each innings
    for (const inning of innings) {
      inning.ballByBall = ballByBallByInnings[inning.id] || [];
    }
    
    // Construct the stats object
    const stats = {
      match: {
        id: match.id,
        matchId: match.matchId,
        homeTeam: {
          id: match.homeTeamId,
          name: match.homeTeamName,
          shortName: match.homeTeamShortName,
          color: match.homeTeamColor
        },
        awayTeam: {
          id: match.awayTeamId,
          name: match.awayTeamName,
          shortName: match.awayTeamShortName,
          color: match.awayTeamColor
        },
        venue: match.venue,
        date: match.date,
        status: match.status,
        result: match.result
      },
      innings: innings
    };
    
    res.json({ success: true, stats });
  } catch (error) {
    console.error(`Error fetching stats for match ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get ball-by-ball data for a match
router.get('/matches/:id/ball-by-ball', async (req, res) => {
  try {
    // First get the match
    const [matchRows] = await pool.query(`
      SELECT id FROM matches WHERE id = ? OR matchId = ?
    `, [req.params.id, req.params.id]);
    
    if (matchRows.length === 0) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }
    
    const matchId = matchRows[0].id;
    
    // Get innings
    const [innings] = await pool.query(`
      SELECT i.*, t.name as teamName, t.shortName as teamShortName
      FROM innings i
      LEFT JOIN teams t ON i.teamId = t.id
      WHERE i.matchId = ?
      ORDER BY i.inningNumber
    `, [matchId]);
    
    // Get ball-by-ball data for each innings
    const ballByBall = {
      matchId,
      innings: []
    };
    
    for (const inning of innings) {
      const [balls] = await pool.query(`
        SELECT bbb.*, 
               batsman.name as batsmanName,
               bowler.name as bowlerName,
               dismissed.name as playerDismissedName
        FROM ball_by_ball bbb
        LEFT JOIN players batsman ON bbb.batsmanId = batsman.id
        LEFT JOIN players bowler ON bbb.bowlerId = bowler.id
        LEFT JOIN players dismissed ON bbb.player_dismissed_id = dismissed.id
        WHERE bbb.inningId = ?
        ORDER BY bbb.over_number, bbb.ball_number
      `, [inning.id]);
      
      ballByBall.innings.push({
        inningNumber: inning.inningNumber,
        teamName: inning.teamName,
        teamShortName: inning.teamShortName,
        runs: inning.runs,
        wickets: inning.wickets,
        overs: inning.overs,
        balls
      });
    }
    
    res.json({ success: true, ballByBall });
  } catch (error) {
    console.error(`Error fetching ball-by-ball data for match ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get database tables
router.get('/db-tables', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ?
    `, [process.env.DB_NAME || 'ipl_cricket_db']);
    
    const tables = rows.map(row => row.table_name);
    res.json({ success: true, tables });
  } catch (error) {
    console.error('Error fetching database tables:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get cricket series data
router.get('/cricket-series', async (req, res) => {
  try {
    // Use the CricAPI to fetch real series data
    const apiUrl = `${CRICAPI_BASE_URL}/series`;
    
    // Make a request to the CricAPI
    const response = await axiosClient.get(apiUrl, {
      params: {
        apikey: CRICAPI_KEY,
        offset: 0
      }
    });
    
    // Check if the API returned valid data
    if (response.data && response.data.status === 'success' && response.data.data) {
      // Transform the API response to match our frontend expectations
      const seriesData = response.data.data.map(series => ({
        id: series.id,
        name: series.name,
        // Determine status based on dates
        status: determineSeriesStatus(series.startDate, series.endDate),
        startDate: series.startDate,
        endDate: series.endDate,
        // Extract match counts directly from the API response
        t20: series.t20 || 0,
        odi: series.odi || 0,
        test: series.test || 0,
        matches: series.matches || 0,
        squads: series.squads || 0
      }));
      
      // Log API response info for debugging
      console.log(`Successfully fetched ${seriesData.length} series from CricAPI`);
      console.log(`API Info: Hits today: ${response.data.info.hitsToday}, Hits limit: ${response.data.info.hitsLimit}`);
      
      res.json({ success: true, series: seriesData });
    } else {
      throw new Error('Invalid response format from CricAPI');
    }
  } catch (error) {
    console.error('Error fetching series data from CricAPI:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch series data. Please try again later.' });
  }
});

// Get cricket series details by ID or slug
router.get('/cricket-series/:idOrSlug', async (req, res) => {
  try {
    const idOrSlug = req.params.idOrSlug;
    let seriesId = idOrSlug;
    
    console.log(`Received request for series with ID or slug: ${idOrSlug}`);
    
    // Check if this is a UUID (contains hyphens and is 36 chars long)
    const isUuid = idOrSlug.length === 36 && idOrSlug.split('-').length === 5;
    
    // If it's not a UUID, we need to find the series by slug
    if (!isUuid) {
      console.log(`Parameter ${idOrSlug} is not a UUID, treating as slug`);
      // First, try to find the series in our existing data
      try {
        // Fetch all series to find the one with the matching slug
        const allSeriesResponse = await axiosClient.get(`${CRICAPI_BASE_URL}/series`, {
          params: {
            apikey: CRICAPI_KEY,
            offset: 0
          }
        });
        
        if (allSeriesResponse.data && allSeriesResponse.data.status === 'success' && allSeriesResponse.data.data) {
          console.log(`Fetched ${allSeriesResponse.data.data.length} series to search for slug match`);
          
          // Find the series with a name that matches the slug
          const matchingSeries = allSeriesResponse.data.data.find(series => {
            const seriesSlug = series.name
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            
            const match = seriesSlug === idOrSlug;
            if (match) {
              console.log(`Found matching series: ${series.name} (ID: ${series.id})`);
            }
            return match;
          });
          
          if (matchingSeries) {
            seriesId = matchingSeries.id;
            console.log(`Using series ID ${seriesId} for slug ${idOrSlug}`);
          } else {
            // If we can't find a match, try a more flexible approach
            console.log(`No exact match found for slug ${idOrSlug}, trying partial match`);
            
            // Try to find a partial match
            const partialMatch = allSeriesResponse.data.data.find(series => {
              const seriesSlug = series.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
              
              return seriesSlug.includes(idOrSlug) || idOrSlug.includes(seriesSlug);
            });
            
            if (partialMatch) {
              seriesId = partialMatch.id;
              console.log(`Using partial match series ID ${seriesId} for slug ${idOrSlug}`);
            } else {
              // If we still can't find a match, return an error
              console.log(`No match found for slug ${idOrSlug}`);
              return res.status(404).json({ 
                success: false, 
                error: `No series found with slug: ${idOrSlug}`
              });
            }
          }
        } else {
          throw new Error('Invalid response format from CricAPI when searching for series by slug');
        }
      } catch (error) {
        console.error(`Error finding series by slug ${idOrSlug}:`, error);
        return res.status(500).json({ 
          success: false, 
          error: `Error finding series by slug: ${idOrSlug}`
        });
      }
    }
    
    // Use the CricAPI to fetch series info
    const apiUrl = `${CRICAPI_BASE_URL}/series_info`;
    
    console.log(`Making API request to ${apiUrl} with series ID: ${seriesId}`);
    console.log(`API URL: ${apiUrl}?apikey=${CRICAPI_KEY.substring(0, 5)}...&id=${seriesId}`);
    
    // Make a request to the CricAPI
    try {
      const response = await axiosClient.get(apiUrl, {
        params: {
          apikey: CRICAPI_KEY,
          id: seriesId
        }
      });
      
      console.log('CricAPI Response Status:', response.status);
      console.log('CricAPI Response Data Type:', typeof response.data);
      console.log('CricAPI Response Data Keys:', Object.keys(response.data));
      
      // Check if the API returned valid data
      if (response.data && response.data.data) {
        const seriesData = response.data.data;
        
        // Transform the API response to match our frontend expectations
        const formattedSeries = {
          id: seriesData.id,
          name: seriesData.name,
          startDate: seriesData.startDate,
          endDate: seriesData.endDate,
          t20: seriesData.t20 || 0,
          odi: seriesData.odi || 0,
          test: seriesData.test || 0,
          matches: seriesData.matchList || [],
          squads: seriesData.squads || [],
          pointsTable: seriesData.points_table || []
        };
        
        // Fix endDate format if it's not in YYYY-MM-DD format
        if (formattedSeries.endDate && !formattedSeries.endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          console.log(`Fixing non-standard endDate format: ${formattedSeries.endDate}`);
          
          // Try to parse the date
          const currentYear = new Date().getFullYear();
          
          // Handle "Month Day" format (e.g., "May 25")
          const monthDayMatch = formattedSeries.endDate.match(/([A-Za-z]+)\s+(\d+)/);
          if (monthDayMatch) {
            const month = monthDayMatch[1];
            const day = monthDayMatch[2];
            
            // Convert month name to month number
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            const monthIndex = monthNames.findIndex(m => m.toLowerCase().startsWith(month.toLowerCase()));
            
            if (monthIndex !== -1) {
              // JavaScript months are 0-indexed, so add 1
              const monthNumber = monthIndex + 1;
              // Format with leading zeros
              const formattedMonth = monthNumber.toString().padStart(2, '0');
              const formattedDay = day.toString().padStart(2, '0');
              
              // Use the same year as startDate if available, otherwise use current year
              let year = currentYear;
              if (formattedSeries.startDate && formattedSeries.startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                year = formattedSeries.startDate.split('-')[0];
              }
              
              formattedSeries.endDate = `${year}-${formattedMonth}-${formattedDay}`;
              console.log(`Converted endDate to: ${formattedSeries.endDate}`);
            }
          }
        }
        
        // Log the dates we're using from the API
        console.log(`Using dates from API - startDate: ${formattedSeries.startDate}, endDate: ${formattedSeries.endDate}`);
        
        // Determine status based on dates
        formattedSeries.status = determineSeriesStatus(formattedSeries.startDate, formattedSeries.endDate);
        
        // Add teams if available
        if (seriesData.teams && Array.isArray(seriesData.teams)) {
          formattedSeries.teams = seriesData.teams;
        }
        
        // Log API response info for debugging
        console.log(`Successfully fetched series details for ID: ${seriesId} from CricAPI`);
        if (response.data.info) {
          console.log(`API Info: Hits today: ${response.data.info.hitsToday}, Hits limit: ${response.data.info.hitsLimit}`);
        }
        
        res.json({ success: true, series: formattedSeries });
      } else {
        throw new Error('Invalid response format from CricAPI');
      }
    } catch (error) {
      console.error(`Error fetching series details from CricAPI: ${error.message}`);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch series details from API. Please try again later.' 
      });
    }
  } catch (error) {
    console.error(`Error processing series request for ID: ${req.params.idOrSlug}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch series details. Please try again later.' });
  }
});

// Get matches for a specific cricket series by ID or slug
router.get('/cricket-series/:idOrSlug/matches', async (req, res) => {
  try {
    const idOrSlug = req.params.idOrSlug;
    let seriesId = idOrSlug;
    
    console.log(`Received request for matches of series with ID or slug: ${idOrSlug}`);
    
    // Check if this is a UUID (contains hyphens and is 36 chars long)
    const isUuid = idOrSlug.length === 36 && idOrSlug.split('-').length === 5;
    
    // If it's not a UUID, we need to find the series by slug
    if (!isUuid) {
      console.log(`Parameter ${idOrSlug} is not a UUID, treating as slug`);
      // First, try to find the series in our existing data
      try {
        // Fetch all series to find the one with the matching slug
        const allSeriesResponse = await axiosClient.get(`${CRICAPI_BASE_URL}/series`, {
          params: {
            apikey: CRICAPI_KEY,
            offset: 0
          }
        });
        
        if (allSeriesResponse.data && allSeriesResponse.data.status === 'success' && allSeriesResponse.data.data) {
          console.log(`Fetched ${allSeriesResponse.data.data.length} series to search for slug match`);
          
          // Find the series with a name that matches the slug
          const matchingSeries = allSeriesResponse.data.data.find(series => {
            const seriesSlug = series.name
              .toLowerCase()
              .replace(/[^\w\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-');
            
            const match = seriesSlug === idOrSlug;
            if (match) {
              console.log(`Found matching series: ${series.name} (ID: ${series.id})`);
            }
            return match;
          });
          
          if (matchingSeries) {
            seriesId = matchingSeries.id;
            console.log(`Using series ID ${seriesId} for slug ${idOrSlug}`);
          } else {
            // If we can't find a match, try a more flexible approach
            console.log(`No exact match found for slug ${idOrSlug}, trying partial match`);
            
            // Try to find a partial match
            const partialMatch = allSeriesResponse.data.data.find(series => {
              const seriesSlug = series.name
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
              
              return seriesSlug.includes(idOrSlug) || idOrSlug.includes(seriesSlug);
            });
            
            if (partialMatch) {
              seriesId = partialMatch.id;
              console.log(`Using partial match series ID ${seriesId} for slug ${idOrSlug}`);
            } else {
              // If we still can't find a match, return an error
              console.log(`No match found for slug ${idOrSlug}`);
              return res.status(404).json({ 
                success: false, 
                error: `No series found with slug: ${idOrSlug}`
              });
            }
          }
        } else {
          throw new Error('Invalid response format from CricAPI when searching for series by slug');
        }
      } catch (error) {
        console.error(`Error finding series by slug ${idOrSlug}:`, error);
        return res.status(500).json({ 
          success: false, 
          error: `Error finding series by slug: ${idOrSlug}`
        });
      }
    }
    
    try {
      // Use the CricAPI to fetch series info which includes matches
      const apiUrl = `${CRICAPI_BASE_URL}/series_info`;
      
      console.log(`Making API request to ${apiUrl} with series ID: ${seriesId}`);
      console.log(`API URL: ${apiUrl}?apikey=${CRICAPI_KEY.substring(0, 5)}...&id=${seriesId}`);
      
      // Make a request to the CricAPI
      const response = await axiosClient.get(apiUrl, {
        params: {
          apikey: CRICAPI_KEY,
          id: seriesId
        }
      });
      
      console.log('CricAPI Response Status:', response.status);
      console.log('CricAPI Response Data Type:', typeof response.data);
      console.log('CricAPI Response Data Keys:', Object.keys(response.data));
      
      // Check if the API returned valid data
      if (response.data && response.data.data && response.data.data.length > 0) {
        const seriesData = response.data.data;
        
        // Extract and format matches
        let matches = [];
        
        // Check different possible property names for match data
        const matchData = seriesData.matchList || seriesData.matches || [];
        
        if (Array.isArray(matchData) && matchData.length > 0) {
          console.log(`Found ${matchData.length} matches in API response`);
          matches = matchData.map(match => ({
            id: match.id,
            name: match.name || `${match.teams?.[0] || 'Team A'} vs ${match.teams?.[1] || 'Team B'}`,
            status: match.status || 'upcoming',
            venue: match.venue || 'TBD',
            date: match.date || match.dateTimeGMT,
            dateTimeGMT: match.dateTimeGMT || match.date,
            teams: match.teams || [],
            teamInfo: match.teamInfo || [],
            score: match.score || []
          }));
        } else {
          console.log('No match data found in API response');
          return res.json({ 
            success: true, 
            matches: [],
            message: 'No matches found for this series'
          });
        }
        
        // Log API response info for debugging
        console.log(`Successfully fetched ${matches.length} matches for series ID: ${seriesId} from CricAPI`);
        if (response.data.info) {
          console.log(`API Info: Hits today: ${response.data.info.hitsToday}, Hits limit: ${response.data.info.hitsLimit}`);
        }
        
        res.json({ success: true, matches });
      } else {
        throw new Error('Invalid response format from CricAPI');
      }
    } catch (error) {
      console.error(`Error fetching matches from CricAPI: ${error.message}`);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch matches from API. Please try again later.'
      });
    }
  } catch (error) {
    console.error(`Error fetching matches for series ID: ${req.params.idOrSlug}:`, error);
    res.status(500).json({ success: false, error: 'Failed to fetch series matches. Please try again later.' });
  }
});

// Helper function to generate mock matches for a series
const generateMockMatchesForSeries = (seriesSlug, count = 10) => {
  const teams = [
    'Mumbai Indians', 
    'Chennai Super Kings', 
    'Royal Challengers Bangalore', 
    'Kolkata Knight Riders', 
    'Delhi Capitals', 
    'Punjab Kings', 
    'Rajasthan Royals', 
    'Sunrisers Hyderabad', 
    'Gujarat Titans', 
    'Lucknow Super Giants'
  ];
  
  const venues = [
    'Wankhede Stadium, Mumbai',
    'M. A. Chidambaram Stadium, Chennai',
    'M. Chinnaswamy Stadium, Bangalore',
    'Eden Gardens, Kolkata',
    'Arun Jaitley Stadium, Delhi',
    'Punjab Cricket Association Stadium, Mohali',
    'Sawai Mansingh Stadium, Jaipur',
    'Rajiv Gandhi International Cricket Stadium, Hyderabad',
    'Narendra Modi Stadium, Ahmedabad',
    'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow'
  ];
  
  const matches = [];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    // Randomly select two different teams
    const teamIndices = getRandomPair(0, teams.length - 1);
    const team1 = teams[teamIndices[0]];
    const team2 = teams[teamIndices[1]];
    
    // Randomly select a venue
    const venue = venues[Math.floor(Math.random() * venues.length)];
    
    // Generate a date (some in the past, some in the future)
    const matchDate = new Date(today);
    matchDate.setDate(today.getDate() + (i - Math.floor(count / 2)));
    
    // Determine match status based on date
    let status;
    let score1 = '';
    let score2 = '';
    
    if (matchDate < today) {
      // Past match - completed
      status = 'completed';
      score1 = `${Math.floor(Math.random() * 200) + 100}/${Math.floor(Math.random() * 10)}`;
      score2 = `${Math.floor(Math.random() * 200) + 100}/${Math.floor(Math.random() * 10)}`;
    } else if (matchDate.getDate() === today.getDate()) {
      // Today's match - live
      status = 'live';
      score1 = `${Math.floor(Math.random() * 150) + 50}/${Math.floor(Math.random() * 5)}`;
      score2 = '';
    } else {
      // Future match - upcoming
      status = 'upcoming';
    }
    
    // Create the match object
    const match = {
      id: `mock-match-${seriesSlug}-${i}`,
      name: `${team1} vs ${team2}`,
      status,
      venue,
      date: matchDate.toISOString().split('T')[0],
      dateTimeGMT: matchDate.toISOString(),
      teams: [team1, team2],
      teamInfo: [
        { name: team1, shortname: team1.split(' ').map(word => word[0]).join('') },
        { name: team2, shortname: team2.split(' ').map(word => word[0]).join('') }
      ],
      score: [
        { r: score1, w: score1.split('/')[1] || '0', o: Math.floor(Math.random() * 20), inning: '1' },
        { r: score2, w: score2.split('/')[1] || '0', o: Math.floor(Math.random() * 20), inning: '2' }
      ].filter(s => s.r !== '')
    };
    
    matches.push(match);
  }
  
  return matches;
};

// Helper function to get a random pair of indices
const getRandomPair = (min, max) => {
  const first = Math.floor(Math.random() * (max - min + 1)) + min;
  let second;
  do {
    second = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (second === first);
  
  return [first, second];
};

// Helper function to determine match status category
function determineMatchStatusCategory(status, matchDate) {
  if (!status) return 'upcoming';
  
  const statusLower = status.toLowerCase();
  const matchDateTime = new Date(matchDate);
  const now = new Date();
  
  if (statusLower.includes('scheduled') || statusLower.includes('toss')) {
    return matchDateTime > now ? 'upcoming' : 'live';
  } else if (statusLower.includes('started') || statusLower.includes('innings') || statusLower.includes('break')) {
    return 'live';
  } else if (statusLower.includes('complete') || statusLower.includes('finished') || statusLower.includes('won')) {
    return 'completed';
  } else {
    return 'upcoming';
  }
}

// Helper function to determine series status based on dates
function determineSeriesStatus(startDate, endDate) {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (now < start) {
    return 'upcoming';
  } else if (now > end) {
    return 'completed';
  } else {
    return 'ongoing';
  }
}

// IPL 2025 Points Table Data
const IPL_TEAMS = [
  { id: 1, code: 'CSK', name: 'Chennai Super Kings' },
  { id: 2, code: 'DC', name: 'Delhi Capitals' },
  { id: 3, code: 'GT', name: 'Gujarat Titans' },
  { id: 4, code: 'KKR', name: 'Kolkata Knight Riders' },
  { id: 5, code: 'LSG', name: 'Lucknow Super Giants' },
  { id: 6, code: 'MI', name: 'Mumbai Indians' },
  { id: 7, code: 'PBKS', name: 'Punjab Kings' },
  { id: 8, code: 'RCB', name: 'Royal Challengers Bengaluru' },
  { id: 9, code: 'RR', name: 'Rajasthan Royals' },
  { id: 10, code: 'SRH', name: 'Sunrisers Hyderabad' }
];

// Function to fetch IPL 2025 points table data
async function fetchIPL2025PointsTable() {
  try {
    // First try to get data from CricAPI
    try {
      console.log('Fetching IPL 2025 points table from CricAPI...');
      console.log(`API URL: ${CRICAPI_BASE_URL}/series_points?apikey=${CRICAPI_KEY.substring(0, 5)}...&id=${IPL_SERIES_ID}`);
      
      const apiUrl = `${CRICAPI_BASE_URL}/series_points`;
      const response = await axiosClient.get(apiUrl, {
        params: {
          apikey: CRICAPI_KEY,
          id: IPL_SERIES_ID
        }
      });
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      throw new Error('Invalid API response format');
    } catch (error) {
      console.error('Error fetching from CricAPI:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error in fetchIPL2025PointsTable:', error);
    throw error;
  }
}

// Helper function to generate mock points table data
function generateMockPointsTable() {
  // Create realistic data with some teams having played more matches than others
  const teamData = [
    { code: 'CSK', name: 'Chennai Super Kings', matches: 6, won: 5, lost: 1, draw: 0, nrr: '+1.256' },
    { code: 'KKR', name: 'Kolkata Knight Riders', matches: 5, won: 4, lost: 1, draw: 0, nrr: '+1.688' },
    { code: 'RR', name: 'Rajasthan Royals', matches: 5, won: 4, lost: 1, draw: 0, nrr: '+0.866' },
    { code: 'GT', name: 'Gujarat Titans', matches: 5, won: 3, lost: 2, draw: 0, nrr: '+0.325' },
    { code: 'DC', name: 'Delhi Capitals', matches: 6, won: 3, lost: 3, draw: 0, nrr: '+0.089' },
    { code: 'SRH', name: 'Sunrisers Hyderabad', matches: 6, won: 3, lost: 3, draw: 0, nrr: '+0.211' },
    { code: 'LSG', name: 'Lucknow Super Giants', matches: 6, won: 3, lost: 3, draw: 0, nrr: '-0.234' },
    { code: 'PBKS', name: 'Punjab Kings', matches: 5, won: 2, lost: 3, draw: 0, nrr: '-0.196' },
    { code: 'MI', name: 'Mumbai Indians', matches: 6, won: 2, lost: 4, draw: 0, nrr: '-0.457' },
    { code: 'RCB', name: 'Royal Challengers Bengaluru', matches: 6, won: 2, lost: 4, draw: 0, nrr: '-0.394' }
  ];
  
  // Sort by points and then by NRR
  const sortedTeams = [...teamData].sort((a, b) => {
    const aPoints = a.won * 2;
    const bPoints = b.won * 2;
    
    // First sort by points (descending)
    if (bPoints !== aPoints) {
      return bPoints - aPoints;
    }
    
    // Then by NRR (descending)
    const aNRR = parseFloat(a.nrr.replace('+', ''));
    const bNRR = parseFloat(b.nrr.replace('+', ''));
    return bNRR - aNRR;
  });
  
  return sortedTeams.map(team => ({
    team: team.code,
    teamName: team.name,
    matches: team.matches,
    won: team.won,
    lost: team.lost,
    draw: team.draw,
    points: team.won * 2, // 2 points per win
    nrr: team.nrr,
    icon: `/team-logos/${team.code.toLowerCase()}.png`, // Update the image path
    lastUpdated: new Date().toISOString()
  }));
}

// Helper function to update database with API data
async function updateDatabaseWithApiData(pointsTable) {
  // First, ensure tables exist
  await ensureTablesExist();
  
  // Update each team's data in the database
  for (const teamData of pointsTable) {
    // Find the team ID
    const team = IPL_TEAMS.find(t => t.code === teamData.team);
    if (!team) continue;
    
    // Update or insert the team data
    await pool.query(
      'INSERT INTO points_table (team_id, series_id, matches_played, wins, losses, draws, points, net_run_rate, last_updated) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW()) ' +
      'ON DUPLICATE KEY UPDATE ' +
      'matches_played = VALUES(matches_played), ' +
      'wins = VALUES(wins), ' +
      'losses = VALUES(losses), ' +
      'draws = VALUES(draws), ' +
      'points = VALUES(points), ' +
      'net_run_rate = VALUES(net_run_rate), ' +
      'last_updated = NOW()',
      [
        team.id,
        'indian-premier-league-2025',
        teamData.matches,
        teamData.won,
        teamData.lost,
        teamData.draw,
        teamData.points,
        parseFloat(teamData.nrr)
      ]
    );
  }
  
  console.log('Database updated with points table data from API');
}

// Function to ensure required tables exist
async function ensureTablesExist() {
  try {
    // Create points_table if it doesn't exist
    await pool.query(`
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
        UNIQUE KEY series_team_idx (series_id, team_id)
      )
    `);
    
    // Check if teams table has data
    const [teamsResult] = await pool.query('SELECT * FROM teams LIMIT 10');
    
    if (teamsResult.length === 0) {
      // Insert IPL teams if teams table is empty
      for (const team of IPL_TEAMS) {
        await pool.query(
          'INSERT IGNORE INTO teams (id, name, code) VALUES (?, ?, ?)',
          [team.id, team.name, team.code]
        );
      }
      console.log('Added IPL teams to teams table');
    }
    
    return true;
  } catch (error) {
    console.error('Error ensuring tables exist:', error);
    return false;
  }
}

// Function to update IPL 2025 points table based on match results
async function updateIPL2025PointsTable() {
  try {
    console.log('Starting update of IPL 2025 points table...');
    
    // Fetch fresh data from CricAPI
    try {
      console.log('Fetching IPL 2025 points table from CricAPI...');
      console.log(`API URL: ${CRICAPI_BASE_URL}/series_points?apikey=${CRICAPI_KEY.substring(0, 5)}...&id=${IPL_SERIES_ID}`);
      
      const apiUrl = `${CRICAPI_BASE_URL}/series_points`;
      const response = await axiosClient.get(apiUrl, {
        params: {
          apikey: CRICAPI_KEY,
          id: IPL_SERIES_ID
        }
      });

      console.log('API Response:', JSON.stringify(response.data, null, 2));

      if (response.data && response.data.data) {
        console.log('Successfully fetched updated points table from CricAPI');
        
        // Transform API data to our format
        const pointsTable = response.data.data.map(team => {
          // Calculate points (2 per win)
          const points = team.wins * 2;
          
          return {
            team: team.shortname,
            teamName: team.teamname,
            matches: team.matches,
            won: team.wins,
            lost: team.loss,
            draw: team.ties,
            points: points,
            nrr: '0.000', // API doesn't provide NRR
            lastUpdated: new Date().toISOString()
          };
        });
        
        // Update database with this data
        await updateDatabaseWithApiData(pointsTable);
        
        return true;
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (apiError) {
      console.error('Error fetching from CricAPI for update, using fallback:', apiError.message);
      
      // Try to get data from database as fallback
      try {
        console.log('Falling back to database for points table...');
        const [rows] = await pool.query(
          'SELECT p.*, t.code as team_code, t.name as team_name FROM points_table p ' +
          'JOIN teams t ON p.team_id = t.id ' +
          'WHERE p.series_id = ? ' +
          'ORDER BY p.points DESC, p.net_run_rate DESC',
          ['indian-premier-league-2025']
        );

        if (rows && rows.length > 0) {
          console.log('Found IPL 2025 points table in database with', rows.length, 'teams');
          return rows.map(row => ({
            team: row.team_code,
            teamName: row.team_name,
            matches: row.matches_played,
            won: row.wins,
            lost: row.losses,
            draw: row.draws,
            points: row.points,
            nrr: row.net_run_rate.toFixed(3),
            lastUpdated: row.last_updated
          }));
        } else {
          throw new Error('No points table data found in database');
        }
      } catch (dbError) {
        console.log('Database error or no data, using mock data:', dbError.message);
        // Return mock data as final fallback
        return generateMockPointsTable();
      }
    }
  } catch (error) {
    console.error('Error updating IPL 2025 points table:', error);
    return false;
  }
}

// Endpoint for IPL 2025 points table
router.get('/series/indian-premier-league-2025/points', async (req, res) => {
  try {
    const pointsTable = await fetchIPL2025PointsTable();
    
    // Sort the points table by points and then by NRR
    const sortedPointsTable = [...pointsTable].sort((a, b) => {
      // First sort by points (descending)
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      // Then by NRR (descending)
      const aNRR = parseFloat(a.nrr.replace('+', ''));
      const bNRR = parseFloat(b.nrr.replace('+', ''));
      return bNRR - aNRR;
    });
    
    res.json({
      success: true,
      series: {
        id: 'ipl-2025',
        name: 'Indian Premier League 2025',
        slug: 'indian-premier-league-2025',
        status: 'ongoing'
      },
      pointsTable: sortedPointsTable
    });
  } catch (error) {
    console.error('Error fetching IPL 2025 points table:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch points table',
      message: error.message
    });
  }
});

// Endpoint to manually trigger points table update
router.post('/series/indian-premier-league-2025/points/update', async (req, res) => {
  try {
    const updated = await updateIPL2025PointsTable();
    if (updated) {
      const pointsTable = await fetchIPL2025PointsTable();
      res.json({ 
        success: true, 
        message: 'Points table updated successfully',
        pointsTable
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update points table' 
      });
    }
  } catch (error) {
    console.error('Error updating IPL 2025 points table:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update points table',
      message: error.message
    });
  }
});

// Generic endpoint for series points table
router.get('/series/:seriesSlug/points', async (req, res) => {
  try {
    const { seriesSlug } = req.params;
    console.log(`Received request for points table for series: ${seriesSlug}`);
    
    // For IPL 2025, use database data first, then fall back to mock data
    if (seriesSlug === 'indian-premier-league-2025') {
      try {
        // Try to get data from database first
        console.log('Fetching IPL 2025 points table from database...');
        const [rows] = await pool.query(
          'SELECT p.*, t.code as team_code, t.name as team_name FROM points_table p ' +
          'JOIN teams t ON p.team_id = t.id ' +
          'WHERE p.series_id = ? ' +
          'ORDER BY p.points DESC, p.net_run_rate DESC',
          ['indian-premier-league-2025']
        );

        if (rows && rows.length > 0) {
          console.log(`Found IPL 2025 points table in database with ${rows.length} teams`);
          const pointsTable = rows.map(row => ({
            team: row.team_code,
            teamName: row.team_name,
            matches: row.matches_played,
            won: row.wins,
            lost: row.losses,
            draw: row.draws,
            points: row.points,
            nrr: row.net_run_rate.toFixed(3),
            lastUpdated: row.last_updated
          }));
          
          return res.json({
            success: true,
            series: {
              id: 'ipl-2025',
              name: 'Indian Premier League 2025',
              slug: 'indian-premier-league-2025',
              status: 'ongoing'
            },
            pointsTable: pointsTable
          });
        } else {
          console.log('No IPL 2025 points table found in database, using mock data');
        }
      } catch (dbError) {
        console.error('Database error fetching IPL 2025 points table:', dbError);
        console.log('Falling back to mock data due to database error');
      }
      
      // Fall back to mock data if database fetch fails
      const pointsTable = generateMockPointsTable();
      
      return res.json({
        success: true,
        series: {
          id: 'ipl-2025',
          name: 'Indian Premier League 2025',
          slug: 'indian-premier-league-2025',
          status: 'ongoing'
        },
        pointsTable: pointsTable
      });
    } else {
      // For other series, try to get from database
      try {
        const [rows] = await pool.query(
          'SELECT p.*, t.code as team_code, t.name as team_name FROM points_table p ' +
          'JOIN teams t ON p.team_id = t.id ' +
          'WHERE p.series_id = ? ' +
          'ORDER BY p.points DESC, p.net_run_rate DESC',
          [seriesSlug]
        );
        
        if (rows && rows.length > 0) {
          console.log(`Found points table for ${seriesSlug} in database with ${rows.length} teams`);
          const formattedTable = rows.map(row => ({
            team: row.team_code,
            teamName: row.team_name,
            matches: row.matches_played,
            won: row.wins,
            lost: row.losses,
            draw: row.draws,
            points: row.points,
            nrr: row.net_run_rate.toFixed(3),
            lastUpdated: row.last_updated
          }));
          
          res.json({
            success: true,
            pointsTable: formattedTable
          });
        } else {
          throw new Error('No points table data found in database');
        }
      } catch (dbError) {
        console.log('Database error or no data, using mock data:', dbError.message);
        // Return mock data as fallback
        res.json({
          success: true,
          pointsTable: generateMockPointsTable()
        });
      }
    }
  } catch (error) {
    console.error('Error fetching points table:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch points table',
      message: error.message
    });
  }
});

// Generic endpoint to update points table
router.post('/series/:seriesSlug/points/update', async (req, res) => {
  try {
    const { seriesSlug } = req.params;
    console.log(`Received request to update points table for series: ${seriesSlug}`);
    
    // For IPL 2025, use our dedicated update function
    if (seriesSlug === 'indian-premier-league-2025') {
      const updated = await updateIPL2025PointsTable();
      if (updated) {
        const pointsTable = await fetchIPL2025PointsTable();
        res.json({ 
          success: true, 
          message: 'Points table updated successfully',
          pointsTable
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: 'Failed to update points table' 
        });
      }
    } else {
      // For other series, we don't have update logic yet
      res.status(404).json({
        success: false,
        error: 'Update functionality not available for this series'
      });
    }
  } catch (error) {
    console.error(`Error updating points table for ${req.params.seriesSlug}:`, error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update points table',
      message: error.message
    });
  }
});

// Endpoint to fetch live points table data from CricAPI
router.get('/series/:seriesSlug/live-points', async (req, res) => {
  try {
    const { seriesSlug } = req.params;
    console.log(`Received request for live points table for series: ${seriesSlug}`);
    
    let seriesId = '';
    
    // Map series slug to CricAPI series ID
    if (seriesSlug === 'indian-premier-league-2025') {
      seriesId = IPL_SERIES_ID; // IPL 2025 series ID
    } else {
      // For other series, try to get the ID from database
      try {
        const [rows] = await pool.query(
          'SELECT cricapi_id FROM series WHERE slug = ?',
          [seriesSlug]
        );
        
        if (rows && rows.length > 0 && rows[0].cricapi_id) {
          seriesId = rows[0].cricapi_id;
        } else {
          return res.status(404).json({ 
            success: false, 
            error: 'Series not found or no CricAPI ID available' 
          });
        }
      } catch (error) {
        console.error('Database error fetching series ID:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch series ID from database' 
        });
      }
    }
    
    // Fetch points table from CricAPI
    try {
      const CRICAPI_BASE_URL = 'https://api.cricapi.com/v1';
      const CRICAPI_KEY = '1f2ad458-2220-4a94-888b-59b78221920b';
      
      const apiUrl = `${CRICAPI_BASE_URL}/series_points`;
      console.log(`Making API request to ${apiUrl} with series ID: ${seriesId}`);
      
      const response = await axios.get(apiUrl, {
        params: {
          apikey: CRICAPI_KEY,
          id: seriesId
        }
      });
      
      console.log('API Response:', JSON.stringify(response.data, null, 2));
      
      if (response.data && response.data.data) {
        console.log('Successfully fetched live points table from CricAPI');
        
        // Transform API data to our format
        const pointsTable = response.data.data.map(team => ({
          team: team.shortname,
          teamName: team.teamname,
          matches: team.matches,
          won: team.wins,
          lost: team.loss,
          draw: team.ties,
          points: team.wins * 2, // 2 points per win
          nrr: '0.000', // API doesn't provide NRR
          icon: team.img, // Use the image URL from CricAPI
          lastUpdated: new Date().toISOString()
        }));
        
        // Sort by points (descending)
        const sortedPointsTable = pointsTable.sort((a, b) => b.points - a.points);
        
        return res.json({
          success: true,
          series: {
            id: seriesId,
            name: seriesSlug === 'indian-premier-league-2025' ? 'Indian Premier League 2025' : seriesSlug,
            slug: seriesSlug,
            status: 'ongoing'
          },
          pointsTable: sortedPointsTable,
          source: 'cricapi'
        });
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (error) {
      console.error('Error fetching live points table from CricAPI:', error);
      // Fall back to mock data
      useMockData();
    }
    
    // Helper function to return mock data
    function useMockData() {
      console.log('Using mock data for live points table');
      const mockPointsTable = [
        { team: 'CSK', teamName: 'Chennai Super Kings', matches: 1, won: 1, lost: 0, draw: 0, points: 2, nrr: '+0.500', icon: 'https://g.cricapi.com/iapi/135-637852956181378533.png?w=48' },
        { team: 'DC', teamName: 'Delhi Capitals', matches: 1, won: 1, lost: 0, draw: 0, points: 2, nrr: '+0.400', icon: 'https://g.cricapi.com/iapi/148-637874596301457910.png?w=48' },
        { team: 'PBKS', teamName: 'Punjab Kings', matches: 1, won: 1, lost: 0, draw: 0, points: 2, nrr: '+0.300', icon: 'https://g.cricapi.com/iapi/247-637852956959778791.png?w=48' },
        { team: 'RCB', teamName: 'Royal Challengers Bengaluru', matches: 1, won: 1, lost: 0, draw: 0, points: 2, nrr: '+0.200', icon: 'https://g.cricapi.com/iapi/21439-638468478038395955.jpg?w=48' },
        { team: 'KKR', teamName: 'Kolkata Knight Riders', matches: 2, won: 1, lost: 1, draw: 0, points: 2, nrr: '+0.100', icon: 'https://g.cricapi.com/iapi/206-637852958714346149.png?w=48' },
        { team: 'LSG', teamName: 'Lucknow Super Giants', matches: 2, won: 1, lost: 1, draw: 0, points: 2, nrr: '+0.000', icon: 'https://g.cricapi.com/iapi/215-637876059669009476.png?w=48' },
        { team: 'SRH', teamName: 'Sunrisers Hyderabad', matches: 2, won: 1, lost: 1, draw: 0, points: 2, nrr: '-0.100', icon: 'https://g.cricapi.com/iapi/279-637852957609490368.png?w=48' },
        { team: 'GT', teamName: 'Gujarat Titans', matches: 1, won: 0, lost: 1, draw: 0, points: 0, nrr: '-0.200', icon: 'https://g.cricapi.com/iapi/172-637852957798476823.png?w=48' },
        { team: 'MI', teamName: 'Mumbai Indians', matches: 1, won: 0, lost: 1, draw: 0, points: 0, nrr: '-0.300', icon: 'https://g.cricapi.com/iapi/226-637852956375593901.png?w=48' },
        { team: 'RR', teamName: 'Rajasthan Royals', matches: 2, won: 0, lost: 2, draw: 0, points: 0, nrr: '-0.400', icon: 'https://g.cricapi.com/iapi/251-637852956607161886.png?w=48' }
      ];
      
      return res.json({
        success: true,
        series: {
          id: seriesId,
          name: seriesSlug === 'indian-premier-league-2025' || seriesSlug === 'ipl-2025' ? 'Indian Premier League 2025' : seriesSlug,
          slug: seriesSlug,
          status: 'ongoing'
        },
        pointsTable: mockPointsTable,
        source: 'mock' // Indicate this is mock data
      });
    }
  } catch (error) {
    console.error('Error processing live points table request:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process request',
      message: error.message
    });
  }
});

// Get cricket news
router.get('/news', async (req, res) => {
  try {
    console.log('Received request for cricket news');
    const offset = req.query.offset || 0;
    
    try {
      // Use the CricAPI to fetch news
      const apiUrl = `${CRICAPI_BASE_URL}/news`;
      
      console.log(`Making API request to ${apiUrl}`);
      
      // Make a request to the CricAPI
      const response = await axiosClient.get(apiUrl, {
        params: {
          apikey: CRICAPI_KEY,
          offset: offset
        }
      });
      
      console.log('API Response:', JSON.stringify(response.data, null, 2));
      
      // Check if the API returned valid data
      if (response.data && response.data.status === 'success' && response.data.data) {
        const newsData = response.data.data;
        
        // Log API response info for debugging
        console.log(`Successfully fetched ${newsData.length} news items from CricAPI`);
        if (response.data.info) {
          console.log(`API Info: Hits today: ${response.data.info.hitsToday}, Hits limit: ${response.data.info.hitsLimit}`);
        }
        
        res.json(response.data);
      } else {
        throw new Error('Invalid response format from CricAPI');
      }
    } catch (error) {
      console.error(`Error fetching news from CricAPI: ${error.message}`);
      
      // Generate mock news data as fallback
      const mockNews = [
        {
          id: 1,
          title: "IPL 2025: Mumbai Indians Secure Dramatic Win Against Chennai Super Kings",
          description: "In a thrilling encounter at Wankhede Stadium, Mumbai Indians defeated Chennai Super Kings by 5 runs in the last over.",
          published_at: new Date().toISOString(),
          urlToImage: "https://source.unsplash.com/random/300x200?cricket,1"
        },
        {
          id: 2,
          title: "Virat Kohli Breaks Record for Most Centuries in IPL History",
          description: "Royal Challengers Bangalore's star batsman Virat Kohli has surpassed the record for most centuries in IPL history with his 8th ton.",
          published_at: new Date().toISOString(),
          urlToImage: "https://source.unsplash.com/random/300x200?cricket,2"
        },
        {
          id: 3,
          title: "IPL 2025: New Talent Shines as Rajasthan Royals Dominate",
          description: "Young players are making their mark in IPL 2025, with Rajasthan Royals' new signings showing exceptional performance.",
          published_at: new Date().toISOString(),
          urlToImage: "https://source.unsplash.com/random/300x200?cricket,3"
        },
        {
          id: 4,
          title: "Delhi Capitals Sign International Fast Bowler as Replacement",
          description: "Delhi Capitals have announced the signing of an international fast bowler as a replacement for their injured player.",
          published_at: new Date().toISOString(),
          urlToImage: "https://source.unsplash.com/random/300x200?cricket,4"
        },
        {
          id: 5,
          title: "IPL Governing Council Announces Schedule Changes for Playoffs",
          description: "The IPL Governing Council has announced changes to the playoff schedule due to weather forecasts.",
          published_at: new Date().toISOString(),
          urlToImage: "https://source.unsplash.com/random/300x200?cricket,5"
        }
      ];
      
      // Return mock data with success status
      res.json({
        status: "success",
        data: mockNews,
        info: {
          hitsToday: 0,
          hitsLimit: 100,
          credits: 0,
          server: 2,
          offsetRows: 0,
          totalRows: mockNews.length,
          cache: 0,
          mock: true
        }
      });
    }
  } catch (error) {
    console.error(`Error processing news request:`, error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch news. Please try again later.' 
    });
  }
});

// Get today's IPL matches
router.get('/todays-ipl-match', async (req, res) => {
  try {
    console.log('API route: Received request for today\'s IPL match');
    
    // Try to fetch from database first (highest priority)
    try {
      console.log('Attempting to fetch today\'s IPL match from database');
      const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
      
      const [rows] = await pool.query(`
        SELECT m.*, 
               ht.name as homeTeamName, ht.shortName as homeTeamShortName, ht.logo as homeTeamLogo,
               at.name as awayTeamName, at.shortName as awayTeamShortName, at.logo as awayTeamLogo
        FROM matches m
        JOIN teams ht ON m.homeTeamId = ht.id
        JOIN teams at ON m.awayTeamId = at.id
        WHERE m.date = ? AND m.seriesId = ?
        ORDER BY m.date ASC
        LIMIT 1
      `, [today, IPL_SERIES_ID]);
      
      if (rows.length > 0) {
        console.log('Found today\'s IPL match in database:', rows[0]);
        return res.json({ 
          success: true, 
          match: rows[0],
          source: 'database'
        });
      } else {
        throw new Error('No match found in database for today');
      }
    } catch (dbError) {
      console.error('Database error or no match found:', dbError.message);
      
      // Try to fetch from CricAPI as second priority
      try {
        console.log('Attempting to fetch today\'s IPL match from CricAPI');
        const apiUrl = `${CRICAPI_BASE_URL}/matches`;
        
        const response = await axiosClient.get(apiUrl, {
          params: {
            apikey: CRICAPI_KEY,
            offset: 0,
            series_id: IPL_SERIES_ID
          }
        });
        
        console.log('CricAPI Response:', JSON.stringify(response.data, null, 2));
        
        if (response.data && response.data.data) {
          const matches = response.data.data;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          // Find a match scheduled for today
          const todayMatch = matches.find(match => {
            const matchDate = new Date(match.date);
            matchDate.setHours(0, 0, 0, 0);
            return matchDate.getTime() === today.getTime();
          });
          
          if (todayMatch) {
            console.log('Found today\'s IPL match in CricAPI:', todayMatch);
            
            // Transform to match our format
            const formattedMatch = {
              id: todayMatch.id,
              matchId: todayMatch.id,
              date: todayMatch.date,
              venue: todayMatch.venue,
              status: todayMatch.status,
              homeTeamName: todayMatch.teams[0],
              homeTeamShortName: todayMatch.teamInfo[0].shortname,
              homeTeamLogo: todayMatch.teamInfo[0].img,
              awayTeamName: todayMatch.teams[1],
              awayTeamShortName: todayMatch.teamInfo[1].shortname,
              awayTeamLogo: todayMatch.teamInfo[1].img,
              result: todayMatch.status,
              seriesId: IPL_SERIES_ID
            };
            
            return res.json({ 
              success: true, 
              match: formattedMatch,
              source: 'cricapi'
            });
          } else {
            throw new Error('No match found in CricAPI for today');
          }
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (apiError) {
        console.error('API error:', apiError.message);
        
        // Use mock data as last resort
        console.log('Using mock data for today\'s IPL match');
        const mockMatch = {
          id: 12345,
          matchId: 'IPL2025-M23',
          date: new Date().toISOString(),
          venue: 'M. Chinnaswamy Stadium, Bengaluru',
          status: 'Upcoming',
          homeTeamName: 'Royal Challengers Bengaluru',
          homeTeamShortName: 'RCB',
          homeTeamLogo: '/team-logos/rcb.png',
          awayTeamName: 'Chennai Super Kings',
          awayTeamShortName: 'CSK',
          awayTeamLogo: '/team-logos/csk.png',
          result: 'Match starts at 19:30 IST',
          seriesId: IPL_SERIES_ID
        };
        
        res.json({ 
          success: true, 
          match: mockMatch,
          source: 'mock'
        });
      }
    }
  } catch (error) {
    console.error('Error processing today\'s IPL match request:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch today\'s IPL match. Please try again later.' 
    });
  }
});

// Function to fetch points table from CricAPI
async function fetchPointsTableFromAPI() {
  try {
    const apiUrl = `${CRICAPI_BASE_URL}/series_points`;
    console.log('Fetching points table from CricAPI:', apiUrl);
    
    const response = await axiosClient.get(apiUrl, {
      params: {
        apikey: CRICAPI_KEY,
        id: IPL_SERIES_ID
      }
    });

    console.log('API Response:', JSON.stringify(response.data, null, 2));

    if (response.data && response.data.data) {
      return response.data.data;
    }
    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching points table from API:', error);
    throw error;
  }
}

// Function to save points table to database
async function savePointsTableToDatabase(pointsTable) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Update points table
    await connection.query('DELETE FROM points_table WHERE series_id = ?', [IPL_SERIES_ID]);
    
    for (const team of pointsTable) {
      await connection.query(
        'INSERT INTO points_table (series_id, teamname, shortname, img, matches, wins, loss, ties, nr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [IPL_SERIES_ID, team.teamname, team.shortname, team.img, team.matches, team.wins, team.loss, team.ties, team.nr]
      );
    }

    // Update last update time
    await connection.query(
      'INSERT INTO points_table_updates (series_id, last_update) VALUES (?, NOW()) ON DUPLICATE KEY UPDATE last_update = NOW()',
      [IPL_SERIES_ID]
    );

    await connection.commit();
    console.log('Points table saved to database successfully');
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Function to get points table from database
async function getPointsTableFromDatabase() {
  try {
    const [rows] = await pool.query(
      'SELECT teamname, shortname, img, matches, wins, loss, ties, nr FROM points_table WHERE series_id = ? ORDER BY wins DESC, (wins/matches) DESC',
      [IPL_SERIES_ID]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching points table from database:', error);
    throw error;
  }
}

// Function to get last update time from database
async function getLastPointsTableUpdate() {
  try {
    const [rows] = await pool.query(
      'SELECT last_update FROM points_table_updates WHERE series_id = ? ORDER BY last_update DESC LIMIT 1',
      [IPL_SERIES_ID]
    );
    return rows[0]?.last_update;
  } catch (error) {
    console.error('Error fetching last update time:', error);
    return null;
  }
}

// Function to check if points table needs update (once per day)
async function needsPointsTableUpdate() {
  const lastUpdate = await getLastPointsTableUpdate();
  if (!lastUpdate) return true;

  const now = new Date();
  const lastUpdateDate = new Date(lastUpdate);
  const hoursSinceUpdate = (now - lastUpdateDate) / (1000 * 60 * 60);
  
  // Update if more than 24 hours have passed
  return hoursSinceUpdate >= 24;
}

// Function to ensure required tables exist
async function ensurePointsTableExists() {
  const connection = await pool.getConnection();
  try {
    // Create points_table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS points_table (
        id INT AUTO_INCREMENT PRIMARY KEY,
        series_id VARCHAR(255) NOT NULL,
        teamname VARCHAR(255) NOT NULL,
        shortname VARCHAR(10) NOT NULL,
        img VARCHAR(255),
        matches INT DEFAULT 0,
        wins INT DEFAULT 0,
        loss INT DEFAULT 0,
        ties INT DEFAULT 0,
        nr INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (series_id)
      )
    `);

    // Create points_table_updates if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS points_table_updates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        series_id VARCHAR(255) NOT NULL UNIQUE,
        last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (series_id)
      )
    `);
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  } finally {
    connection.release();
  }
}

// Main function to update points table if needed
async function updatePointsTableIfNeeded() {
  try {
    await ensurePointsTableExists();
    
    if (await needsPointsTableUpdate()) {
      console.log('Points table needs update, fetching from API...');
      const pointsTable = await fetchPointsTableFromAPI();
      await savePointsTableToDatabase(pointsTable);
      console.log('Points table updated successfully');
      return true;
    } else {
      console.log('Points table is up to date, no need to fetch from API');
      return false;
    }
  } catch (error) {
    console.error('Error updating points table:', error);
    return false;
  }
}

// Endpoint for IPL 2025 points table
router.get('/series/indian-premier-league-2025/points', async (req, res) => {
  try {
    console.log('Received request for IPL 2025 points table');
    
    // Check if we need to update the points table
    const forceUpdate = req.query.force === 'true';
    if (forceUpdate) {
      console.log('Force update requested, fetching from API...');
      const pointsTable = await fetchPointsTableFromAPI();
      await savePointsTableToDatabase(pointsTable);
    } else {
      // Update points table if needed (once per day)
      await updatePointsTableIfNeeded();
    }
    
    // Get the latest data from database
    const pointsTableData = await getPointsTableFromDatabase();
    const lastUpdate = await getLastPointsTableUpdate();
    
    if (pointsTableData && pointsTableData.length > 0) {
      // Transform database data to match our format
      const formattedPointsTable = pointsTableData.map(team => ({
        team: team.shortname,
        teamName: team.teamname,
        matches: team.matches,
        won: team.wins,
        lost: team.loss,
        draw: team.ties,
        points: team.wins * 2, // 2 points per win
        nrr: '0.000', // API doesn't provide NRR
        icon: team.img
      }));

      res.json({
        success: true,
        pointsTable: formattedPointsTable,
        series: {
          name: 'Indian Premier League 2025',
          slug: 'indian-premier-league-2025'
        },
        lastUpdated: lastUpdate || new Date().toISOString(),
        source: 'database'
      });
    } else {
      // If no data in database, fetch from API as fallback
      console.log('No data in database, fetching from API as fallback...');
      const pointsTable = await fetchPointsTableFromAPI();
      await savePointsTableToDatabase(pointsTable);
      
      // Transform API data to match our format
      const formattedPointsTable = pointsTable.map(team => ({
        team: team.shortname,
        teamName: team.teamname,
        matches: team.matches,
        won: team.wins,
        lost: team.loss,
        draw: team.ties,
        points: team.wins * 2, // 2 points per win
        nrr: '0.000', // API doesn't provide NRR
        icon: team.img
      }));

      res.json({
        success: true,
        pointsTable: formattedPointsTable,
        series: {
          name: 'Indian Premier League 2025',
          slug: 'indian-premier-league-2025'
        },
        lastUpdated: new Date().toISOString(),
        source: 'api'
      });
    }
  } catch (error) {
    console.error('Error fetching points table:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch points table',
      details: error.message
    });
  }
});

// Function to handle API errors
const handleApiError = (error, res) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: error.message
  });
};

module.exports = router;
