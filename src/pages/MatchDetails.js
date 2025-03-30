import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axiosClient from '../services/axiosClient';
import theme from '../utils/theme';

// Mock data for fallback
const MOCK_MATCH_DATA = {
  id: "cbc04829-bf53-480c-90b3-3ddb56507e56",
  name: "New Zealand vs Pakistan, 3rd T20I",
  matchType: "t20",
  status: "Pakistan won by 9 wkts",
  venue: "Eden Park, Auckland",
  date: "2025-03-21",
  dateTimeGMT: "2025-03-21T06:15:00",
  teams: ["New Zealand", "Pakistan"],
  teamInfo: [
    {
      name: "New Zealand",
      shortname: "NZ",
      img: "https://g.cricapi.com/iapi/57-637877076980737903.webp?w=48"
    },
    {
      name: "Pakistan",
      shortname: "PAK",
      img: "https://g.cricapi.com/iapi/66-637877075103236690.webp?w=48"
    }
  ],
  score: [
    {
      r: 204,
      w: 10,
      o: 19.5,
      inning: "New Zealand Inning 1"
    },
    {
      r: 207,
      w: 1,
      o: 16,
      inning: "Pakistan Inning 1"
    }
  ],
  tossWinner: "Pakistan",
  tossChoice: "bowl",
  matchWinner: "Pakistan",
  matchStarted: true,
  matchEnded: true
};

// Mock scorecard data for fallback
const MOCK_SCORECARD_DATA = {
  id: "cbc04829-bf53-480c-90b3-3ddb56507e56",
  name: "New Zealand vs Pakistan, 3rd T20I",
  matchType: "t20",
  status: "Pakistan won by 9 wkts",
  venue: "Eden Park, Auckland",
  date: "2025-03-21",
  dateTimeGMT: "2025-03-21T06:15:00",
  teams: ["New Zealand", "Pakistan"],
  teamInfo: [
    {
      name: "New Zealand",
      shortname: "NZ",
      img: "https://g.cricapi.com/iapi/57-637877076980737903.webp?w=48"
    },
    {
      name: "Pakistan",
      shortname: "PAK",
      img: "https://g.cricapi.com/iapi/66-637877075103236690.webp?w=48"
    }
  ],
  score: [
    {
      r: 204,
      w: 10,
      o: 19.5,
      inning: "New Zealand Inning 1"
    },
    {
      r: 207,
      w: 1,
      o: 16,
      inning: "Pakistan Inning 1"
    }
  ],
  tossWinner: "Pakistan",
  tossChoice: "bowl",
  matchWinner: "Pakistan",
  scorecard: [
    {
      batting: [
        {
          batsman: {
            id: "812fc568-a932-4f29-a1c4-b7c929e6a248",
            name: "Tim Seifert"
          },
          "dismissal-text": "c salman agha b haris rauf",
          r: 19,
          b: 9,
          "4s": 1,
          "6s": 2,
          sr: 211.11
        },
        {
          batsman: {
            id: "08924d57-b4d3-4ed0-903d-087a8384be12",
            name: "Finn Allen"
          },
          "dismissal-text": "c haris rauf b shaheen afridi",
          r: 0,
          b: 3,
          "4s": 0,
          "6s": 0,
          sr: 0
        },
        {
          batsman: {
            id: "b5208054-8543-482d-9d83-a9f0a3bbfada",
            name: "Mark Chapman"
          },
          "dismissal-text": "c shadab khan b shaheen afridi",
          r: 94,
          b: 44,
          "4s": 11,
          "6s": 4,
          sr: 213.64
        }
      ],
      bowling: [
        {
          bowler: {
            id: "df7bffbc-02e6-41ef-8049-fd256c850fe8",
            name: "Shaheen Afridi"
          },
          o: 4,
          m: 0,
          r: 36,
          w: 2,
          nb: 0,
          wd: 2,
          eco: 9
        },
        {
          bowler: {
            id: "f54c649a-71a1-4f95-80d0-59e0087b4493",
            name: "Haris Rauf"
          },
          o: 4,
          m: 0,
          r: 29,
          w: 3,
          nb: 0,
          wd: 1,
          eco: 7.2
        }
      ],
      extras: {
        r: 12,
        b: 4
      },
      inning: "New Zealand Inning 1"
    },
    {
      batting: [
        {
          batsman: {
            id: "a2cc486b-51c6-4d2d-b8b1-aba29bf4a87d",
            name: "Mohammad Haris"
          },
          "dismissal-text": "c mitchell hay b jacob duffy",
          r: 41,
          b: 20,
          "4s": 4,
          "6s": 3,
          sr: 205
        },
        {
          batsman: {
            id: "5e757ebf-be71-4652-a663-b59633e90f67",
            name: "Hasan Nawaz"
          },
          "dismissal-text": "not out",
          r: 105,
          b: 45,
          "4s": 10,
          "6s": 7,
          sr: 233.33
        }
      ],
      bowling: [
        {
          bowler: {
            id: "5673ee27-bf33-44b8-8973-41fd37923fed",
            name: "Kyle Jamieson"
          },
          o: 4,
          m: 0,
          r: 54,
          w: 0,
          nb: 0,
          wd: 3,
          eco: 13.5
        },
        {
          bowler: {
            id: "6e05cbea-6a4b-42ef-8e2e-b44e4b434c2f",
            name: "Jacob Duffy"
          },
          o: 3,
          m: 0,
          r: 37,
          w: 1,
          nb: 0,
          wd: 0,
          eco: 12.3
        }
      ],
      extras: {
        r: 10,
        b: 0
      },
      inning: "Pakistan Inning 1"
    }
  ],
  matchStarted: true,
  matchEnded: true
};

// Styled components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

const MatchTitle = styled.h1`
  margin: 0 0 1rem 0;
  color: ${props => props.theme.colors.darkGray};
  font-size: 1.75rem;
`;

const MatchInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const MatchMeta = styled.div`
  display: flex;
  flex-direction: column;
`;

const MatchVenue = styled.div`
  font-size: 1rem;
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: 0.5rem;
`;

const MatchDate = styled.div`
  font-size: 0.875rem;
  color: ${props => props.theme.colors.darkGray};
`;

const MatchStatus = styled.div`
  background-color: ${props => {
    if (props.status === 'live') return props.theme.colors.series.ongoing.bg;
    if (props.status === 'completed') return props.theme.colors.series.completed.bg;
    return props.theme.colors.series.upcoming.bg;
  }};
  color: ${props => {
    if (props.status === 'live') return props.theme.colors.series.ongoing.text;
    if (props.status === 'completed') return props.theme.colors.series.completed.text;
    return props.theme.colors.series.upcoming.text;
  }};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.875rem;
`;

const TeamsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const TeamInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align === 'left' ? 'flex-start' : 'flex-end'};
  
  @media (max-width: 768px) {
    align-items: center;
  }
`;

const TeamLogo = styled.div`
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 50%;
  }
  
  .placeholder-logo {
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 2rem;
  }
`;

const TeamName = styled.div`
  font-weight: bold;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
`;

const TeamScore = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const VersusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 1.5rem;
  
  @media (max-width: 768px) {
    margin: 0;
  }
`;

const VersusText = styled.div`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${props => props.theme.colors.darkGray};
`;

const MatchResult = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: ${props => props.theme.colors.darkGray};
  text-align: center;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  margin-bottom: 2rem;
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.darkGray};
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const TabContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  background-color: #fff3f3;
  border: 1px solid #ffcccb;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #d32f2f;
  text-align: center;
`;

const RetryButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const MatchDetails = () => {
  const { slug } = useParams();
  const [match, setMatch] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('scorecard');
  const [activeInningsTab, setActiveInningsTab] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);
  
  // Extract match ID from slug
  const extractMatchId = (slug) => {
    if (!slug) return null;
    
    // If the slug contains a hyphen followed by exactly 8 characters at the end
    // (which would be our appended ID), extract those characters
    const matches = slug.match(/-([a-zA-Z0-9]{8})$/);
    if (matches && matches[1]) {
      // Find the full UUID in the original API data
      return matches[1];
    }
    
    // If no match found, return the slug as is (fallback)
    return slug;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleString('en-US', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Fetch match details
  const fetchMatchDetails = async (retry = false) => {
    try {
      if (!retry) {
        setLoading(true);
      }
      
      // Get the partial match ID from the slug
      const partialId = extractMatchId(slug);
      if (!partialId) {
        setError('Invalid match ID');
        setLoading(false);
        return;
      }
      
      // First, fetch all current matches to find the full match ID
      const currentMatchesResponse = await axiosClient.get('currentMatches?offset=0');
      
      let fullMatchId = null;
      
      if (currentMatchesResponse.data && currentMatchesResponse.data.status === 'success' && currentMatchesResponse.data.data) {
        // Find the match with ID that contains our partial ID
        const matchData = currentMatchesResponse.data.data.find(m => m.id.includes(partialId));
        
        if (matchData) {
          fullMatchId = matchData.id;
        }
      }
      
      // If we couldn't find the match in current matches, try using the partial ID directly
      if (!fullMatchId) {
        fullMatchId = partialId;
      }
      
      // Now fetch detailed match info using the match_info endpoint
      const matchInfoResponse = await axiosClient.get(`match_info?id=${fullMatchId}`);
      
      if (matchInfoResponse.data && matchInfoResponse.data.status === 'success' && matchInfoResponse.data.data) {
        const matchData = matchInfoResponse.data.data;
        
        // Determine match status
        let status = 'upcoming';
        if (matchData.matchStarted && !matchData.matchEnded) {
          status = 'live';
        } else if (matchData.matchEnded) {
          status = 'completed';
        }
        
        // Format the match data
        const formattedMatch = {
          id: matchData.id,
          title: matchData.name,
          venue: matchData.venue || 'TBD',
          date: matchData.date || matchData.dateTimeGMT,
          status: status,
          result: matchData.status,
          tossWinner: matchData.tossWinner,
          tossChoice: matchData.tossChoice,
          matchWinner: matchData.matchWinner,
          team1: {
            name: matchData.teams && matchData.teams[0] ? matchData.teams[0] : 'Team A',
            shortName: matchData.teamInfo && matchData.teamInfo[0] ? matchData.teamInfo[0].shortname : '',
            score: matchData.score && matchData.score[0] ? `${matchData.score[0].r}/${matchData.score[0].w} (${matchData.score[0].o})` : '',
            logo: matchData.teamInfo && matchData.teamInfo[0] && matchData.teamInfo[0].img ? matchData.teamInfo[0].img : '',
            inning: matchData.score && matchData.score[0] ? matchData.score[0].inning : ''
          },
          team2: {
            name: matchData.teams && matchData.teams[1] ? matchData.teams[1] : 'Team B',
            shortName: matchData.teamInfo && matchData.teamInfo[1] ? matchData.teamInfo[1].shortname : '',
            score: matchData.score && matchData.score[1] ? `${matchData.score[1].r}/${matchData.score[1].w} (${matchData.score[1].o})` : '',
            logo: matchData.teamInfo && matchData.teamInfo[1] && matchData.teamInfo[1].img ? matchData.teamInfo[1].img : '',
            inning: matchData.score && matchData.score[1] ? matchData.score[1].inning : ''
          }
        };
        
        setMatch(formattedMatch);
        setUsingFallback(false);
        
        // If match has started, fetch the scorecard
        if (matchData.matchStarted) {
          try {
            const scorecardResponse = await axiosClient.get(`match_scorecard?id=${fullMatchId}`);
            
            if (scorecardResponse.data && scorecardResponse.data.status === 'success' && scorecardResponse.data.data) {
              setScorecard(scorecardResponse.data.data);
            } else {
              // Use mock scorecard data as fallback
              console.warn('Using mock scorecard data as fallback');
              setScorecard(MOCK_SCORECARD_DATA);
              setUsingFallback(true);
            }
          } catch (scorecardError) {
            console.error('Error fetching scorecard:', scorecardError);
            // Use mock scorecard data as fallback
            console.warn('Using mock scorecard data as fallback due to error');
            setScorecard(MOCK_SCORECARD_DATA);
            setUsingFallback(true);
          }
        }
        
        setError(null);
      } else {
        console.error('Failed to fetch match data, using fallback data');
        
        // Use mock data as fallback
        const mockData = MOCK_MATCH_DATA;
        
        // Determine match status
        let status = 'upcoming';
        if (mockData.matchStarted && !mockData.matchEnded) {
          status = 'live';
        } else if (mockData.matchEnded) {
          status = 'completed';
        }
        
        // Format the mock data
        const formattedMatch = {
          id: mockData.id,
          title: mockData.name,
          venue: mockData.venue || 'TBD',
          date: mockData.date || mockData.dateTimeGMT,
          status: status,
          result: mockData.status,
          tossWinner: mockData.tossWinner,
          tossChoice: mockData.tossChoice,
          matchWinner: mockData.matchWinner,
          team1: {
            name: mockData.teams && mockData.teams[0] ? mockData.teams[0] : 'Team A',
            shortName: mockData.teamInfo && mockData.teamInfo[0] ? mockData.teamInfo[0].shortname : '',
            score: mockData.score && mockData.score[0] ? `${mockData.score[0].r}/${mockData.score[0].w} (${mockData.score[0].o})` : '',
            logo: mockData.teamInfo && mockData.teamInfo[0] && mockData.teamInfo[0].img ? mockData.teamInfo[0].img : '',
            inning: mockData.score && mockData.score[0] ? mockData.score[0].inning : ''
          },
          team2: {
            name: mockData.teams && mockData.teams[1] ? mockData.teams[1] : 'Team B',
            shortName: mockData.teamInfo && mockData.teamInfo[1] ? mockData.teamInfo[1].shortname : '',
            score: mockData.score && mockData.score[1] ? `${mockData.score[1].r}/${mockData.score[1].w} (${mockData.score[1].o})` : '',
            logo: mockData.teamInfo && mockData.teamInfo[1] && mockData.teamInfo[1].img ? mockData.teamInfo[1].img : '',
            inning: mockData.score && mockData.score[1] ? mockData.score[1].inning : ''
          }
        };
        
        setMatch(formattedMatch);
        setScorecard(MOCK_SCORECARD_DATA);
        setUsingFallback(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching match details:', err);
      
      // Use mock data as fallback
      console.warn('Using mock data as fallback due to error');
      
      const mockData = MOCK_MATCH_DATA;
      
      // Determine match status
      let status = 'upcoming';
      if (mockData.matchStarted && !mockData.matchEnded) {
        status = 'live';
      } else if (mockData.matchEnded) {
        status = 'completed';
      }
      
      // Format the mock data
      const formattedMatch = {
        id: mockData.id,
        title: mockData.name,
        venue: mockData.venue || 'TBD',
        date: mockData.date || mockData.dateTimeGMT,
        status: status,
        result: mockData.status,
        tossWinner: mockData.tossWinner,
        tossChoice: mockData.tossChoice,
        matchWinner: mockData.matchWinner,
        team1: {
          name: mockData.teams && mockData.teams[0] ? mockData.teams[0] : 'Team A',
          shortName: mockData.teamInfo && mockData.teamInfo[0] ? mockData.teamInfo[0].shortname : '',
          score: mockData.score && mockData.score[0] ? `${mockData.score[0].r}/${mockData.score[0].w} (${mockData.score[0].o})` : '',
          logo: mockData.teamInfo && mockData.teamInfo[0] && mockData.teamInfo[0].img ? mockData.teamInfo[0].img : '',
          inning: mockData.score && mockData.score[0] ? mockData.score[0].inning : ''
        },
        team2: {
          name: mockData.teams && mockData.teams[1] ? mockData.teams[1] : 'Team B',
          shortName: mockData.teamInfo && mockData.teamInfo[1] ? mockData.teamInfo[1].shortname : '',
          score: mockData.score && mockData.score[1] ? `${mockData.score[1].r}/${mockData.score[1].w} (${mockData.score[1].o})` : '',
          logo: mockData.teamInfo && mockData.teamInfo[1] && mockData.teamInfo[1].img ? mockData.teamInfo[1].img : '',
          inning: mockData.score && mockData.score[1] ? mockData.score[1].inning : ''
        }
      };
      
      setMatch(formattedMatch);
      setScorecard(MOCK_SCORECARD_DATA);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchMatchDetails();
  }, [slug]);
  
  // Handle retry
  const handleRetry = () => {
    fetchMatchDetails(true);
  };
  
  if (loading) {
    return (
      <PageContainer>
        <BreadcrumbNav>
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/live-matches">Live Matches</Link>
          <span>›</span>
          <span>Match Details</span>
        </BreadcrumbNav>
        
        <LoadingContainer>
          <Spinner />
          <p>Loading match details...</p>
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  if (error) {
    return (
      <PageContainer>
        <BreadcrumbNav>
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/live-matches">Live Matches</Link>
          <span>›</span>
          <span>Match Details</span>
        </BreadcrumbNav>
        
        <ErrorContainer>{error}</ErrorContainer>
      </PageContainer>
    );
  }
  
  if (!match) {
    return (
      <PageContainer>
        <BreadcrumbNav>
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/live-matches">Live Matches</Link>
          <span>›</span>
          <span>Match Details</span>
        </BreadcrumbNav>
        
        <ErrorContainer>Match not found</ErrorContainer>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <BreadcrumbNav>
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/live-matches">Live Matches</Link>
        <span>›</span>
        <span>{match.title}</span>
      </BreadcrumbNav>
      
      {usingFallback && (
        <ErrorContainer style={{ backgroundColor: '#fff3cd', color: '#856404', border: '1px solid #ffeeba' }}>
          Note: Displaying fallback data. Some information might not be up-to-date.
          <RetryButton onClick={handleRetry}>Retry</RetryButton>
        </ErrorContainer>
      )}
      
      <MatchHeader>
        <MatchTitle>{match.title}</MatchTitle>
        
        <MatchInfo>
          <MatchMeta>
            <MatchVenue>{match.venue}</MatchVenue>
            <MatchDate>{formatDate(match.date)}</MatchDate>
            {match.tossWinner && (
              <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#666' }}>
                {match.tossWinner} won the toss and chose to {match.tossChoice}
              </div>
            )}
          </MatchMeta>
          
          <MatchStatus status={match.status}>
            {match.status === 'live' ? 'LIVE' : match.status === 'completed' ? 'COMPLETED' : 'UPCOMING'}
          </MatchStatus>
        </MatchInfo>
        
        <TeamsContainer>
          <TeamInfo align="left">
            <TeamLogo>
              {match.team1.logo ? (
                <img src={match.team1.logo} alt={match.team1.name} />
              ) : (
                <div className="placeholder-logo">{match.team1.shortName ? match.team1.shortName.charAt(0) : 'T'}</div>
              )}
            </TeamLogo>
            <TeamName>{match.team1.name}</TeamName>
            <TeamScore>{match.team1.score || 'Yet to bat'}</TeamScore>
          </TeamInfo>
          
          <VersusContainer>
            <VersusText>vs</VersusText>
            {match.result && match.status === 'completed' && (
              <MatchResult>{match.result}</MatchResult>
            )}
          </VersusContainer>
          
          <TeamInfo align="right">
            <TeamLogo>
              {match.team2.logo ? (
                <img src={match.team2.logo} alt={match.team2.name} />
              ) : (
                <div className="placeholder-logo">{match.team2.shortName ? match.team2.shortName.charAt(0) : 'T'}</div>
              )}
            </TeamLogo>
            <TeamName>{match.team2.name}</TeamName>
            <TeamScore>{match.team2.score || 'Yet to bat'}</TeamScore>
          </TeamInfo>
        </TeamsContainer>
      </MatchHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'scorecard'} 
          onClick={() => setActiveTab('scorecard')}
        >
          Scorecard
        </Tab>
        <Tab 
          active={activeTab === 'commentary'} 
          onClick={() => setActiveTab('commentary')}
        >
          Commentary
        </Tab>
        <Tab 
          active={activeTab === 'statistics'} 
          onClick={() => setActiveTab('statistics')}
        >
          Statistics
        </Tab>
      </TabsContainer>
      
      <TabContent>
        {activeTab === 'scorecard' && (
          <div>
            {scorecard && scorecard.scorecard ? (
              <div>
                {/* Innings Tabs */}
                <div style={{ 
                  display: 'flex', 
                  marginBottom: '1rem', 
                  borderBottom: '1px solid #ddd',
                  overflowX: 'auto'
                }}>
                  {scorecard.scorecard.map((inning, index) => {
                    // Determine if this is a Test match
                    const isTestMatch = scorecard.matchType === 'test' || 
                                       scorecard.matchType === '3-day' || 
                                       scorecard.matchType === '4-day' || 
                                       scorecard.matchType === '5-day';
                    
                    // Extract team name from inning string (e.g., "Australia Innings" -> "Australia")
                    const teamName = inning.inning.split(' ')[0];
                    
                    // For Test matches, show "Team Innings X"
                    // For ODI/T20, just show team name
                    let tabLabel;
                    if (isTestMatch) {
                      // Count how many innings this team has had so far
                      const teamInningsCount = scorecard.scorecard
                        .slice(0, index + 1)
                        .filter(inn => inn.inning.startsWith(teamName))
                        .length;
                      
                      tabLabel = `${teamName} Innings ${teamInningsCount}`;
                    } else {
                      tabLabel = teamName;
                    }
                    
                    return (
                      <div 
                        key={index} 
                        onClick={() => setActiveInningsTab(index)}
                        style={{ 
                          padding: '0.75rem 1rem', 
                          cursor: 'pointer',
                          backgroundColor: activeInningsTab === index ? '#f4f4f4' : 'transparent',
                          borderBottom: activeInningsTab === index ? '2px solid #002C54' : 'none',
                          fontWeight: activeInningsTab === index ? 'bold' : 'normal',
                          color: activeInningsTab === index ? '#002C54' : '#666',
                          transition: 'all 0.2s ease',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {tabLabel}
                      </div>
                    );
                  })}
                </div>
                
                {/* Display only the active innings */}
                {scorecard.scorecard[activeInningsTab] && (
                  <div>
                    {(() => {
                      const isTestMatch = scorecard.matchType === 'test' || 
                                         scorecard.matchType === '3-day' || 
                                         scorecard.matchType === '4-day' || 
                                         scorecard.matchType === '5-day';
                      
                      const inning = scorecard.scorecard[activeInningsTab];
                      const teamName = inning.inning.split(' ')[0];
                      let headerText;
                      
                      if (isTestMatch) {
                        // Count how many innings this team has had so far
                        const teamInningsCount = scorecard.scorecard
                          .slice(0, activeInningsTab + 1)
                          .filter(inn => inn.inning.startsWith(teamName))
                          .length;
                        
                        headerText = `${teamName} Innings ${teamInningsCount}`;
                      } else {
                        headerText = teamName;
                      }
                      
                      return (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          marginBottom: '1rem',
                          flexWrap: 'wrap'
                        }}>
                          <h3 style={{ color: '#333', margin: '0' }}>{headerText}</h3>
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <a 
                              href="#batting-section" 
                              style={{ 
                                textDecoration: 'none', 
                                color: '#002C54', 
                                padding: '5px 10px', 
                                borderRadius: '4px', 
                                backgroundColor: '#f0f0f0',
                                fontSize: '0.9rem'
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('batting-section').scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              Batting
                            </a>
                            <a 
                              href="#bowling-section" 
                              style={{ 
                                textDecoration: 'none', 
                                color: '#002C54', 
                                padding: '5px 10px', 
                                borderRadius: '4px', 
                                backgroundColor: '#f0f0f0',
                                fontSize: '0.9rem'
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                document.getElementById('bowling-section').scrollIntoView({ behavior: 'smooth' });
                              }}
                            >
                              Bowling
                            </a>
                          </div>
                        </div>
                      );
                    })()}
                    
                    {/* Batting Table */}
                    <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
                      <span id="batting-section" style={{ display: 'block', height: '0px', marginTop: '-20px', paddingTop: '20px', visibility: 'hidden' }}></span>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Batsman</th>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Dismissal</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>R</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>B</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>4s</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>6s</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>SR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scorecard.scorecard[activeInningsTab].batting.map((batsman, batsmanIndex) => (
                            <tr key={batsmanIndex} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{batsman.batsman?.name || 'Unknown'}</td>
                              <td style={{ padding: '0.75rem' }}>{batsman['dismissal-text']}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' }}>{batsman.r}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{batsman.b}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{batsman['4s']}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{batsman['6s']}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{batsman.sr}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr style={{ backgroundColor: '#f9f9f9' }}>
                            <td style={{ padding: '0.75rem', fontWeight: 'bold' }} colSpan="2">Extras</td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' }}>{scorecard.scorecard[activeInningsTab].extras?.r || 0}</td>
                            <td style={{ padding: '0.75rem' }} colSpan="4"></td>
                          </tr>
                          <tr style={{ backgroundColor: '#f4f4f4', fontWeight: 'bold' }}>
                            <td style={{ padding: '0.75rem' }} colSpan="2">Total</td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                              {scorecard.scorecard[activeInningsTab].score ? 
                                `${scorecard.scorecard[activeInningsTab].score.r}/${scorecard.scorecard[activeInningsTab].score.w} (${scorecard.scorecard[activeInningsTab].score.o} Overs)` : 
                                ''}
                            </td>
                            <td style={{ padding: '0.75rem', textAlign: 'right' }} colSpan="4">
                              {(() => {
                                // Get the current innings data
                                const currentInnings = scorecard.scorecard[activeInningsTab];
                                
                                // Calculate total runs from batsmen if score.r is not available
                                const totalRuns = currentInnings.score?.r || 
                                  currentInnings.batting.reduce((sum, batsman) => sum + (parseInt(batsman.r) || 0), 0) + 
                                  (currentInnings.extras?.r || 0);
                                
                                // Get overs data
                                const overs = currentInnings.score?.o;
                                
                                if (overs && totalRuns) {
                                  // Handle different formats of overs (e.g., "19.5" or "19")
                                  let oversValue = 0;
                                  
                                  if (typeof overs === 'string' && overs.includes('.')) {
                                    // Handle decimal overs (e.g., "19.5" means 19 overs and 5 balls)
                                    const [fullOvers, balls] = overs.split('.');
                                    oversValue = parseFloat(fullOvers) + (parseFloat(balls) / 6);
                                  } else {
                                    oversValue = parseFloat(overs);
                                  }
                                  
                                  if (!isNaN(oversValue) && oversValue > 0) {
                                    const runRate = (totalRuns / oversValue).toFixed(2);
                                    return `RR: ${runRate}`;
                                  }
                                }
                                
                                return '';
                              })()}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    
                    {/* Bowling Table */}
                    <div style={{ overflowX: 'auto' }}>
                      <span id="bowling-section" style={{ display: 'block', height: '0px', marginTop: '-20px', paddingTop: '20px', visibility: 'hidden' }}></span>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                        <thead>
                          <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '0.75rem', textAlign: 'left' }}>Bowler</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>O</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>M</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>R</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>W</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>NB</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>WD</th>
                            <th style={{ padding: '0.75rem', textAlign: 'right' }}>ECO</th>
                          </tr>
                        </thead>
                        <tbody>
                          {scorecard.scorecard[activeInningsTab].bowling.map((bowler, bowlerIndex) => (
                            <tr key={bowlerIndex} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{bowler.bowler?.name || 'Unknown'}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{bowler.o}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{bowler.m}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{bowler.r}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 'bold' }}>{bowler.w}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{bowler.nb}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{bowler.wd}</td>
                              <td style={{ padding: '0.75rem', textAlign: 'right' }}>{bowler.eco}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <p>Detailed scorecard is not available at the moment.</p>
                {match.status === 'upcoming' && (
                  <p>This match hasn't started yet. Check back later for the scorecard.</p>
                )}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'commentary' && (
          <div>
            <p>Ball-by-ball commentary will be available soon.</p>
            {match.status === 'upcoming' && (
              <p>This match hasn't started yet. Check back later for commentary.</p>
            )}
          </div>
        )}
        
        {activeTab === 'statistics' && (
          <div>
            {scorecard && scorecard.scorecard ? (
              <div>
                <h3 style={{ marginBottom: '1rem', color: '#333' }}>Match Statistics</h3>
                
                {/* Top Performers */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                  {/* Top Batsmen */}
                  <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h4 style={{ marginBottom: '0.75rem', color: '#333' }}>Top Batsmen</h4>
                    {scorecard.scorecard.flatMap(inning => 
                      inning.batting.map(batsman => ({
                        name: batsman.batsman?.name || 'Unknown',
                        runs: batsman.r,
                        balls: batsman.b,
                        fours: batsman['4s'],
                        sixes: batsman['6s'],
                        strikeRate: batsman.sr,
                        team: inning.inning.split(' ')[0]
                      }))
                    )
                    .sort((a, b) => b.runs - a.runs)
                    .slice(0, 3)
                    .map((batsman, index) => (
                      <div key={index}>
                        <div style={{ fontWeight: 'bold' }}>{batsman.name} ({batsman.team})</div>
                        <div>{batsman.runs} runs ({batsman.balls} balls, {batsman.fours} fours, {batsman.sixes} sixes)</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Top Bowlers */}
                  <div style={{ flex: '1 1 300px', backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h4 style={{ marginBottom: '0.75rem', color: '#333' }}>Top Bowlers</h4>
                    {scorecard.scorecard.flatMap(inning => 
                      inning.bowling.map(bowler => ({
                        name: bowler.bowler?.name || 'Unknown',
                        wickets: bowler.w,
                        runs: bowler.r,
                        overs: bowler.o,
                        economy: bowler.eco,
                        team: inning.inning.includes(match.team1.name) ? match.team2.name : match.team1.name
                      }))
                    )
                    .sort((a, b) => b.wickets - a.wickets || a.economy - b.economy)
                    .slice(0, 3)
                    .map((bowler, index) => (
                      <div key={index}>
                        <div style={{ fontWeight: 'bold' }}>{bowler.name} ({bowler.team})</div>
                        <div>{bowler.wickets} wickets for {bowler.runs} runs ({bowler.overs} overs)</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Partnership Chart (simplified) */}
                <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
                  <h4 style={{ marginBottom: '0.75rem', color: '#333' }}>Key Statistics</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                    {/* Team 1 Stats */}
                    <div style={{ flex: '1 1 200px' }}>
                      <h5>{match.team1.name}</h5>
                      {scorecard.scorecard
                        .filter(inning => inning.inning.includes(match.team1.name))
                        .map((inning, index) => {
                          // Calculate total boundaries
                          const totalFours = inning.batting.reduce((sum, batsman) => sum + (batsman['4s'] || 0), 0);
                          const totalSixes = inning.batting.reduce((sum, batsman) => sum + (batsman['6s'] || 0), 0);
                          
                          return (
                            <div key={index}>
                              <div>Boundaries: {totalFours} fours, {totalSixes} sixes</div>
                              <div>Run Rate: {(() => {
                                // Calculate total runs from batsmen if score.r is not available
                                const totalRuns = inning.score?.r || 
                                  inning.batting.reduce((sum, batsman) => sum + (parseInt(batsman.r) || 0), 0) + 
                                  (inning.extras?.r || 0);
                                
                                // Get overs data
                                const overs = inning.score?.o;
                                
                                if (overs && totalRuns) {
                                  // Handle different formats of overs (e.g., "19.5" or "19")
                                  let oversValue = 0;
                                  
                                  if (typeof overs === 'string' && overs.includes('.')) {
                                    // Handle decimal overs (e.g., "19.5" means 19 overs and 5 balls)
                                    const [fullOvers, balls] = overs.split('.');
                                    oversValue = parseFloat(fullOvers) + (parseFloat(balls) / 6);
                                  } else {
                                    oversValue = parseFloat(overs);
                                  }
                                  
                                  if (!isNaN(oversValue) && oversValue > 0) {
                                    return (totalRuns / oversValue).toFixed(2);
                                  }
                                }
                                
                                return 'N/A';
                              })()}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    
                    {/* Team 2 Stats */}
                    <div style={{ flex: '1 1 200px' }}>
                      <h5>{match.team2.name}</h5>
                      {scorecard.scorecard
                        .filter(inning => inning.inning.includes(match.team2.name))
                        .map((inning, index) => {
                          // Calculate total boundaries
                          const totalFours = inning.batting.reduce((sum, batsman) => sum + (batsman['4s'] || 0), 0);
                          const totalSixes = inning.batting.reduce((sum, batsman) => sum + (batsman['6s'] || 0), 0);
                          
                          return (
                            <div key={index}>
                              <div>Boundaries: {totalFours} fours, {totalSixes} sixes</div>
                              <div>Run Rate: {(() => {
                                // Calculate total runs from batsmen if score.r is not available
                                const totalRuns = inning.score?.r || 
                                  inning.batting.reduce((sum, batsman) => sum + (parseInt(batsman.r) || 0), 0) + 
                                  (inning.extras?.r || 0);
                                
                                // Get overs data
                                const overs = inning.score?.o;
                                
                                if (overs && totalRuns) {
                                  // Handle different formats of overs (e.g., "19.5" or "19")
                                  let oversValue = 0;
                                  
                                  if (typeof overs === 'string' && overs.includes('.')) {
                                    // Handle decimal overs (e.g., "19.5" means 19 overs and 5 balls)
                                    const [fullOvers, balls] = overs.split('.');
                                    oversValue = parseFloat(fullOvers) + (parseFloat(balls) / 6);
                                  } else {
                                    oversValue = parseFloat(overs);
                                  }
                                  
                                  if (!isNaN(oversValue) && oversValue > 0) {
                                    return (totalRuns / oversValue).toFixed(2);
                                  }
                                }
                                
                                return 'N/A';
                              })()}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Match statistics will be available once the match has started.</p>
            )}
          </div>
        )}
      </TabContent>
    </PageContainer>
  );
};

export default MatchDetails;
