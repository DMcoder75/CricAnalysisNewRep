import dbService from '../services/dbService';

/**
 * Debug function to check what players are in the database for a specific team
 */
const debugDatabasePlayers = async (teamId) => {
  try {
    console.log(`Checking players for team ID ${teamId}...`);
    
    // Get all players
    const allPlayers = await dbService.getAllPlayers();
    console.log(`Total players in database: ${allPlayers.length}`);
    
    // Get players for the specific team
    const teamPlayers = await dbService.getPlayersByTeam(parseInt(teamId));
    console.log(`Players for team ${teamId}: ${teamPlayers ? teamPlayers.length : 0}`);
    
    if (teamPlayers && teamPlayers.length > 0) {
      console.log('Player details:');
      teamPlayers.forEach(player => {
        console.log(`ID: ${player.id}, Name: ${player.name}, TeamID: ${player.teamId}, Role: ${player.role}`);
      });
    } else {
      console.log('No players found for this team.');
      
      // Check if any players have this teamId
      const filteredPlayers = allPlayers.filter(p => p.teamId === parseInt(teamId));
      console.log(`Manual filter found ${filteredPlayers.length} players for team ${teamId}`);
      
      if (filteredPlayers.length > 0) {
        console.log('Manually filtered player details:');
        filteredPlayers.forEach(player => {
          console.log(`ID: ${player.id}, Name: ${player.name}, TeamID: ${player.teamId}, Role: ${player.role}`);
        });
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error debugging database:', error);
    return false;
  }
};

export default debugDatabasePlayers;
