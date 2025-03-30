import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import dbService from '../../services/dbService';
import { formatMatchDate, formatMatchTime } from '../../utils/dataParser';
import Scorecard from './Scorecard';
import KeyMoments from './KeyMoments';
import theme from '../../utils/theme';

const MatchDetailsContainer = styled.div`
  padding: 2rem;
`;

const BreadcrumbNav = styled.div`
  margin-bottom: 1.5rem;
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 0.5rem;
    color: ${props => props.theme.colors.darkGray};
  }
`;

const MatchHeader = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const MatchInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const MatchTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
`;

const MatchMetadata = styled.div`
  color: ${props => props.theme.colors.darkGray};
  
  div {
    margin-bottom: 0.25rem;
  }
  
  strong {
    color: ${props => props.theme.colors.primary};
  }
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const TeamLogo = styled.div`
  width: 100px;
  height: 100px;
  background-color: ${props => props.color || props.theme.colors.lightGray};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;
  
  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
  }
  
  span {
    font-weight: bold;
    font-size: 2rem;
    color: white;
  }
`;

const TeamName = styled.div`
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const TeamScore = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.winner ? props.theme.colors.secondary : props.theme.colors.darkGray};
`;

const VersusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem;
`;

const VersusText = styled.div`
  font-weight: bold;
  color: ${props => props.theme.colors.secondary};
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const MatchResult = styled.div`
  text-align: center;
  font-weight: bold;
  color: ${props => props.theme.colors.secondary};
  margin-top: 1.5rem;
  font-size: 1.2rem;
`;

const TabsContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabsNav = styled.div`
  display: flex;
  border-bottom: 2px solid ${props => props.theme.colors.lightGray};
  margin-bottom: 1.5rem;
  overflow-x: auto;
`;

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.secondary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.secondary : props.theme.colors.darkGray};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
`;

const TabContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 3rem;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.darkGray};
`;

const ErrorMessage = styled.div`
  background-color: #FEE;
  color: ${props => props.theme.colors.secondary};
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const MatchDetails = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('scorecard');
  
  // Function to get team logo path
  const getTeamLogoPath = (teamShortName) => {
    const logoFilename = theme.TEAM_LOGO_MAP[teamShortName] || 'default.png';
    return `${process.env.PUBLIC_URL}${theme.ASSETS_PATH.TEAMS}${logoFilename}`;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch match details and teams from the database
        const [dbMatch, dbTeams] = await Promise.all([
          dbService.getMatchById(parseInt(id)),
          dbService.getAllTeams()
        ]);
        
        if (!dbMatch) {
          setError('Match not found in database');
          setLoading(false);
          return;
        }
        
        setMatch(dbMatch);
        
        // If no teams found in database, use default teams
        if (!dbTeams || dbTeams.length === 0) {
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
            { id: 10, name: 'Lucknow Super Giants', shortName: 'LSG', color: '#A72056' }
          ];
          setTeams(defaultTeams);
        } else {
          setTeams(dbTeams);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load match details. Please try again later.');
        setLoading(false);
        console.error('Error fetching match details:', err);
      }
    };
    
    fetchData();
  }, [id]);
  
  // Get team by ID
  const getTeam = (teamId) => {
    return teams.find(team => team.id === teamId) || {};
  };
  
  // Render the teams and scores section
  const renderTeamsSection = () => {
    const homeTeam = getTeam(match.homeTeamId);
    const awayTeam = getTeam(match.awayTeamId);
    
    if (!homeTeam || !awayTeam) return null;
    
    // Determine the winner (if match is completed)
    const isCompleted = match.status === 'COMPLETED';
    const homeTeamWon = isCompleted && match.winningTeamId === homeTeam.id;
    const awayTeamWon = isCompleted && match.winningTeamId === awayTeam.id;
    
    return (
      <TeamsContainer>
        <TeamInfo>
          <TeamLogo color={homeTeam.color}>
            <img 
              src={getTeamLogoPath(homeTeam.shortName)} 
              alt={`${homeTeam.name} logo`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<span>${homeTeam.shortName}</span>`;
              }}
            />
          </TeamLogo>
          <TeamName>{homeTeam.name}</TeamName>
          {isCompleted && (
            <TeamScore winner={homeTeamWon}>
              {match.homeTeamScore}/{match.homeTeamWickets}
              {match.homeTeamOvers > 0 && ` (${match.homeTeamOvers})`}
            </TeamScore>
          )}
        </TeamInfo>
        
        <VersusContainer>
          <VersusText>VS</VersusText>
          {!isCompleted && (
            <div>{formatMatchTime(match.scheduledStartTime)}</div>
          )}
        </VersusContainer>
        
        <TeamInfo>
          <TeamLogo color={awayTeam.color}>
            <img 
              src={getTeamLogoPath(awayTeam.shortName)} 
              alt={`${awayTeam.name} logo`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = `<span>${awayTeam.shortName}</span>`;
              }}
            />
          </TeamLogo>
          <TeamName>{awayTeam.name}</TeamName>
          {isCompleted && (
            <TeamScore winner={awayTeamWon}>
              {match.awayTeamScore}/{match.awayTeamWickets}
              {match.awayTeamOvers > 0 && ` (${match.awayTeamOvers})`}
            </TeamScore>
          )}
        </TeamInfo>
      </TeamsContainer>
    );
  };
  
  if (loading) {
    return <LoadingMessage>Loading match details...</LoadingMessage>;
  }
  
  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }
  
  if (!match) {
    return <ErrorMessage>Match not found</ErrorMessage>;
  }
  
  return (
    <MatchDetailsContainer>
      <BreadcrumbNav>
        <Link to="/matches">Matches</Link>
        <span>/</span>
        <span>Match #{id}</span>
      </BreadcrumbNav>
      
      <MatchHeader>
        <MatchInfo>
          <div>
            <MatchTitle>Crichattric Match #{id}</MatchTitle>
            <MatchMetadata>
              <div><strong>Date:</strong> {formatMatchDate(match.date)}</div>
              <div><strong>Time:</strong> {formatMatchTime(match.date)}</div>
              <div><strong>Venue:</strong> {match.venue}</div>
              {match.tossWinner && (
                <div>
                  <strong>Toss:</strong> {getTeam(match.tossWinner).name} won and elected to {match.tossDecision}
                </div>
              )}
            </MatchMetadata>
          </div>
        </MatchInfo>
        
        {renderTeamsSection()}
        
        {match.result && <MatchResult>{match.result}</MatchResult>}
      </MatchHeader>
      
      <TabsContainer>
        <TabsNav>
          <TabButton 
            active={activeTab === 'scorecard'} 
            onClick={() => setActiveTab('scorecard')}
          >
            Scorecard
          </TabButton>
          <TabButton 
            active={activeTab === 'key-moments'} 
            onClick={() => setActiveTab('key-moments')}
          >
            Key Moments
          </TabButton>
          <TabButton 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')}
          >
            Match Stats
          </TabButton>
          <TabButton 
            active={activeTab === 'ai-insights'} 
            onClick={() => setActiveTab('ai-insights')}
          >
            AI Insights
          </TabButton>
        </TabsNav>
        
        <TabContent>
          {activeTab === 'scorecard' && (
            <Scorecard match={match} homeTeam={getTeam(match.homeTeamId)} awayTeam={getTeam(match.awayTeamId)} />
          )}
          
          {activeTab === 'key-moments' && (
            <KeyMoments match={match} homeTeam={getTeam(match.homeTeamId)} awayTeam={getTeam(match.awayTeamId)} />
          )}
          
          {activeTab === 'stats' && (
            <div>
              <h2>Match Statistics</h2>
              <p>Detailed match statistics will be available here.</p>
            </div>
          )}
          
          {activeTab === 'ai-insights' && (
            <div>
              <h2>AI Insights</h2>
              <p>AI-powered insights and analysis for this match will be available here.</p>
            </div>
          )}
        </TabContent>
      </TabsContainer>
    </MatchDetailsContainer>
  );
};

export default MatchDetails;
