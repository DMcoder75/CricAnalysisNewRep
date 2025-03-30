/**
 * Mock data for the IPL Cricket Analytics application
 * Used for frontend development and testing
 */

const mockData = {
  // Current matches data
  currentMatches: [
    {
      id: 'zim-durham',
      title: 'Zimbabwe A vs Durham',
      matchType: 'One Day',
      status: 'In Progress',
      venue: 'Queens Sports Club, Bulawayo',
      date: '2023-07-15T09:00:00Z',
      teams: {
        home: {
          id: 'zim-a',
          name: 'Zimbabwe A',
          shortName: 'ZIM',
          score: '248/7',
          overs: '50.0'
        },
        away: {
          id: 'durham',
          name: 'Durham',
          shortName: 'DUR',
          score: '187/5',
          overs: '38.2'
        }
      }
    },
    {
      id: 'ipl-csk-mi',
      title: 'Chennai Super Kings vs Mumbai Indians',
      matchType: 'T20',
      status: 'Upcoming',
      venue: 'M.A. Chidambaram Stadium, Chennai',
      date: '2023-07-20T14:00:00Z',
      teams: {
        home: {
          id: 'csk',
          name: 'Chennai Super Kings',
          shortName: 'CSK',
          score: '',
          overs: ''
        },
        away: {
          id: 'mi',
          name: 'Mumbai Indians',
          shortName: 'MI',
          score: '',
          overs: ''
        }
      }
    }
  ],

  // Teams data
  teams: [
    {
      id: 'zim-a',
      name: 'Zimbabwe A',
      shortName: 'ZIM',
      color: '#00796b',
      logo: 'zim_logo.png'
    },
    {
      id: 'durham',
      name: 'Durham',
      shortName: 'DUR',
      color: '#1565c0',
      logo: 'durham_logo.png'
    },
    {
      id: 'csk',
      name: 'Chennai Super Kings',
      shortName: 'CSK',
      color: '#FFFF00',
      logo: 'csk_logo.png'
    },
    {
      id: 'mi',
      name: 'Mumbai Indians',
      shortName: 'MI',
      color: '#004BA0',
      logo: 'mi_logo.png'
    }
  ],

  // Players data
  players: [
    // Zimbabwe A Players
    {
      id: 'zim1',
      name: 'Takudzwanashe Kaitano',
      team: 'zim-a',
      role: 'Batsman',
      battingStyle: 'Right-handed',
      bowlingStyle: 'N/A',
      nationality: 'Zimbabwe'
    },
    {
      id: 'zim2',
      name: 'Clive Madande',
      team: 'zim-a',
      role: 'Wicket-keeper',
      battingStyle: 'Right-handed',
      bowlingStyle: 'N/A',
      nationality: 'Zimbabwe'
    },
    {
      id: 'zim3',
      name: 'Brian Bennett',
      team: 'zim-a',
      role: 'Batsman',
      battingStyle: 'Right-handed',
      bowlingStyle: 'Off-spin',
      nationality: 'Zimbabwe'
    },
    {
      id: 'zim4',
      name: 'Tendai Chatara',
      team: 'zim-a',
      role: 'Bowler',
      battingStyle: 'Right-handed',
      bowlingStyle: 'Right-arm fast-medium',
      nationality: 'Zimbabwe'
    },
    {
      id: 'zim5',
      name: 'Blessing Muzarabani',
      team: 'zim-a',
      role: 'Bowler',
      battingStyle: 'Right-handed',
      bowlingStyle: 'Right-arm fast',
      nationality: 'Zimbabwe'
    },

    // Durham Players
    {
      id: 'dur1',
      name: 'Alex Lees',
      team: 'durham',
      role: 'Batsman',
      battingStyle: 'Left-handed',
      bowlingStyle: 'N/A',
      nationality: 'England'
    },
    {
      id: 'dur2',
      name: 'Graham Clark',
      team: 'durham',
      role: 'Batsman',
      battingStyle: 'Right-handed',
      bowlingStyle: 'N/A',
      nationality: 'England'
    },
    {
      id: 'dur3',
      name: 'David Bedingham',
      team: 'durham',
      role: 'Batsman',
      battingStyle: 'Right-handed',
      bowlingStyle: 'N/A',
      nationality: 'South Africa'
    },
    {
      id: 'dur4',
      name: 'Ben Raine',
      team: 'durham',
      role: 'All-rounder',
      battingStyle: 'Left-handed',
      bowlingStyle: 'Right-arm medium-fast',
      nationality: 'England'
    },
    {
      id: 'dur5',
      name: 'Matthew Potts',
      team: 'durham',
      role: 'Bowler',
      battingStyle: 'Right-handed',
      bowlingStyle: 'Right-arm medium-fast',
      nationality: 'England'
    }
  ],

  // Match statistics data
  matchStats: {
    'zim-durham': {
      id: 'zim-durham',
      title: 'Zimbabwe A vs Durham',
      status: 'In Progress',
      innings: [
        {
          inningNumber: 1,
          teamId: 'zim-a',
          overs: '50.0',
          runs: 248,
          wickets: 7,
          batting: [
            {
              id: 'zim1',
              name: 'Takudzwanashe Kaitano',
              dismissal: 'b Matthew Potts',
              runs: 45,
              balls: 62,
              fours: 4,
              sixes: 1,
              strikeRate: 72.58
            },
            {
              id: 'zim2',
              name: 'Clive Madande',
              dismissal: 'c Alex Lees b Ben Raine',
              runs: 32,
              balls: 41,
              fours: 3,
              sixes: 0,
              strikeRate: 78.05
            },
            {
              id: 'zim3',
              name: 'Brian Bennett',
              dismissal: 'not out',
              runs: 78,
              balls: 83,
              fours: 6,
              sixes: 2,
              strikeRate: 93.98
            }
          ],
          bowling: [
            {
              id: 'dur4',
              name: 'Ben Raine',
              overs: 10,
              maidens: 1,
              runs: 48,
              wickets: 3,
              economy: 4.80
            },
            {
              id: 'dur5',
              name: 'Matthew Potts',
              overs: 9.5,
              maidens: 0,
              runs: 52,
              wickets: 4,
              economy: 5.29
            }
          ],
          extras: 12,
          total: 248
        },
        {
          inningNumber: 2,
          teamId: 'durham',
          overs: '38.2',
          runs: 187,
          wickets: 5,
          batting: [
            {
              id: 'dur1',
              name: 'Alex Lees',
              dismissal: 'c Brian Bennett b Blessing Muzarabani',
              runs: 56,
              balls: 68,
              fours: 5,
              sixes: 0,
              strikeRate: 82.35
            },
            {
              id: 'dur2',
              name: 'Graham Clark',
              dismissal: 'lbw b Tendai Chatara',
              runs: 42,
              balls: 51,
              fours: 4,
              sixes: 1,
              strikeRate: 82.35
            },
            {
              id: 'dur3',
              name: 'David Bedingham',
              dismissal: 'not out',
              runs: 28,
              balls: 32,
              fours: 2,
              sixes: 0,
              strikeRate: 87.50
            }
          ],
          bowling: [
            {
              id: 'zim4',
              name: 'Tendai Chatara',
              overs: 8,
              maidens: 0,
              runs: 42,
              wickets: 3,
              economy: 5.25
            },
            {
              id: 'zim5',
              name: 'Blessing Muzarabani',
              overs: 7.2,
              maidens: 0,
              runs: 38,
              wickets: 2,
              economy: 5.18
            }
          ],
          extras: 8,
          total: 187
        }
      ],
      commentary: [
        {
          time: '15:45',
          text: 'WICKET! Tendai Chatara strikes again! Graham Clark is trapped LBW for 42. Durham now 145/3.'
        },
        {
          time: '15:32',
          text: 'Beautiful cover drive by David Bedingham, that races away to the boundary for FOUR!'
        },
        {
          time: '15:20',
          text: 'Durham are building a good partnership here. They need 103 more runs to win with 7 wickets in hand.'
        },
        {
          time: '15:05',
          text: 'DRINKS BREAK - Durham are 120/2 after 25 overs, requiring 129 more runs to win.'
        },
        {
          time: '14:52',
          text: 'WICKET! Blessing Muzarabani gets the big wicket of Alex Lees, caught by Brian Bennett for 56. Great innings comes to an end.'
        }
      ],
      currentBatsmen: [
        {
          id: 'dur3',
          name: 'David Bedingham',
          runs: 28,
          balls: 32,
          fours: 2,
          sixes: 0,
          strikeRate: 87.50
        },
        {
          id: 'dur6',
          name: 'Ollie Robinson',
          runs: 12,
          balls: 15,
          fours: 1,
          sixes: 0,
          strikeRate: 80.00
        }
      ],
      currentBowler: {
        id: 'zim5',
        name: 'Blessing Muzarabani',
        overs: 7.2,
        maidens: 0,
        runs: 38,
        wickets: 2,
        economy: 5.18
      },
      recentBalls: ['1', '0', '4', '0', 'W', '1']
    }
  },

  // Function to get live match data
  getLiveMatchData: function(matchId) {
    const match = this.currentMatches.find(m => m.id === matchId);
    if (!match) return null;
    
    const matchStats = this.matchStats[matchId];
    if (!matchStats) return match;
    
    // Combine match data with stats
    return {
      ...match,
      commentary: matchStats.commentary,
      currentBatsmen: matchStats.currentBatsmen,
      currentBowler: matchStats.currentBowler,
      recentBalls: matchStats.recentBalls
    };
  }
};

export default mockData;
