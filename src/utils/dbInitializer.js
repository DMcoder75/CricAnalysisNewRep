import mysqlDbService from '../services/mysqlDbService';
import dataFetchService from '../services/dataFetchService';

/**
 * Initialize the database with required data
 * This function will be called when the application starts
 */
const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Check if we already have data in the database
    const [teams, matches, players] = await Promise.all([
      mysqlDbService.getAllTeams(),
      mysqlDbService.getAllMatches(),
      mysqlDbService.getAllPlayers()
    ]);
    
    // If we don't have teams data, initialize with default teams
    if (!teams || teams.length === 0) {
      console.log('No teams found in database. Initializing teams...');
      
      const defaultTeams = [
        { id: 1, name: 'Mumbai Indians', shortName: 'MI', color: '#004BA0' },
        { id: 2, name: 'Chennai Super Kings', shortName: 'CSK', color: '#FFFF00' },
        { id: 3, name: 'Royal Challengers Bangalore', shortName: 'RCB', color: '#EC1C24' },
        { id: 4, name: 'Kolkata Knight Riders', shortName: 'KKR', color: '#3A225D' },
        { id: 5, name: 'Delhi Capitals', shortName: 'DC', color: '#0078BC' },
        { id: 6, name: 'Punjab Kings', shortName: 'PBKS', color: '#ED1B24' },
        { id: 7, name: 'Rajasthan Royals', shortName: 'RR', color: '#FF1493' },
        { id: 8, name: 'Sunrisers Hyderabad', shortName: 'SRH', color: '#FF822A' },
        { id: 9, name: 'Gujarat Titans', shortName: 'GT', color: '#1D428A' },
        { id: 10, name: 'Lucknow Super Giants', shortName: 'LSG', color: '#A72056' },
        { id: 11, name: 'Zimbabwe A', shortName: 'ZIM', color: '#D40000' },
        { id: 12, name: 'Durham', shortName: 'DUR', color: '#0047AB' }
      ];
      
      await mysqlDbService.storeTeams(defaultTeams);
      console.log('Teams initialized successfully.');
    }
    
    // If we don't have players data, initialize with default players
    if (!players || players.length === 0) {
      console.log('No players found in database. Initializing players...');
      
      const defaultPlayers = [
        // Mumbai Indians
        {
          id: 1,
          name: 'Hardik Pandya',
          teamId: 1,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium-fast',
          nationality: 'Indian',
          age: 31,
          isCaptain: true,
          stats: {
            batting: {
              matches: 135,
              runs: 2452,
              average: 31.0,
              strikeRate: 149.5,
              fifties: 10,
              hundreds: 0
            },
            bowling: {
              matches: 135,
              wickets: 58,
              economy: 8.75
            }
          }
        },
        {
          id: 2,
          name: 'Jasprit Bumrah',
          teamId: 1,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast',
          nationality: 'Indian',
          age: 31,
          stats: {
            batting: {
              matches: 127,
              runs: 72,
              average: 5.14,
              strikeRate: 83.72
            },
            bowling: {
              matches: 127,
              wickets: 158,
              economy: 7.31
            }
          }
        },
        {
          id: 4,
          name: 'Suryakumar Yadav',
          teamId: 1,
          role: 'Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 34,
          stats: {
            batting: {
              matches: 139,
              runs: 3249,
              average: 32.49,
              strikeRate: 142.82,
              fifties: 21,
              hundreds: 0
            },
            bowling: {
              matches: 139,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 6,
          name: 'Tilak Varma',
          teamId: 1,
          role: 'Batsman',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm off-break',
          nationality: 'Indian',
          age: 22,
          stats: {
            batting: {
              matches: 28,
              runs: 740,
              average: 38.95,
              strikeRate: 144.53,
              fifties: 5,
              hundreds: 0
            },
            bowling: {
              matches: 28,
              wickets: 2,
              economy: 9.25
            }
          }
        },
        {
          id: 7,
          name: 'Tim David',
          teamId: 1,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Australian',
          age: 28,
          stats: {
            batting: {
              matches: 32,
              runs: 659,
              average: 32.95,
              strikeRate: 164.75,
              fifties: 3,
              hundreds: 0
            },
            bowling: {
              matches: 32,
              wickets: 1,
              economy: 10.50
            }
          }
        },
        {
          id: 11,
          name: 'Trent Boult',
          teamId: 1,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Left-arm fast',
          nationality: 'New Zealand',
          age: 35,
          stats: {
            batting: {
              matches: 88,
              runs: 93,
              average: 8.45,
              strikeRate: 114.81,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 88,
              wickets: 105,
              economy: 8.18
            }
          }
        },
        {
          id: 12,
          name: 'Ishan Kishan',
          teamId: 1,
          role: 'Wicket-keeper Batsman',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Does not bowl',
          nationality: 'Indian',
          age: 26,
          stats: {
            batting: {
              matches: 95,
              runs: 2324,
              average: 28.34,
              strikeRate: 136.71,
              fifties: 14,
              hundreds: 0
            },
            bowling: {
              matches: 95,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 13,
          name: 'Arshad Khan',
          teamId: 1,
          role: 'All-rounder',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm medium-fast',
          nationality: 'Indian',
          age: 26,
          stats: {
            batting: {
              matches: 8,
              runs: 33,
              average: 16.50,
              strikeRate: 132.00,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 8,
              wickets: 5,
              economy: 9.25
            }
          }
        },
        {
          id: 14,
          name: 'Nehal Wadhera',
          teamId: 1,
          role: 'All-rounder',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 23,
          stats: {
            batting: {
              matches: 14,
              runs: 241,
              average: 26.78,
              strikeRate: 142.60,
              fifties: 2,
              hundreds: 0
            },
            bowling: {
              matches: 14,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 15,
          name: 'Piyush Chawla',
          teamId: 1,
          role: 'Bowler',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'Indian',
          age: 35,
          stats: {
            batting: {
              matches: 174,
              runs: 598,
              average: 13.59,
              strikeRate: 114.34,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 174,
              wickets: 179,
              economy: 8.19
            }
          }
        },
        // Chennai Super Kings
        {
          id: 101,
          name: 'MS Dhoni',
          teamId: 2,
          role: 'Wicket-keeper Batsman',
          isCaptain: false,
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 43,
          stats: {
            batting: {
              matches: 250,
              runs: 5082,
              average: 38.79,
              strikeRate: 135.92,
              fifties: 24,
              hundreds: 0
            },
            bowling: {
              matches: 250,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 102,
          name: 'Ruturaj Gaikwad',
          teamId: 2,
          role: 'Batsman',
          isCaptain: true,
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off-break',
          nationality: 'Indian',
          age: 27,
          stats: {
            batting: {
              matches: 52,
              runs: 1797,
              average: 39.07,
              strikeRate: 133.09,
              fifties: 14,
              hundreds: 1
            },
            bowling: {
              matches: 52,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 103,
          name: 'Ravindra Jadeja',
          teamId: 2,
          role: 'All-rounder',
          isCaptain: false,
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm orthodox',
          nationality: 'Indian',
          age: 35,
          stats: {
            batting: {
              matches: 226,
              runs: 2692,
              average: 27.19,
              strikeRate: 135.96,
              fifties: 3,
              hundreds: 0
            },
            bowling: {
              matches: 226,
              wickets: 152,
              economy: 7.58
            }
          }
        },
        {
          id: 107,
          name: 'Shivam Dube',
          teamId: 2,
          role: 'All-rounder',
          isCaptain: false,
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 31,
          stats: {
            batting: {
              matches: 54,
              runs: 1186,
              average: 31.21,
              strikeRate: 158.13,
              fifties: 7,
              hundreds: 0
            },
            bowling: {
              matches: 54,
              wickets: 8,
              economy: 9.85
            }
          }
        },
        {
          id: 109,
          name: 'Matheesha Pathirana',
          teamId: 2,
          role: 'Bowler',
          isCaptain: false,
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast',
          nationality: 'Sri Lanka',
          age: 21,
          stats: {
            batting: {
              matches: 14,
              runs: 3,
              average: 3.00,
              strikeRate: 75.00,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 14,
              wickets: 22,
              economy: 8.04
            }
          }
        },
        {
          id: 121,
          name: 'Ravichandran Ashwin',
          teamId: 2,
          role: 'All-rounder',
          isCaptain: false,
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off-break',
          nationality: 'Indian',
          age: 38,
          stats: {
            batting: {
              matches: 197,
              runs: 712,
              average: 13.18,
              strikeRate: 120.68,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 197,
              wickets: 171,
              economy: 7.04
            }
          }
        },
        {
          id: 122,
          name: 'Noor Ahmad',
          teamId: 2,
          role: 'Bowler',
          isCaptain: false,
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm wrist-spin',
          nationality: 'Afghanistan',
          age: 19,
          stats: {
            batting: {
              matches: 14,
              runs: 8,
              average: 4.00,
              strikeRate: 80.00,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 14,
              wickets: 19,
              economy: 7.82
            }
          }
        },
        {
          id: 123,
          name: 'Sameer Rizvi',
          teamId: 2,
          role: 'Batsman',
          isCaptain: false,
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off-break',
          nationality: 'Indian',
          age: 20,
          stats: {
            batting: {
              matches: 3,
              runs: 35,
              average: 17.50,
              strikeRate: 159.09,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 3,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 124,
          name: 'Rachin Ravindra',
          teamId: 2,
          role: 'All-rounder',
          isCaptain: false,
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm orthodox',
          nationality: 'New Zealand',
          age: 25,
          stats: {
            batting: {
              matches: 14,
              runs: 425,
              average: 32.69,
              strikeRate: 145.55,
              fifties: 3,
              hundreds: 0
            },
            bowling: {
              matches: 14,
              wickets: 7,
              economy: 8.76
            }
          }
        },
        {
          id: 125,
          name: 'Aravelly Avanish',
          teamId: 2,
          role: 'Wicket-keeper Batsman',
          isCaptain: false,
          battingStyle: 'Right-handed',
          bowlingStyle: 'Does not bowl',
          nationality: 'Indian',
          age: 19,
          stats: {
            batting: {
              matches: 2,
              runs: 18,
              average: 9.00,
              strikeRate: 120.00,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 2,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 126,
          name: 'Shardul Thakur',
          teamId: 2,
          role: 'Bowler',
          isCaptain: false,
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium-fast',
          nationality: 'Indian',
          age: 32,
          stats: {
            batting: {
              matches: 86,
              runs: 287,
              average: 14.35,
              strikeRate: 149.48,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 86,
              wickets: 89,
              economy: 9.15
            }
          }
        },
        {
          id: 127,
          name: 'Tushar Deshpande',
          teamId: 2,
          role: 'Bowler',
          isCaptain: false,
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium-fast',
          nationality: 'Indian',
          age: 29,
          stats: {
            batting: {
              matches: 25,
              runs: 12,
              average: 6.00,
              strikeRate: 100.00,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 25,
              wickets: 31,
              economy: 9.42
            }
          }
        },
        // Add more CSK players as needed...
        
        // Royal Challengers Bangalore
        {
          id: 16,
          name: 'Rajat Patidar',
          teamId: 3,
          role: 'Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'Indian',
          age: 31,
          isCaptain: false,
          stats: {
            batting: {
              matches: 19,
              runs: 582,
              average: 34.24,
              strikeRate: 156.05,
              fifties: 3,
              hundreds: 1
            },
            bowling: {
              matches: 19,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 17,
          name: 'Virat Kohli',
          teamId: 3,
          role: 'Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 36,
          isCaptain: true,
          stats: {
            batting: {
              matches: 246,
              runs: 7763,
              average: 38.04,
              strikeRate: 130.98,
              fifties: 53,
              hundreds: 8
            },
            bowling: {
              matches: 246,
              wickets: 4,
              economy: 8.72
            }
          }
        },
        {
          id: 18,
          name: 'Glenn Maxwell',
          teamId: 3,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off-break',
          nationality: 'Australian',
          age: 36,
          stats: {
            batting: {
              matches: 124,
              runs: 2719,
              average: 26.40,
              strikeRate: 154.12,
              fifties: 13,
              hundreds: 4
            },
            bowling: {
              matches: 124,
              wickets: 34,
              economy: 8.32
            }
          }
        },
        {
          id: 19,
          name: 'Mohammed Siraj',
          teamId: 3,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast',
          nationality: 'Indian',
          age: 30,
          stats: {
            batting: {
              matches: 84,
              runs: 109,
              average: 8.38,
              strikeRate: 95.61,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 84,
              wickets: 93,
              economy: 8.79
            }
          }
        },
        {
          id: 20,
          name: 'Yash Dayal',
          teamId: 3,
          role: 'Bowler',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm medium-fast',
          nationality: 'Indian',
          age: 26,
          stats: {
            batting: {
              matches: 16,
              runs: 12,
              average: 6.00,
              strikeRate: 85.71,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 16,
              wickets: 16,
              economy: 9.12
            }
          }
        },
        {
          id: 21,
          name: 'Will Jacks',
          teamId: 3,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off-break',
          nationality: 'England',
          age: 25,
          stats: {
            batting: {
              matches: 8,
              runs: 230,
              average: 32.86,
              strikeRate: 175.57,
              fifties: 1,
              hundreds: 1
            },
            bowling: {
              matches: 8,
              wickets: 1,
              economy: 10.25
            }
          }
        },
        {
          id: 22,
          name: 'Cameron Green',
          teamId: 3,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast-medium',
          nationality: 'Australian',
          age: 25,
          stats: {
            batting: {
              matches: 25,
              runs: 608,
              average: 32.00,
              strikeRate: 142.99,
              fifties: 3,
              hundreds: 1
            },
            bowling: {
              matches: 25,
              wickets: 14,
              economy: 8.65
            }
          }
        },
        {
          id: 23,
          name: 'Lockie Ferguson',
          teamId: 3,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast',
          nationality: 'New Zealand',
          age: 33,
          stats: {
            batting: {
              matches: 38,
              runs: 19,
              average: 4.75,
              strikeRate: 79.17,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 38,
              wickets: 52,
              economy: 8.18
            }
          }
        },
        // Kolkata Knight Riders
        {
          id: 47,
          name: 'Shreyas Iyer',
          teamId: 4,
          role: 'Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'Indian',
          age: 29,
          isCaptain: true,
          stats: {
            batting: {
              matches: 105,
              runs: 2935,
              average: 31.56,
              strikeRate: 125.43,
              fifties: 19,
              hundreds: 1
            },
            bowling: {
              matches: 105,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 48,
          name: 'Andre Russell',
          teamId: 4,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast-medium',
          nationality: 'West Indies',
          age: 36,
          stats: {
            batting: {
              matches: 113,
              runs: 2262,
              average: 30.16,
              strikeRate: 174.77,
              fifties: 10,
              hundreds: 0
            },
            bowling: {
              matches: 113,
              wickets: 96,
              economy: 9.12
            }
          }
        },
        {
          id: 49,
          name: 'Sunil Narine',
          teamId: 4,
          role: 'All-rounder',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm off-break',
          nationality: 'West Indies',
          age: 36,
          stats: {
            batting: {
              matches: 164,
              runs: 1186,
              average: 15.01,
              strikeRate: 164.72,
              fifties: 5,
              hundreds: 0
            },
            bowling: {
              matches: 164,
              wickets: 165,
              economy: 6.75
            }
          }
        },
        {
          id: 50,
          name: 'Rinku Singh',
          teamId: 4,
          role: 'Batsman',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm off-break',
          nationality: 'Indian',
          age: 26,
          stats: {
            batting: {
              matches: 31,
              runs: 725,
              average: 48.33,
              strikeRate: 149.48,
              fifties: 3,
              hundreds: 0
            },
            bowling: {
              matches: 31,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 51,
          name: 'Varun Chakravarthy',
          teamId: 4,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'Indian',
          age: 33,
          stats: {
            batting: {
              matches: 49,
              runs: 12,
              average: 6.00,
              strikeRate: 66.67,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 49,
              wickets: 69,
              economy: 7.82
            }
          }
        },
        {
          id: 52,
          name: 'Mitchell Starc',
          teamId: 4,
          role: 'Bowler',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm fast',
          nationality: 'Australian',
          age: 34,
          stats: {
            batting: {
              matches: 41,
              runs: 105,
              average: 10.50,
              strikeRate: 112.90
            },
            bowling: {
              matches: 41,
              wickets: 55,
              economy: 8.68
            }
          }
        },
        // Delhi Capitals
        {
          id: 24,
          name: 'Axar Patel',
          teamId: 5,
          role: 'Bowler',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm orthodox',
          nationality: 'Indian',
          age: 30,
          isCaptain: false,
          stats: {
            batting: {
              matches: 136,
              runs: 1437,
              average: 21.77,
              strikeRate: 129.46,
              fifties: 4,
              hundreds: 0
            },
            bowling: {
              matches: 136,
              wickets: 112,
              economy: 7.35
            }
          }
        },
        {
          id: 25,
          name: 'Kuldeep Yadav',
          teamId: 5,
          role: 'Bowler',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm chinaman',
          nationality: 'Indian',
          age: 29,
          stats: {
            batting: {
              matches: 82,
              runs: 124,
              average: 8.27,
              strikeRate: 101.64,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 82,
              wickets: 95,
              economy: 8.24
            }
          }
        },
        {
          id: 26,
          name: 'Tristan Stubbs',
          teamId: 5,
          role: 'Batter',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'South Africa',
          age: 23,
          stats: {
            batting: {
              matches: 15,
              runs: 280,
              average: 35.00,
              strikeRate: 158.19,
              fifties: 2,
              hundreds: 0
            },
            bowling: {
              matches: 15,
              wickets: 3,
              economy: 9.10
            }
          }
        },
        {
          id: 27,
          name: 'Abishek Porel',
          teamId: 5,
          role: 'Batter/Wicketkeeper',
          battingStyle: 'Left-handed',
          bowlingStyle: 'None',
          nationality: 'Indian',
          age: 22,
          stats: {
            batting: {
              matches: 12,
              runs: 245,
              average: 24.50,
              strikeRate: 142.44,
              fifties: 1,
              hundreds: 0
            },
            bowling: {
              matches: 12,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 28,
          name: 'Ishant Sharma',
          teamId: 5,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast-medium',
          nationality: 'India',
          age: 35,
          stats: {
            batting: {
              matches: 93,
              runs: 56,
              average: 7.00,
              strikeRate: 80.00,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 93,
              wickets: 84,
              economy: 8.11
            }
          }
        },
        {
          id: 29,
          name: 'KL Rahul',
          teamId: 5,
          role: 'Batter/Wicketkeeper',
          battingStyle: 'Right-handed',
          bowlingStyle: 'None',
          nationality: 'Indian',
          age: 32,
          isCaptain: true,
          stats: {
            batting: {
              matches: 119,
              runs: 4163,
              average: 46.25,
              strikeRate: 134.53,
              fifties: 33,
              hundreds: 4
            },
            bowling: {
              matches: 119,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 30,
          name: 'Jake Fraser-McGurk',
          teamId: 5,
          role: 'Batter',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'Australia',
          age: 22,
          stats: {
            batting: {
              matches: 7,
              runs: 330,
              average: 47.14,
              strikeRate: 234.04,
              fifties: 3,
              hundreds: 0
            },
            bowling: {
              matches: 7,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 31,
          name: 'T Natarajan',
          teamId: 5,
          role: 'Bowler',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm medium-fast',
          nationality: 'Indian',
          age: 33,
          stats: {
            batting: {
              matches: 45,
              runs: 15,
              average: 5.00,
              strikeRate: 75.00,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 45,
              wickets: 59,
              economy: 8.71
            }
          }
        },
        {
          id: 32,
          name: 'Karun Nair',
          teamId: 5,
          role: 'Batter',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'Indian',
          age: 32,
          stats: {
            batting: {
              matches: 73,
              runs: 1496,
              average: 24.13,
              strikeRate: 127.86,
              fifties: 10,
              hundreds: 0
            },
            bowling: {
              matches: 73,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 33,
          name: 'Sameer Rizvi',
          teamId: 5,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'Indian',
          age: 23,
          stats: {
            batting: {
              matches: 5,
              runs: 95,
              average: 23.75,
              strikeRate: 158.33,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 5,
              wickets: 3,
              economy: 8.45
            }
          }
        },
        {
          id: 34,
          name: 'Ashutosh Sharma',
          teamId: 5,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 25,
          stats: {
            batting: {
              matches: 8,
              runs: 210,
              average: 30.00,
              strikeRate: 175.00,
              fifties: 1,
              hundreds: 0
            },
            bowling: {
              matches: 8,
              wickets: 4,
              economy: 8.90
            }
          }
        },
        {
          id: 35,
          name: 'Mohit Sharma',
          teamId: 5,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium-fast',
          nationality: 'Indian',
          age: 35,
          stats: {
            batting: {
              matches: 95,
              runs: 110,
              average: 9.17,
              strikeRate: 100.00,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 95,
              wickets: 117,
              economy: 8.42
            }
          }
        },
        {
          id: 36,
          name: 'Faf du Plessis',
          teamId: 5,
          role: 'Batter',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'South Africa',
          age: 40,
          stats: {
            batting: {
              matches: 130,
              runs: 4162,
              average: 37.50,
              strikeRate: 134.92,
              fifties: 31,
              hundreds: 1
            },
            bowling: {
              matches: 130,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 37,
          name: 'Mukesh Kumar',
          teamId: 5,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast-medium',
          nationality: 'Indian',
          age: 30,
          stats: {
            batting: {
              matches: 15,
              runs: 25,
              average: 8.33,
              strikeRate: 92.59,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 15,
              wickets: 18,
              economy: 9.15
            }
          }
        },
        {
          id: 38,
          name: 'Darshan Nalkande',
          teamId: 5,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium-fast',
          nationality: 'Indian',
          age: 25,
          stats: {
            batting: {
              matches: 8,
              runs: 45,
              average: 15.00,
              strikeRate: 125.00,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 8,
              wickets: 10,
              economy: 8.75
            }
          }
        },
        {
          id: 39,
          name: 'Vipraj Nigam',
          teamId: 5,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 22,
          stats: {
            batting: {
              matches: 0,
              runs: 0,
              average: 0,
              strikeRate: 0,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 0,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 40,
          name: 'Dushmantha Chameera',
          teamId: 5,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast',
          nationality: 'Sri Lanka',
          age: 32,
          stats: {
            batting: {
              matches: 12,
              runs: 15,
              average: 7.50,
              strikeRate: 88.24,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 12,
              wickets: 9,
              economy: 8.73
            }
          }
        },
        {
          id: 41,
          name: 'Donovan Ferreira',
          teamId: 5,
          role: 'Batter',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'South Africa',
          age: 25,
          stats: {
            batting: {
              matches: 3,
              runs: 75,
              average: 37.50,
              strikeRate: 187.50,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 3,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 42,
          name: 'Ajay Mandal',
          teamId: 5,
          role: 'All-rounder',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm orthodox',
          nationality: 'Indian',
          age: 24,
          stats: {
            batting: {
              matches: 0,
              runs: 0,
              average: 0,
              strikeRate: 0,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 0,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 43,
          name: 'Manvanth Kumar',
          teamId: 5,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 21,
          stats: {
            batting: {
              matches: 0,
              runs: 0,
              average: 0,
              strikeRate: 0,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 0,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 44,
          name: 'Madhav Tiwari',
          teamId: 5,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 20,
          stats: {
            batting: {
              matches: 0,
              runs: 0,
              average: 0,
              strikeRate: 0,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 0,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 45,
          name: 'Tripurana Vijay',
          teamId: 5,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'Indian',
          age: 23,
          stats: {
            batting: {
              matches: 0,
              runs: 0,
              average: 0,
              strikeRate: 0,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 0,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 46,
          name: 'Mitchell Starc',
          teamId: 5,
          role: 'Bowler',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm fast',
          nationality: 'Australia',
          age: 34,
          stats: {
            batting: {
              matches: 41,
              runs: 105,
              average: 10.50,
              strikeRate: 112.90,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 41,
              wickets: 55,
              economy: 8.68
            }
          }
        },
        // Punjab Kings
        {
          id: 101,
          name: 'Shashank Singh',
          teamId: 6,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off-break',
          nationality: 'Indian',
          age: 32,
          isCaptain: true,
          stats: {
            batting: {
              matches: 14,
              runs: 354,
              average: 44.25,
              strikeRate: 164.65,
              fifties: 3,
              hundreds: 0
            },
            bowling: {
              matches: 14,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 102,
          name: 'Arshdeep Singh',
          teamId: 6,
          role: 'Bowler',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm medium-fast',
          nationality: 'Indian',
          age: 25,
          stats: {
            batting: {
              matches: 54,
              runs: 28,
              average: 7.00,
              strikeRate: 93.33
            },
            bowling: {
              matches: 54,
              wickets: 63,
              economy: 8.64
            }
          }
        },
        {
          id: 103,
          name: 'Harshal Patel',
          teamId: 6,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium-fast',
          nationality: 'Indian',
          age: 33,
          stats: {
            batting: {
              matches: 97,
              runs: 298,
              average: 12.96,
              strikeRate: 134.84,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 97,
              wickets: 126,
              economy: 8.72
            }
          }
        },
        {
          id: 104,
          name: 'Liam Livingstone',
          teamId: 6,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'England',
          age: 31,
          stats: {
            batting: {
              matches: 37,
              runs: 830,
              average: 25.94,
              strikeRate: 149.82,
              fifties: 3,
              hundreds: 0
            },
            bowling: {
              matches: 37,
              wickets: 9,
              economy: 8.78
            }
          }
        },
        {
          id: 105,
          name: 'Sam Curran',
          teamId: 6,
          role: 'All-rounder',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm medium-fast',
          nationality: 'England',
          age: 26,
          stats: {
            batting: {
              matches: 52,
              runs: 856,
              average: 23.78,
              strikeRate: 138.06,
              fifties: 2,
              hundreds: 0
            },
            bowling: {
              matches: 52,
              wickets: 48,
              economy: 9.12
            }
          }
        },
        // Rajasthan Royals
        {
          id: 35,
          name: 'Sanju Samson',
          teamId: 7,
          role: 'Wicket-keeper Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 29,
          isCaptain: true,
          stats: {
            batting: {
              matches: 152,
              runs: 3888,
              average: 29.91,
              strikeRate: 137.19,
              fifties: 21,
              hundreds: 3
            },
            bowling: {
              matches: 152,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 36,
          name: 'Yashasvi Jaiswal',
          teamId: 7,
          role: 'Batsman',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'Indian',
          age: 22,
          stats: {
            batting: {
              matches: 37,
              runs: 1172,
              average: 33.49,
              strikeRate: 156.27,
              fifties: 7,
              hundreds: 1
            },
            bowling: {
              matches: 37,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 37,
          name: 'Jos Buttler',
          teamId: 7,
          role: 'Wicket-keeper Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'England',
          age: 34,
          stats: {
            batting: {
              matches: 96,
              runs: 3582,
              average: 40.25,
              strikeRate: 147.28,
              fifties: 18,
              hundreds: 6
            },
            bowling: {
              matches: 96,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 38,
          name: 'Shimron Hetmyer',
          teamId: 7,
          role: 'Batsman',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'West Indies',
          age: 27,
          stats: {
            batting: {
              matches: 54,
              runs: 1083,
              average: 30.94,
              strikeRate: 157.87,
              fifties: 5,
              hundreds: 0
            },
            bowling: {
              matches: 54,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 39,
          name: 'Riyan Parag',
          teamId: 7,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'Indian',
          age: 22,
          stats: {
            batting: {
              matches: 54,
              runs: 889,
              average: 23.39,
              strikeRate: 136.77,
              fifties: 5,
              hundreds: 0
            },
            bowling: {
              matches: 54,
              wickets: 4,
              economy: 8.95
            }
          }
        },
        {
          id: 40,
          name: 'Yuzvendra Chahal',
          teamId: 7,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'Indian',
          age: 34,
          stats: {
            batting: {
              matches: 145,
              runs: 32,
              average: 4.57,
              strikeRate: 60.38
            },
            bowling: {
              matches: 145,
              wickets: 187,
              economy: 7.67
            }
          }
        },
        // Sunrisers Hyderabad
        {
          id: 41,
          name: 'Pat Cummins',
          teamId: 8,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast',
          nationality: 'Australian',
          age: 31,
          isCaptain: true,
          stats: {
            batting: {
              matches: 49,
              runs: 379,
              average: 16.48,
              strikeRate: 145.77,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 49,
              wickets: 55,
              economy: 8.80
            }
          }
        },
        {
          id: 42,
          name: 'Heinrich Klaasen',
          teamId: 8,
          role: 'Wicket-keeper Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'South African',
          age: 33,
          stats: {
            batting: {
              matches: 27,
              runs: 738,
              average: 36.90,
              strikeRate: 175.71,
              fifties: 4,
              hundreds: 0
            },
            bowling: {
              matches: 27,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 43,
          name: 'Abhishek Sharma',
          teamId: 8,
          role: 'All-rounder',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm orthodox',
          nationality: 'Indian',
          age: 24,
          stats: {
            batting: {
              matches: 54,
              runs: 1240,
              average: 24.80,
              strikeRate: 143.02,
              fifties: 6,
              hundreds: 0
            },
            bowling: {
              matches: 54,
              wickets: 6,
              economy: 8.95
            }
          }
        },
        {
          id: 44,
          name: 'Travis Head',
          teamId: 8,
          role: 'Batsman',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'Australian',
          age: 30,
          stats: {
            batting: {
              matches: 14,
              runs: 567,
              average: 40.50,
              strikeRate: 191.55,
              fifties: 4,
              hundreds: 1
            },
            bowling: {
              matches: 14,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 45,
          name: 'Bhuvneshwar Kumar',
          teamId: 8,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium-fast',
          nationality: 'Indian',
          age: 34,
          stats: {
            batting: {
              matches: 159,
              runs: 247,
              average: 8.52,
              strikeRate: 99.60
            },
            bowling: {
              matches: 159,
              wickets: 170,
              economy: 7.31
            }
          }
        },
        {
          id: 46,
          name: 'T Natarajan',
          teamId: 8,
          role: 'Bowler',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm medium-fast',
          nationality: 'Indian',
          age: 33,
          stats: {
            batting: {
              matches: 41,
              runs: 13,
              average: 6.50,
              strikeRate: 86.67,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 41,
              wickets: 55,
              economy: 8.71
            }
          }
        },
        // Gujarat Titans
        {
          id: 53,
          name: 'Shubman Gill',
          teamId: 9,
          role: 'Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'Indian',
          age: 25,
          isCaptain: true,
          stats: {
            batting: {
              matches: 91,
              runs: 2790,
              average: 38.75,
              strikeRate: 136.32,
              fifties: 19,
              hundreds: 2
            },
            bowling: {
              matches: 91,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 54,
          name: 'Rashid Khan',
          teamId: 9,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'Afghanistan',
          age: 26,
          stats: {
            batting: {
              matches: 110,
              runs: 473,
              average: 14.78,
              strikeRate: 155.76,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 110,
              wickets: 139,
              economy: 6.79
            }
          }
        },
        {
          id: 55,
          name: 'Rahul Tewatia',
          teamId: 9,
          role: 'All-rounder',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'Indian',
          age: 31,
          stats: {
            batting: {
              matches: 81,
              runs: 1232,
              average: 29.33,
              strikeRate: 143.09,
              fifties: 3,
              hundreds: 0
            },
            bowling: {
              matches: 81,
              wickets: 32,
              economy: 7.95
            }
          }
        },
        {
          id: 56,
          name: 'David Miller',
          teamId: 9,
          role: 'Batsman',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'South African',
          age: 35,
          stats: {
            batting: {
              matches: 117,
              runs: 2455,
              average: 37.77,
              strikeRate: 142.94,
              fifties: 14,
              hundreds: 1
            },
            bowling: {
              matches: 117,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 57,
          name: 'Mohammed Shami',
          teamId: 9,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm fast-medium',
          nationality: 'Indian',
          age: 34,
          stats: {
            batting: {
              matches: 104,
              runs: 68,
              average: 5.67,
              strikeRate: 82.93,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 104,
              wickets: 127,
              economy: 8.44
            }
          }
        },
        {
          id: 58,
          name: 'Shahrukh Khan',
          teamId: 9,
          role: 'Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Indian',
          age: 29,
          stats: {
            batting: {
              matches: 33,
              runs: 426,
              average: 20.29,
              strikeRate: 134.81,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 33,
              wickets: 0,
              economy: 0
            }
          }
        },
        // Lucknow Super Giants
        {
          id: 59,
          name: 'KL Rahul',
          teamId: 10,
          role: 'Wicket-keeper Batsman',
          battingStyle: 'Right-handed',
          bowlingStyle: 'None',
          nationality: 'Indian',
          age: 32,
          isCaptain: true,
          stats: {
            batting: {
              matches: 119,
              runs: 4163,
              average: 46.26,
              strikeRate: 134.61,
              fifties: 33,
              hundreds: 4
            },
            bowling: {
              matches: 119,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 60,
          name: 'Nicholas Pooran',
          teamId: 10,
          role: 'Wicket-keeper Batsman',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Right-arm off break',
          nationality: 'West Indies',
          age: 29,
          stats: {
            batting: {
              matches: 65,
              runs: 1270,
              average: 24.90,
              strikeRate: 157.00,
              fifties: 7,
              hundreds: 0
            },
            bowling: {
              matches: 65,
              wickets: 0,
              economy: 0
            }
          }
        },
        {
          id: 61,
          name: 'Marcus Stoinis',
          teamId: 10,
          role: 'All-rounder',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm medium',
          nationality: 'Australian',
          age: 35,
          stats: {
            batting: {
              matches: 87,
              runs: 1805,
              average: 28.65,
              strikeRate: 142.13,
              fifties: 10,
              hundreds: 1
            },
            bowling: {
              matches: 87,
              wickets: 43,
              economy: 9.19
            }
          }
        },
        {
          id: 62,
          name: 'Krunal Pandya',
          teamId: 10,
          role: 'All-rounder',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm orthodox',
          nationality: 'Indian',
          age: 33,
          stats: {
            batting: {
              matches: 110,
              runs: 1475,
              average: 24.18,
              strikeRate: 138.67,
              fifties: 4,
              hundreds: 0
            },
            bowling: {
              matches: 110,
              wickets: 74,
              economy: 7.33
            }
          }
        },
        {
          id: 63,
          name: 'Ravi Bishnoi',
          teamId: 10,
          role: 'Bowler',
          battingStyle: 'Right-handed',
          bowlingStyle: 'Right-arm leg break',
          nationality: 'Indian',
          age: 24,
          stats: {
            batting: {
              matches: 55,
              runs: 34,
              average: 8.50,
              strikeRate: 94.44,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 55,
              wickets: 66,
              economy: 7.86
            }
          }
        },
        {
          id: 64,
          name: 'Mohsin Khan',
          teamId: 10,
          role: 'Bowler',
          battingStyle: 'Left-handed',
          bowlingStyle: 'Left-arm medium-fast',
          nationality: 'Indian',
          age: 26,
          stats: {
            batting: {
              matches: 14,
              runs: 0,
              average: 0,
              strikeRate: 0,
              fifties: 0,
              hundreds: 0
            },
            bowling: {
              matches: 14,
              wickets: 19,
              economy: 7.15
            }
          }
        }
      ];
      
      await mysqlDbService.storePlayers(defaultPlayers);
      console.log('Players initialized successfully.');
    }
    
    // If we don't have matches data, fetch from IPL website
    if (!matches || matches.length === 0) {
      console.log('No matches found in database. Fetching from IPL website...');
      
      try {
        // Fetch match data from IPL website
        const iplMatches = await dataFetchService.fetchIPLMatches();
        
        // Store in database
        await mysqlDbService.storeMatches(iplMatches);
        
        console.log(`Successfully fetched and stored ${iplMatches.length} matches.`);
      } catch (error) {
        console.error('Error fetching matches from IPL website:', error);
        console.log('Using mock data instead...');
        
        // If fetching fails, use mock data
        const mockMatches = generateMockMatches();
        await mysqlDbService.storeMatches(mockMatches);
        
        console.log(`Successfully stored ${mockMatches.length} mock matches.`);
      }
    }
    
    console.log('Database initialization complete.');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

/**
 * Generate mock matches data if fetching from IPL website fails
 * @returns {Array} - Array of mock match objects
 */
const generateMockMatches = () => {
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
    let homeTeamId = Math.floor(Math.random() * 10) + 1;
    let awayTeamId = Math.floor(Math.random() * 10) + 1;
    while (awayTeamId === homeTeamId) {
      awayTeamId = Math.floor(Math.random() * 10) + 1;
    }
    
    // Select a random venue based on home team
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
    const venueIndex = (homeTeamId - 1) % venues.length;
    
    // Determine if the match is in the past, and if so, generate a result
    const isPastMatch = matchDate < new Date();
    
    let match = {
      id: i + 1,
      matchNumber: i + 1,
      season: 2025,
      date: matchDate.toISOString(),
      venue: venues[venueIndex],
      homeTeamId: homeTeamId,
      awayTeamId: awayTeamId,
      status: isPastMatch ? 'Completed' : 'Upcoming',
    };
    
    // For completed matches, add result information
    if (isPastMatch) {
      // Randomly determine winner
      const homeTeamWon = Math.random() > 0.5;
      const winnerTeamId = homeTeamWon ? homeTeamId : awayTeamId;
      
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
          ? `Home team won by ${homeTeamRuns - awayTeamRuns} runs`
          : `Away team won by ${10 - awayTeamWickets} wickets`,
        tossWinner: Math.random() > 0.5 ? homeTeamId : awayTeamId,
        tossDecision: Math.random() > 0.5 ? 'bat' : 'field'
      };
    }
    
    matches.push(match);
  }
  
  return matches;
};

export default initializeDatabase;
