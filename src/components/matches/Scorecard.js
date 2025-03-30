import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const ScorecardContainer = styled.div``;

const TeamInnings = styled.div`
  margin-bottom: 2rem;
`;

const InningsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${props => props.theme.colors.lightGray};
`;

const TeamName = styled.h3`
  color: ${props => props.theme.colors.primary};
  margin: 0;
`;

const TeamScore = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
`;

const BattingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  
  th {
    text-align: left;
    padding: 0.75rem;
    background-color: ${props => props.theme.colors.lightGray};
    color: ${props => props.theme.colors.primary};
    font-weight: bold;
  }
  
  td {
    padding: 0.75rem;
    border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  .numeric {
    text-align: right;
  }
  
  .player-name {
    font-weight: 500;
  }
  
  .dismissal {
    color: ${props => props.theme.colors.darkGray};
    font-size: 0.9rem;
  }
`;

const BowlingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th {
    text-align: left;
    padding: 0.75rem;
    background-color: ${props => props.theme.colors.lightGray};
    color: ${props => props.theme.colors.primary};
    font-weight: bold;
  }
  
  td {
    padding: 0.75rem;
    border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  .numeric {
    text-align: right;
  }
  
  .player-name {
    font-weight: 500;
  }
`;

const ExtrasInfo = styled.div`
  margin: 1rem 0;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.darkGray};
`;

const FallOfWickets = styled.div`
  margin: 1rem 0;
  font-size: 0.9rem;
  
  h4 {
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.primary};
  }
  
  span {
    margin-right: 1rem;
  }
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${props => props.theme.colors.darkGray};
`;

const Scorecard = ({ match, homeTeam, awayTeam }) => {
  // Mock data for batting scorecard
  const mockBattingData = {
    homeTeam: [
      { id: 1, name: 'Rohit Sharma', dismissal: 'c Maxwell b Hazlewood', runs: 45, balls: 32, fours: 4, sixes: 2, strikeRate: 140.63 },
      { id: 2, name: 'Ishan Kishan', dismissal: 'b Siraj', runs: 32, balls: 25, fours: 3, sixes: 1, strikeRate: 128.00 },
      { id: 3, name: 'Suryakumar Yadav', dismissal: 'c Kohli b Chahal', runs: 68, balls: 39, fours: 5, sixes: 4, strikeRate: 174.36 },
      { id: 4, name: 'Tilak Varma', dismissal: 'not out', runs: 37, balls: 22, fours: 2, sixes: 2, strikeRate: 168.18 },
      { id: 5, name: 'Hardik Pandya', dismissal: 'not out', runs: 28, balls: 12, fours: 2, sixes: 2, strikeRate: 233.33 },
      { id: 6, name: 'Tim David', dismissal: 'did not bat', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
      { id: 7, name: 'Nehal Wadhera', dismissal: 'did not bat', runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0 },
    ],
    awayTeam: [
      { id: 1, name: 'Virat Kohli', dismissal: 'c Ishan b Bumrah', runs: 42, balls: 28, fours: 5, sixes: 1, strikeRate: 150.00 },
      { id: 2, name: 'Faf du Plessis', dismissal: 'run out (Hardik)', runs: 24, balls: 18, fours: 3, sixes: 0, strikeRate: 133.33 },
      { id: 3, name: 'Glenn Maxwell', dismissal: 'lbw b Piyush Chawla', runs: 56, balls: 32, fours: 4, sixes: 3, strikeRate: 175.00 },
      { id: 4, name: 'Rajat Patidar', dismissal: 'c Tilak b Bumrah', runs: 12, balls: 10, fours: 1, sixes: 0, strikeRate: 120.00 },
      { id: 5, name: 'Dinesh Karthik', dismissal: 'c Rohit b Jasprit Bumrah', runs: 30, balls: 18, fours: 3, sixes: 1, strikeRate: 166.67 },
      { id: 6, name: 'Mahipal Lomror', dismissal: 'not out', runs: 18, balls: 10, fours: 1, sixes: 1, strikeRate: 180.00 },
      { id: 7, name: 'Wanindu Hasaranga', dismissal: 'not out', runs: 5, balls: 4, fours: 0, sixes: 0, strikeRate: 125.00 },
    ]
  };
  
  // Mock data for bowling scorecard
  const mockBowlingData = {
    homeTeam: [
      { id: 1, name: 'Mohammed Siraj', overs: 4, maidens: 0, runs: 42, wickets: 1, economy: 10.50 },
      { id: 2, name: 'Josh Hazlewood', overs: 4, maidens: 0, runs: 38, wickets: 1, economy: 9.50 },
      { id: 3, name: 'Wanindu Hasaranga', overs: 4, maidens: 0, runs: 48, wickets: 0, economy: 12.00 },
      { id: 4, name: 'Harshal Patel', overs: 4, maidens: 0, runs: 43, wickets: 0, economy: 10.75 },
      { id: 5, name: 'Yuzvendra Chahal', overs: 4, maidens: 0, runs: 39, wickets: 1, economy: 9.75 },
    ],
    awayTeam: [
      { id: 1, name: 'Jasprit Bumrah', overs: 4, maidens: 0, runs: 23, wickets: 3, economy: 5.75 },
      { id: 2, name: 'Jason Behrendorff', overs: 4, maidens: 0, runs: 37, wickets: 0, economy: 9.25 },
      { id: 3, name: 'Piyush Chawla', overs: 4, maidens: 0, runs: 33, wickets: 1, economy: 8.25 },
      { id: 4, name: 'Akash Madhwal', overs: 4, maidens: 0, runs: 42, wickets: 0, economy: 10.50 },
      { id: 5, name: 'Hardik Pandya', overs: 4, maidens: 0, runs: 45, wickets: 0, economy: 11.25 },
    ]
  };
  
  // Mock extras data
  const mockExtras = {
    homeTeam: { byes: 2, legByes: 4, wides: 8, noBalls: 1, total: 15 },
    awayTeam: { byes: 1, legByes: 3, wides: 5, noBalls: 2, total: 11 }
  };
  
  // Mock fall of wickets
  const mockFallOfWickets = {
    homeTeam: [
      { wicket: 1, score: 58, player: 'Rohit Sharma', overs: '6.4' },
      { wicket: 2, score: 96, player: 'Ishan Kishan', overs: '10.1' },
      { wicket: 3, score: 182, player: 'Suryakumar Yadav', overs: '17.3' },
    ],
    awayTeam: [
      { wicket: 1, score: 45, player: 'Faf du Plessis', overs: '5.2' },
      { wicket: 2, score: 72, player: 'Virat Kohli', overs: '8.4' },
      { wicket: 3, score: 92, player: 'Rajat Patidar', overs: '11.2' },
      { wicket: 4, score: 152, player: 'Glenn Maxwell', overs: '16.1' },
      { wicket: 5, score: 178, player: 'Dinesh Karthik', overs: '18.3' },
    ]
  };
  
  // If match is upcoming, show a message
  if (match.status === 'Upcoming') {
    return (
      <NoDataMessage>
        <p>This match hasn't started yet. Scorecard will be available once the match begins.</p>
      </NoDataMessage>
    );
  }
  
  return (
    <ScorecardContainer>
      {/* Home Team Innings */}
      <TeamInnings>
        <InningsHeader>
          <TeamName>{homeTeam.name || 'Home Team'} - 1st Innings</TeamName>
          <TeamScore>{match.homeTeamScore || '210/3 (20 overs)'}</TeamScore>
        </InningsHeader>
        
        <BattingTable>
          <thead>
            <tr>
              <th>Batter</th>
              <th></th>
              <th className="numeric">R</th>
              <th className="numeric">B</th>
              <th className="numeric">4s</th>
              <th className="numeric">6s</th>
              <th className="numeric">SR</th>
            </tr>
          </thead>
          <tbody>
            {mockBattingData.homeTeam.map(batter => (
              <tr key={batter.id}>
                <td className="player-name">
                  <Link to={`/players/${batter.id}`}>{batter.name}</Link>
                </td>
                <td className="dismissal">{batter.dismissal}</td>
                <td className="numeric">{batter.runs}</td>
                <td className="numeric">{batter.balls}</td>
                <td className="numeric">{batter.fours}</td>
                <td className="numeric">{batter.sixes}</td>
                <td className="numeric">{batter.strikeRate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </BattingTable>
        
        <ExtrasInfo>
          <strong>Extras:</strong> {mockExtras.homeTeam.total} (b {mockExtras.homeTeam.byes}, lb {mockExtras.homeTeam.legByes}, w {mockExtras.homeTeam.wides}, nb {mockExtras.homeTeam.noBalls})
        </ExtrasInfo>
        
        <FallOfWickets>
          <h4>Fall of Wickets</h4>
          {mockFallOfWickets.homeTeam.map((fow, index) => (
            <span key={index}>
              {fow.wicket}-{fow.score} ({fow.player}, {fow.overs} ov)
            </span>
          ))}
        </FallOfWickets>
        
        <BowlingTable>
          <thead>
            <tr>
              <th>Bowler</th>
              <th className="numeric">O</th>
              <th className="numeric">M</th>
              <th className="numeric">R</th>
              <th className="numeric">W</th>
              <th className="numeric">Econ</th>
            </tr>
          </thead>
          <tbody>
            {mockBowlingData.awayTeam.map(bowler => (
              <tr key={bowler.id}>
                <td className="player-name">
                  <Link to={`/players/${bowler.id}`}>{bowler.name}</Link>
                </td>
                <td className="numeric">{bowler.overs}</td>
                <td className="numeric">{bowler.maidens}</td>
                <td className="numeric">{bowler.runs}</td>
                <td className="numeric">{bowler.wickets}</td>
                <td className="numeric">{bowler.economy.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </BowlingTable>
      </TeamInnings>
      
      {/* Away Team Innings */}
      <TeamInnings>
        <InningsHeader>
          <TeamName>{awayTeam.name || 'Away Team'} - 1st Innings</TeamName>
          <TeamScore>{match.awayTeamScore || '187/5 (20 overs)'}</TeamScore>
        </InningsHeader>
        
        <BattingTable>
          <thead>
            <tr>
              <th>Batter</th>
              <th></th>
              <th className="numeric">R</th>
              <th className="numeric">B</th>
              <th className="numeric">4s</th>
              <th className="numeric">6s</th>
              <th className="numeric">SR</th>
            </tr>
          </thead>
          <tbody>
            {mockBattingData.awayTeam.map(batter => (
              <tr key={batter.id}>
                <td className="player-name">
                  <Link to={`/players/${batter.id}`}>{batter.name}</Link>
                </td>
                <td className="dismissal">{batter.dismissal}</td>
                <td className="numeric">{batter.runs}</td>
                <td className="numeric">{batter.balls}</td>
                <td className="numeric">{batter.fours}</td>
                <td className="numeric">{batter.sixes}</td>
                <td className="numeric">{batter.strikeRate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </BattingTable>
        
        <ExtrasInfo>
          <strong>Extras:</strong> {mockExtras.awayTeam.total} (b {mockExtras.awayTeam.byes}, lb {mockExtras.awayTeam.legByes}, w {mockExtras.awayTeam.wides}, nb {mockExtras.awayTeam.noBalls})
        </ExtrasInfo>
        
        <FallOfWickets>
          <h4>Fall of Wickets</h4>
          {mockFallOfWickets.awayTeam.map((fow, index) => (
            <span key={index}>
              {fow.wicket}-{fow.score} ({fow.player}, {fow.overs} ov)
            </span>
          ))}
        </FallOfWickets>
        
        <BowlingTable>
          <thead>
            <tr>
              <th>Bowler</th>
              <th className="numeric">O</th>
              <th className="numeric">M</th>
              <th className="numeric">R</th>
              <th className="numeric">W</th>
              <th className="numeric">Econ</th>
            </tr>
          </thead>
          <tbody>
            {mockBowlingData.homeTeam.map(bowler => (
              <tr key={bowler.id}>
                <td className="player-name">
                  <Link to={`/players/${bowler.id}`}>{bowler.name}</Link>
                </td>
                <td className="numeric">{bowler.overs}</td>
                <td className="numeric">{bowler.maidens}</td>
                <td className="numeric">{bowler.runs}</td>
                <td className="numeric">{bowler.wickets}</td>
                <td className="numeric">{bowler.economy.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </BowlingTable>
      </TeamInnings>
    </ScorecardContainer>
  );
};

export default Scorecard;
