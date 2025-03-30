/**
 * Fallback Data for Crichattric
 * Used when API calls fail
 */

export const fallbackMatches = [
  {
    id: 'fallback-1',
    name: 'Chennai Super Kings vs Mumbai Indians',
    matchType: 'T20',
    status: 'Chennai Super Kings won by 5 wickets',
    venue: 'M.A. Chidambaram Stadium, Chennai',
    date: new Date().toISOString(),
    teams: {
      team1: {
        name: 'Chennai Super Kings',
        shortname: 'CSK',
        logo: 'https://static.cricbuzz.com/img/teams/5_flag.png'
      },
      team2: {
        name: 'Mumbai Indians',
        shortname: 'MI',
        logo: 'https://static.cricbuzz.com/img/teams/6_flag.png'
      }
    },
    score: {
      team1: {
        runs: 156,
        wickets: 7,
        overs: 20
      },
      team2: {
        runs: 157,
        wickets: 5,
        overs: 19.2
      }
    }
  },
  {
    id: 'fallback-2',
    name: 'Royal Challengers Bangalore vs Kolkata Knight Riders',
    matchType: 'T20',
    status: 'Kolkata Knight Riders won by 8 wickets',
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    date: new Date().toISOString(),
    teams: {
      team1: {
        name: 'Royal Challengers Bangalore',
        shortname: 'RCB',
        logo: 'https://static.cricbuzz.com/img/teams/4_flag.png'
      },
      team2: {
        name: 'Kolkata Knight Riders',
        shortname: 'KKR',
        logo: 'https://static.cricbuzz.com/img/teams/3_flag.png'
      }
    },
    score: {
      team1: {
        runs: 148,
        wickets: 10,
        overs: 19.2
      },
      team2: {
        runs: 149,
        wickets: 2,
        overs: 16.4
      }
    }
  }
];

export const fallbackNews = [
  {
    id: 'news-fallback-1',
    title: 'MS Dhoni confirms he will play IPL 2024',
    summary: 'Chennai Super Kings captain MS Dhoni has confirmed he will return for IPL 2024, delighting fans across the world.',
    date: new Date().toISOString(),
    source: 'Crichattric News',
    url: '#',
    image: 'https://static.cricbuzz.com/img/players/dhoni_190.png'
  },
  {
    id: 'news-fallback-2',
    title: 'Virat Kohli aims for IPL title with RCB',
    summary: 'Royal Challengers Bangalore star Virat Kohli has expressed his determination to win the elusive IPL title with RCB.',
    date: new Date().toISOString(),
    source: 'Crichattric News',
    url: '#',
    image: 'https://static.cricbuzz.com/img/players/kohli_190.png'
  }
];

export const fallbackTeams = [
  {
    id: 'team-fallback-1',
    name: 'Chennai Super Kings',
    shortname: 'CSK',
    logo: 'https://static.cricbuzz.com/img/teams/5_flag.png',
    players: [
      { id: 'p1', name: 'MS Dhoni', role: 'Wicket Keeper' },
      { id: 'p2', name: 'Ravindra Jadeja', role: 'All-rounder' },
      { id: 'p3', name: 'Ruturaj Gaikwad', role: 'Batsman' }
    ]
  },
  {
    id: 'team-fallback-2',
    name: 'Mumbai Indians',
    shortname: 'MI',
    logo: 'https://static.cricbuzz.com/img/teams/6_flag.png',
    players: [
      { id: 'p4', name: 'Rohit Sharma', role: 'Batsman' },
      { id: 'p5', name: 'Jasprit Bumrah', role: 'Bowler' },
      { id: 'p6', name: 'Suryakumar Yadav', role: 'Batsman' }
    ]
  }
];

export default {
  matches: fallbackMatches,
  news: fallbackNews,
  teams: fallbackTeams
};
