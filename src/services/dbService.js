/**
 * Database service for Crichattric application
 * Handles storing and retrieving data from IndexedDB
 */

// Database configuration
const DB_NAME = 'crictrick_db';
const DB_VERSION = 1;
const STORES = {
  MATCHES: 'matches',
  TEAMS: 'teams',
  PLAYERS: 'players'
};

/**
 * Initialize the database
 * @returns {Promise<IDBDatabase>} - IndexedDB database instance
 */
const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    // Handle database upgrade (called when DB is created or version changes)
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(STORES.MATCHES)) {
        const matchesStore = db.createObjectStore(STORES.MATCHES, { keyPath: 'id' });
        matchesStore.createIndex('by_date', 'date', { unique: false });
        // Create separate indexes for home and away teams instead of a multi-entry index
        matchesStore.createIndex('by_home_team', 'homeTeamId', { unique: false });
        matchesStore.createIndex('by_away_team', 'awayTeamId', { unique: false });
      }
      
      if (!db.objectStoreNames.contains(STORES.TEAMS)) {
        db.createObjectStore(STORES.TEAMS, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(STORES.PLAYERS)) {
        const playersStore = db.createObjectStore(STORES.PLAYERS, { keyPath: 'id' });
        playersStore.createIndex('by_team', 'teamId', { unique: false });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
    
    request.onerror = (event) => {
      console.error('Error opening database:', event.target.error);
      reject(event.target.error);
    };
  });
};

/**
 * Database service object with methods for data operations
 */
const dbService = {
  /**
   * Store multiple matches in the database
   * @param {Array} matches - Array of match objects to store
   * @returns {Promise<boolean>} - Success status
   */
  storeMatches: async (matches) => {
    try {
      const db = await initDB();
      const transaction = db.transaction([STORES.MATCHES], 'readwrite');
      const store = transaction.objectStore(STORES.MATCHES);
      
      // Store each match
      matches.forEach(match => {
        store.put(match);
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          console.log(`Successfully stored ${matches.length} matches in the database`);
          resolve(true);
        };
        
        transaction.onerror = (event) => {
          console.error('Error storing matches:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  /**
   * Get all matches from the database
   * @returns {Promise<Array>} - Array of match objects
   */
  getAllMatches: async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction([STORES.MATCHES], 'readonly');
      const store = transaction.objectStore(STORES.MATCHES);
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = (event) => {
          console.error('Error getting matches:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error:', error);
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
      const db = await initDB();
      const transaction = db.transaction([STORES.MATCHES], 'readonly');
      const store = transaction.objectStore(STORES.MATCHES);
      const request = store.get(Number(id));
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = (event) => {
          console.error('Error getting match:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error:', error);
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
      const db = await initDB();
      const transaction = db.transaction([STORES.MATCHES], 'readonly');
      const store = transaction.objectStore(STORES.MATCHES);
      
      // Get matches where the team is either home or away team
      const homeMatches = await new Promise((resolve, reject) => {
        const index = store.index('by_home_team');
        const request = index.getAll(IDBKeyRange.only(teamId));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      const awayMatches = await new Promise((resolve, reject) => {
        const index = store.index('by_away_team');
        const request = index.getAll(IDBKeyRange.only(teamId));
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
      // Combine and sort matches by date
      const allMatches = [...homeMatches, ...awayMatches];
      allMatches.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      return allMatches;
    } catch (error) {
      console.error('Error getting matches by team:', error);
      throw error;
    }
  },
  
  /**
   * Store multiple teams in the database
   * @param {Array} teams - Array of team objects to store
   * @returns {Promise<boolean>} - Success status
   */
  storeTeams: async (teams) => {
    try {
      const db = await initDB();
      const transaction = db.transaction([STORES.TEAMS], 'readwrite');
      const store = transaction.objectStore(STORES.TEAMS);
      
      // Store each team
      teams.forEach(team => {
        store.put(team);
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          console.log(`Successfully stored ${teams.length} teams in the database`);
          resolve(true);
        };
        
        transaction.onerror = (event) => {
          console.error('Error storing teams:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  /**
   * Get all teams from the database
   * @returns {Promise<Array>} - Array of team objects
   */
  getAllTeams: async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction([STORES.TEAMS], 'readonly');
      const store = transaction.objectStore(STORES.TEAMS);
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = (event) => {
          console.error('Error getting teams:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error:', error);
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
      const db = await initDB();
      const transaction = db.transaction([STORES.TEAMS], 'readonly');
      const store = transaction.objectStore(STORES.TEAMS);
      const request = store.get(id);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = (event) => {
          console.error(`Error getting team ${id}:`, event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error:', error);
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
      const db = await initDB();
      const transaction = db.transaction([STORES.PLAYERS], 'readwrite');
      const store = transaction.objectStore(STORES.PLAYERS);
      
      // Store each player
      players.forEach(player => {
        store.put(player);
      });
      
      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          console.log(`Successfully stored ${players.length} players`);
          resolve(true);
        };
        
        transaction.onerror = (event) => {
          console.error('Error storing players:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  },
  
  /**
   * Get all players from the database
   * @returns {Promise<Array>} - Array of player objects
   */
  getAllPlayers: async () => {
    try {
      const db = await initDB();
      const transaction = db.transaction([STORES.PLAYERS], 'readonly');
      const store = transaction.objectStore(STORES.PLAYERS);
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = (event) => {
          console.error('Error getting players:', event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error:', error);
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
      const db = await initDB();
      const transaction = db.transaction([STORES.PLAYERS], 'readonly');
      const store = transaction.objectStore(STORES.PLAYERS);
      const request = store.get(id);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          resolve(request.result);
        };
        
        request.onerror = (event) => {
          console.error(`Error getting player ${id}:`, event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error:', error);
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
      console.log(`Getting players for team ID: ${teamId}`);
      
      // Ensure teamId is a number
      const numericTeamId = Number(teamId);
      if (isNaN(numericTeamId)) {
        console.error(`Invalid team ID: ${teamId}`);
        return [];
      }
      
      // First try to get all players and filter by team ID
      // This is more reliable than using the index
      try {
        const allPlayers = await dbService.getAllPlayers();
        const filteredPlayers = allPlayers.filter(p => p.teamId === numericTeamId);
        console.log(`Direct method found ${filteredPlayers.length} players for team ID ${numericTeamId}`);
        
        if (filteredPlayers.length > 0) {
          return filteredPlayers;
        }
      } catch (err) {
        console.warn('Direct method failed, falling back to index:', err);
      }
      
      // Fallback to using the index if direct method fails or returns no players
      const db = await initDB();
      const transaction = db.transaction([STORES.PLAYERS], 'readonly');
      const store = transaction.objectStore(STORES.PLAYERS);
      const index = store.index('by_team');
      const request = index.getAll(numericTeamId);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const players = request.result || [];
          console.log(`Index method found ${players.length} players for team ID ${numericTeamId}`);
          
          // Log the first few players for debugging
          if (players.length > 0) {
            console.log('Sample players:', players.slice(0, 3).map(p => `${p.id}: ${p.name}`));
            resolve(players);
          } else {
            console.log('No players found using index method');
            
            // If we get here, both methods failed to find players
            // The UI will handle fallback data for specific teams
            resolve([]);
          }
        };
        
        request.onerror = (event) => {
          console.error(`Error getting players for team ${numericTeamId}:`, event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error in getPlayersByTeam:', error);
      // Return empty array instead of throwing to prevent UI errors
      return [];
    }
  },
  
  /**
   * Clear all data from a specific store
   * @param {string} storeName - Name of the store to clear
   * @returns {Promise<boolean>} - Success status
   */
  clearStore: async (storeName) => {
    try {
      if (!Object.values(STORES).includes(storeName)) {
        throw new Error(`Invalid store name: ${storeName}`);
      }
      
      const db = await initDB();
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          console.log(`Successfully cleared ${storeName} store`);
          resolve(true);
        };
        
        request.onerror = (event) => {
          console.error(`Error clearing ${storeName} store:`, event.target.error);
          reject(event.target.error);
        };
      });
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
};

export default dbService;
