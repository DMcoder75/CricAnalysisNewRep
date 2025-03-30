/**
 * Test match data for Zimbabwe A vs Durham
 * This file contains mock data for testing the live match feature
 */

const testMatchData = {
  match: {
    id: 'zim-a-vs-durham-2025',
    name: 'Zimbabwe A vs Durham, 2nd Match',
    matchType: 'ODI',
    status: 'Live',
    venue: 'Harare Sports Club, Harare',
    date: '2025-03-18T09:30:00.000Z',
    teams: [
      {
        id: 'zim-a',
        name: 'Zimbabwe A',
        shortName: 'ZIM A',
        color: '#C01D2E'
      },
      {
        id: 'durham',
        name: 'Durham',
        shortName: 'DURH',
        color: '#0A2240'
      }
    ]
  },
  innings: [
    {
      id: 1,
      teamId: 'zim-a',
      inningNumber: 1,
      runs: 248,
      wickets: 10,
      overs: 49.5,
      balls: [
        {
          id: 1,
          over_number: 47.1,
          batsmanId: 'zim-a-batsman-1',
          bowlerId: 'durham-bowler-1',
          runs: 1,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Takudzwanashe Kaitano takes a single'
        },
        {
          id: 2,
          over_number: 47.2,
          batsmanId: 'zim-a-batsman-2',
          bowlerId: 'durham-bowler-1',
          runs: 4,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Clive Madande hits a boundary through covers'
        },
        {
          id: 3,
          over_number: 47.3,
          batsmanId: 'zim-a-batsman-2',
          bowlerId: 'durham-bowler-1',
          runs: 0,
          extras: 0,
          extras_type: 'none',
          wicket: true,
          wicket_type: 'caught',
          dismissed_player_id: 'zim-a-batsman-2',
          commentary: 'Clive Madande caught at mid-off!'
        },
        {
          id: 4,
          over_number: 47.4,
          batsmanId: 'zim-a-batsman-3',
          bowlerId: 'durham-bowler-1',
          runs: 0,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Dot ball'
        },
        {
          id: 5,
          over_number: 47.5,
          batsmanId: 'zim-a-batsman-3',
          bowlerId: 'durham-bowler-1',
          runs: 2,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Brian Bennett takes two runs'
        },
        {
          id: 6,
          over_number: 48.0,
          batsmanId: 'zim-a-batsman-3',
          bowlerId: 'durham-bowler-1',
          runs: 1,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Brian Bennett takes a single to keep strike'
        },
        {
          id: 7,
          over_number: 48.1,
          batsmanId: 'zim-a-batsman-3',
          bowlerId: 'durham-bowler-2',
          runs: 6,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'SIX! Brian Bennett hits it over long-on!'
        },
        {
          id: 8,
          over_number: 48.2,
          batsmanId: 'zim-a-batsman-3',
          bowlerId: 'durham-bowler-2',
          runs: 0,
          extras: 1,
          extras_type: 'wide',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Wide ball'
        },
        {
          id: 9,
          over_number: 48.2,
          batsmanId: 'zim-a-batsman-3',
          bowlerId: 'durham-bowler-2',
          runs: 1,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Brian Bennett takes a single'
        },
        {
          id: 10,
          over_number: 48.3,
          batsmanId: 'zim-a-batsman-1',
          bowlerId: 'durham-bowler-2',
          runs: 0,
          extras: 0,
          extras_type: 'none',
          wicket: true,
          wicket_type: 'bowled',
          dismissed_player_id: 'zim-a-batsman-1',
          commentary: 'BOWLED! Takudzwanashe Kaitano is clean bowled!'
        }
      ]
    },
    {
      id: 2,
      teamId: 'durham',
      inningNumber: 2,
      runs: 187,
      wickets: 6,
      overs: 38.2,
      balls: [
        {
          id: 11,
          over_number: 37.1,
          batsmanId: 'durham-batsman-1',
          bowlerId: 'zim-a-bowler-1',
          runs: 1,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Alex Lees takes a single'
        },
        {
          id: 12,
          over_number: 37.2,
          batsmanId: 'durham-batsman-2',
          bowlerId: 'zim-a-bowler-1',
          runs: 4,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Graham Clark hits a boundary through point'
        },
        {
          id: 13,
          over_number: 37.3,
          batsmanId: 'durham-batsman-2',
          bowlerId: 'zim-a-bowler-1',
          runs: 0,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Dot ball'
        },
        {
          id: 14,
          over_number: 37.4,
          batsmanId: 'durham-batsman-2',
          bowlerId: 'zim-a-bowler-1',
          runs: 2,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'Graham Clark takes two runs'
        },
        {
          id: 15,
          over_number: 37.5,
          batsmanId: 'durham-batsman-2',
          bowlerId: 'zim-a-bowler-1',
          runs: 0,
          extras: 0,
          extras_type: 'none',
          wicket: true,
          wicket_type: 'lbw',
          dismissed_player_id: 'durham-batsman-2',
          commentary: 'LBW! Graham Clark is out leg before wicket!'
        },
        {
          id: 16,
          over_number: 38.0,
          batsmanId: 'durham-batsman-3',
          bowlerId: 'zim-a-bowler-1',
          runs: 0,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'David Bedingham defends'
        },
        {
          id: 17,
          over_number: 38.1,
          batsmanId: 'durham-batsman-3',
          bowlerId: 'zim-a-bowler-2',
          runs: 1,
          extras: 0,
          extras_type: 'none',
          wicket: false,
          wicket_type: 'none',
          dismissed_player_id: null,
          commentary: 'David Bedingham takes a single'
        },
        {
          id: 18,
          over_number: 38.2,
          batsmanId: 'durham-batsman-1',
          bowlerId: 'zim-a-bowler-2',
          runs: 0,
          extras: 0,
          extras_type: 'none',
          wicket: true,
          wicket_type: 'caught',
          dismissed_player_id: 'durham-batsman-1',
          commentary: 'CAUGHT! Alex Lees is caught at mid-wicket!'
        }
      ]
    }
  ],
  players: {
    'zim-a-batsman-1': { name: 'Takudzwanashe Kaitano', teamId: 'zim-a' },
    'zim-a-batsman-2': { name: 'Clive Madande', teamId: 'zim-a' },
    'zim-a-batsman-3': { name: 'Brian Bennett', teamId: 'zim-a' },
    'zim-a-bowler-1': { name: 'Tendai Chatara', teamId: 'zim-a' },
    'zim-a-bowler-2': { name: 'Blessing Muzarabani', teamId: 'zim-a' },
    'durham-batsman-1': { name: 'Alex Lees', teamId: 'durham' },
    'durham-batsman-2': { name: 'Graham Clark', teamId: 'durham' },
    'durham-batsman-3': { name: 'David Bedingham', teamId: 'durham' },
    'durham-bowler-1': { name: 'Ben Raine', teamId: 'durham' },
    'durham-bowler-2': { name: 'Matthew Potts', teamId: 'durham' }
  }
};

export default testMatchData;
