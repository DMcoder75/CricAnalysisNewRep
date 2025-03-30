/**
 * Utility functions for parsing cricket match data
 */

/**
 * Parses HTML content from the IPL website to extract match data
 * @param {string} htmlContent - HTML content from the IPL website
 * @returns {Array} - Array of processed match objects
 */
export const parseMatchData = (htmlContent) => {
  // In a real implementation, you would use a proper HTML parser
  // For this example, we'll create a simplified parser that extracts match data
  
  try {
    // This is a placeholder for actual HTML parsing logic
    // In a real implementation, you would use libraries like cheerio or a DOM parser
    
    // For demonstration purposes, we'll return mock data that represents
    // what we would extract from the IPL website
    return generateMockIPLMatchData();
  } catch (error) {
    console.error('Error parsing match data:', error);
    return [];
  }
};

/**
 * Generates mock IPL match data for development purposes
 * @returns {Array} - Array of mock match objects
 */
const generateMockIPLMatchData = () => {
  const teams = [
    { id: 1, name: 'Mumbai Indians', shortName: 'MI', color: '#004BA0' },
    { id: 2, name: 'Chennai Super Kings', shortName: 'CSK', color: '#FFFF00' },
    { id: 3, name: 'Royal Challengers Bangalore', shortName: 'RCB', color: '#EC1C24' },
    { id: 4, name: 'Kolkata Knight Riders', shortName: 'KKR', color: '#3A225D' },
    { id: 5, name: 'Delhi Capitals', shortName: 'DC', color: '#0078BC' },
    { id: 6, name: 'Punjab Kings', shortName: 'PBKS', color: '#ED1B24' },
    { id: 7, name: 'Rajasthan Royals', shortName: 'RR', color: '#FF1493' },
    { id: 8, name: 'Sunrisers Hyderabad', shortName: 'SRH', color: '#FF822A' },
    { id: 9, name: 'Gujarat Titans', shortName: 'GT', color: '#1D428A' },
    { id: 10, name: 'Lucknow Super Giants', shortName: 'LSG', color: '#A72056' }
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
    'BRSABV Ekana Cricket Stadium, Lucknow'
  ];
  
  // Generate 60 matches (regular season of IPL)
  const matches = [];
  
  // Start date for the IPL 2025 season (hypothetical)
  const startDate = new Date('2025-03-22T19:30:00+05:30');
  
  for (let i = 0; i < 60; i++) {
    // Generate a date for this match (every other day)
    const matchDate = new Date(startDate);
    matchDate.setDate(startDate.getDate() + Math.floor(i / 2));
    
    // Alternate between afternoon (15:30) and evening (19:30) matches
    if (i % 2 === 0) {
      matchDate.setHours(15, 30, 0);
    } else {
      matchDate.setHours(19, 30, 0);
    }
    
    // Select random teams for this match (ensuring they're different)
    let homeTeamIndex = Math.floor(Math.random() * teams.length);
    let awayTeamIndex = Math.floor(Math.random() * teams.length);
    while (awayTeamIndex === homeTeamIndex) {
      awayTeamIndex = Math.floor(Math.random() * teams.length);
    }
    
    // Select a random venue (typically the home team's venue)
    const venueIndex = homeTeamIndex % venues.length;
    
    // Determine if the match is in the past, and if so, generate a result
    const isPastMatch = matchDate < new Date();
    
    let match = {
      id: i + 1,
      matchNumber: i + 1,
      season: 2025,
      date: matchDate.toISOString(),
      venue: venues[venueIndex],
      homeTeamId: teams[homeTeamIndex].id,
      awayTeamId: teams[awayTeamIndex].id,
      status: isPastMatch ? 'Completed' : 'Upcoming',
    };
    
    // For completed matches, add result information
    if (isPastMatch) {
      // Randomly determine winner
      const homeTeamWon = Math.random() > 0.5;
      const winnerTeamId = homeTeamWon ? teams[homeTeamIndex].id : teams[awayTeamIndex].id;
      
      // Generate random scores
      const homeTeamRuns = Math.floor(Math.random() * 100) + 120; // 120-220 runs
      const homeTeamWickets = Math.floor(Math.random() * 10);
      const awayTeamRuns = homeTeamWon ? homeTeamRuns - (Math.floor(Math.random() * 40) + 1) : homeTeamRuns + (Math.floor(Math.random() * 40) + 1);
      const awayTeamWickets = Math.floor(Math.random() * 10);
      
      // Add result details
      match = {
        ...match,
        winnerId: winnerTeamId,
        homeTeamScore: `${homeTeamRuns}/${homeTeamWickets}`,
        awayTeamScore: `${awayTeamRuns}/${awayTeamWickets}`,
        result: homeTeamWon 
          ? `${teams[homeTeamIndex].name} won by ${homeTeamRuns - awayTeamRuns} runs`
          : `${teams[awayTeamIndex].name} won by ${10 - awayTeamWickets} wickets`,
        tossWinner: Math.random() > 0.5 ? teams[homeTeamIndex].id : teams[awayTeamIndex].id,
        tossDecision: Math.random() > 0.5 ? 'bat' : 'field'
      };
    }
    
    matches.push(match);
  }
  
  return matches;
};

/**
 * Format match date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date string (e.g., "Sunday, March 22, 2025")
 */
export const formatMatchDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format match time for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted time string (e.g., "07:30 PM")
 */
export const formatMatchTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};
