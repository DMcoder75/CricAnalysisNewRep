import dbService from '../services/dbService';
import initializeDatabase from './dbInitializer';

/**
 * Clear and reload the database
 * This will clear all stores and reinitialize the database with fresh data
 */
const clearAndReloadDB = async () => {
  try {
    console.log('Clearing database...');
    await dbService.clearStore('players');
    await dbService.clearStore('teams');
    await dbService.clearStore('matches');
    
    console.log('Database cleared. Reloading with fresh data...');
    await initializeDatabase();
    
    console.log('Database reinitialized successfully!');
    return true;
  } catch (error) {
    console.error('Error clearing and reloading database:', error);
    return false;
  }
};

export default clearAndReloadDB;
