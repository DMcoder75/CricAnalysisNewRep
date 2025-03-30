import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const KeyMomentsContainer = styled.div``;

const SectionTitle = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.theme.colors.lightGray};
`;

const Timeline = styled.div`
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    left: 20px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: ${props => props.theme.colors.lightGray};
  }
`;

const MomentCard = styled.div`
  position: relative;
  margin-left: 50px;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: ${props => props.theme.colors.tertiary};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  &:before {
    content: '';
    position: absolute;
    left: -30px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${props => props.highlight ? props.theme.colors.secondary : props.theme.colors.primary};
    border: 3px solid white;
    z-index: 1;
  }
  
  &:after {
    content: '';
    position: absolute;
    left: -14px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    width: 14px;
    height: 14px;
    background-color: ${props => props.theme.colors.tertiary};
  }
`;

const MomentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
`;

const MomentTitle = styled.h4`
  margin: 0;
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
`;

const MomentTime = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.darkGray};
`;

const MomentDescription = styled.p`
  margin-bottom: 0.75rem;
`;

const PlayerTag = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  text-decoration: none;
  
  &:hover {
    background-color: #001F3B;
    text-decoration: none;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.darkGray};
`;

const KeyMoments = ({ match, homeTeam, awayTeam }) => {
  // Mock data for key moments
  const mockKeyMoments = [
    {
      id: 1,
      title: 'Powerplay Dominance',
      time: 'Overs 1-6',
      description: 'Mumbai Indians got off to a flying start, scoring 62 runs without losing a wicket in the powerplay. Rohit Sharma was particularly aggressive, hitting 3 fours and 2 sixes in this phase.',
      players: [
        { id: 1, name: 'Rohit Sharma' },
        { id: 2, name: 'Ishan Kishan' }
      ],
      highlight: false
    },
    {
      id: 2,
      title: 'First Wicket',
      time: 'Over 6.4',
      description: 'Josh Hazlewood provided the breakthrough for RCB by dismissing Rohit Sharma, caught by Glenn Maxwell at long-on for 45 off 32 balls.',
      players: [
        { id: 1, name: 'Rohit Sharma' },
        { id: 8, name: 'Josh Hazlewood' },
        { id: 11, name: 'Glenn Maxwell' }
      ],
      highlight: false
    },
    {
      id: 3,
      title: 'SKY\'s Explosive Fifty',
      time: 'Over 14.2',
      description: 'Suryakumar Yadav brought up his fifty in just 29 balls with a massive six over deep midwicket off Wanindu Hasaranga.',
      players: [
        { id: 3, name: 'Suryakumar Yadav' },
        { id: 13, name: 'Wanindu Hasaranga' }
      ],
      highlight: true
    },
    {
      id: 4,
      title: 'Final Flourish',
      time: 'Overs 18-20',
      description: 'Mumbai Indians scored 52 runs in the final three overs, with Hardik Pandya and Tilak Varma hitting 5 sixes between them to propel the score past 200.',
      players: [
        { id: 5, name: 'Hardik Pandya' },
        { id: 4, name: 'Tilak Varma' }
      ],
      highlight: false
    },
    {
      id: 5,
      title: 'Kohli\'s Quick Start',
      time: 'Overs 1-5',
      description: 'Virat Kohli got RCB off to a flying start in the chase, scoring 38 runs in the first 5 overs, including 5 boundaries and a six over extra cover.',
      players: [
        { id: 9, name: 'Virat Kohli' }
      ],
      highlight: false
    },
    {
      id: 6,
      title: 'Bumrah\'s Double-Strike',
      time: 'Over 11.2 & 11.6',
      description: 'Jasprit Bumrah turned the match in Mumbai\'s favor with two wickets in the same over, dismissing Rajat Patidar and troubling the incoming batsmen with his yorkers.',
      players: [
        { id: 7, name: 'Jasprit Bumrah' },
        { id: 12, name: 'Rajat Patidar' }
      ],
      highlight: true
    },
    {
      id: 7,
      title: 'Maxwell\'s Counter-attack',
      time: 'Overs 13-16',
      description: 'Glenn Maxwell launched a counter-attack against Mumbai\'s spinners, hitting three consecutive sixes off Piyush Chawla in the 15th over to keep RCB in the hunt.',
      players: [
        { id: 11, name: 'Glenn Maxwell' },
        { id: 14, name: 'Piyush Chawla' }
      ],
      highlight: false
    },
    {
      id: 8,
      title: 'The Final Over Drama',
      time: 'Over 20',
      description: 'With 24 runs needed off the final over, Dinesh Karthik hit a six and a four before being caught in the deep, effectively ending RCB\'s chances as they fell short by 23 runs.',
      players: [
        { id: 15, name: 'Dinesh Karthik' },
        { id: 7, name: 'Jasprit Bumrah' }
      ],
      highlight: true
    }
  ];
  
  // If match is upcoming, show a message
  if (match.status === 'Upcoming') {
    return (
      <NoDataMessage>
        <p>This match hasn't started yet. Key moments will be available once the match begins.</p>
      </NoDataMessage>
    );
  }
  
  return (
    <KeyMomentsContainer>
      <SectionTitle>Key Moments</SectionTitle>
      
      <Timeline>
        {mockKeyMoments.map(moment => (
          <MomentCard key={moment.id} highlight={moment.highlight}>
            <MomentHeader>
              <MomentTitle>{moment.title}</MomentTitle>
              <MomentTime>{moment.time}</MomentTime>
            </MomentHeader>
            
            <MomentDescription>{moment.description}</MomentDescription>
            
            <div>
              {moment.players.map(player => (
                <PlayerTag key={player.id} to={`/players/${player.id}`}>
                  {player.name}
                </PlayerTag>
              ))}
            </div>
          </MomentCard>
        ))}
      </Timeline>
    </KeyMomentsContainer>
  );
};

export default KeyMoments;
