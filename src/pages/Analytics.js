import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dbService from '../services/dbService';
import { formatMatchDate } from '../utils/dataParser';
import theme from '../utils/theme';

const AnalyticsContainer = styled.div`
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const PageTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin: 0 0 2rem 0;
  font-size: 1.8rem;
  text-align: center;
  
  @media (min-width: 768px) {
    font-size: 2.2rem;
    text-align: left;
  }
`;

const AnalyticsStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  
  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
`;

const StatTitle = styled.h3`
  color: ${props => props.theme.colors.darkGray};
  margin: 0;
  font-size: 1.1rem;
`;

const StatValue = styled.div`
  color: ${props => props.theme.colors.primary};
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatDescription = styled.p`
  color: ${props => props.theme.colors.lightGray};
  margin: 0;
`;

const AnalyticsCharts = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
`;

const ChartCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.medium};
  padding: 1.5rem;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ChartHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ChartIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const ChartTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.colors.primary};
`;

const TeamInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  
  span {
    margin-left: 0.5rem;
    font-weight: 500;
  }
`;

const TeamLogo = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: ${props => props.color || props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const Analytics = () => {
  const [stats, setStats] = useState({
    totalMatches: 0,
    completedMatches: 0,
    upcomingMatches: 0,
    highestScoringMatch: null,
    mostWins: null,
    bestBattingAverage: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([]);

  // Function to get team logo path
  const getTeamLogoPath = (teamShortName) => {
    const logoFilename = theme.TEAM_LOGO_MAP[teamShortName] || 'default.png';
    return `${process.env.PUBLIC_URL}${theme.ASSETS_PATH.TEAMS}${logoFilename}`;
  };

  // Function to get icon path
  const getIconPath = (iconName) => {
    const iconFilename = theme.ICONS[iconName] || 'default.png';
    return `${process.env.PUBLIC_URL}${theme.ASSETS_PATH.ICONS}${iconFilename}`;
  };

  // Function to get team by ID
  const getTeam = (teamId) => {
    return teams.find(team => team.id === teamId) || {};
  };

  // Function to get site logo path
  const getSiteLogoPath = () => {
    // Add timestamp for cache-busting
    const timestamp = new Date().getTime();
    return `${process.env.PUBLIC_URL}/assets/images/sitelogo/CricketHattrickLogo.png?t=${timestamp}`;
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all matches and teams
        const matches = await dbService.getAllMatches();
        const teamsData = await dbService.getAllTeams();
        setTeams(teamsData);

        // Calculate statistics
        const stats = {
          totalMatches: matches.length,
          completedMatches: matches.filter(m => m.status === 'Completed').length,
          upcomingMatches: matches.filter(m => m.status === 'Upcoming').length,
          highestScoringMatch: matches.reduce((max, match) => {
            const totalRuns = (match.homeTeamScore?.split('/')[0] || 0) + 
                            (match.awayTeamScore?.split('/')[0] || 0);
            return totalRuns > (max?.totalRuns || 0) ? { ...match, totalRuns } : max;
          }, null),
          mostWins: teamsData.reduce((max, team) => {
            const wins = matches.filter(m => 
              m.status === 'Completed' && 
              m.winnerId === team.id
            ).length;
            return wins > (max?.wins || 0) ? { ...team, wins } : max;
          }, null),
          bestBattingAverage: teamsData.reduce((max, team) => {
            const totalRuns = matches.reduce((sum, match) => {
              if (match.status === 'Completed' && 
                  (match.homeTeamId === team.id || match.awayTeamId === team.id)) {
                return sum + (match.homeTeamId === team.id 
                  ? match.homeTeamScore?.split('/')[0] || 0
                  : match.awayTeamScore?.split('/')[0] || 0);
              }
              return sum;
            }, 0);
            const totalMatches = matches.filter(m => 
              m.status === 'Completed' && 
              (m.homeTeamId === team.id || m.awayTeamId === team.id)
            ).length;
            const average = totalMatches > 0 ? totalRuns / totalMatches : 0;
            return average > (max?.average || 0) ? { ...team, average } : max;
          }, null)
        };

        setStats(stats);
        setLoading(false);
      } catch (error) {
        setError('Failed to load analytics data. Please try again later.');
        setLoading(false);
        console.error('Error fetching analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AnalyticsContainer>
        <PageTitle>Loading Analytics...</PageTitle>
      </AnalyticsContainer>
    );
  }

  if (error) {
    return (
      <AnalyticsContainer>
        <PageTitle>Error</PageTitle>
        <p>{error}</p>
      </AnalyticsContainer>
    );
  }

  return (
    <AnalyticsContainer>
      <PageTitle>IPL 2025 Analytics</PageTitle>

      <AnalyticsStats>
        <StatCard>
          <StatHeader>
            <StatIcon>
              <img src={getIconPath('total_matches')} alt="Total Matches" />
            </StatIcon>
            <StatTitle>Total Matches</StatTitle>
          </StatHeader>
          <StatValue>{stats.totalMatches}</StatValue>
          <StatDescription>Includes completed and upcoming matches</StatDescription>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>
              <img src={getIconPath('completed_matches')} alt="Completed Matches" />
            </StatIcon>
            <StatTitle>Completed Matches</StatTitle>
          </StatHeader>
          <StatValue>{stats.completedMatches}</StatValue>
          <StatDescription>Matches that have been played</StatDescription>
        </StatCard>
        <StatCard>
          <StatHeader>
            <StatIcon>
              <img src={getIconPath('upcoming_matches')} alt="Upcoming Matches" />
            </StatIcon>
            <StatTitle>Upcoming Matches</StatTitle>
          </StatHeader>
          <StatValue>{stats.upcomingMatches}</StatValue>
          <StatDescription>Matches yet to be played</StatDescription>
        </StatCard>
      </AnalyticsStats>

      <AnalyticsCharts>
        <ChartCard>
          <ChartHeader>
            <ChartIcon>
              <img src={getIconPath('highest_score')} alt="Highest Score" />
            </ChartIcon>
            <ChartTitle>Highest Scoring Match</ChartTitle>
          </ChartHeader>
          {stats.highestScoringMatch && (
            <div>
              {stats.highestScoringMatch.homeTeamId && stats.highestScoringMatch.awayTeamId && (
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <TeamInfo>
                    <TeamLogo color={getTeam(stats.highestScoringMatch.homeTeamId).color}>
                      <img 
                        src={getTeamLogoPath(getTeam(stats.highestScoringMatch.homeTeamId).shortName)} 
                        alt={getTeam(stats.highestScoringMatch.homeTeamId).name} 
                      />
                    </TeamLogo>
                    <span>{getTeam(stats.highestScoringMatch.homeTeamId).shortName}</span>
                  </TeamInfo>
                  <span style={{ margin: '0 0.5rem' }}>vs</span>
                  <TeamInfo>
                    <TeamLogo color={getTeam(stats.highestScoringMatch.awayTeamId).color}>
                      <img 
                        src={getTeamLogoPath(getTeam(stats.highestScoringMatch.awayTeamId).shortName)} 
                        alt={getTeam(stats.highestScoringMatch.awayTeamId).name} 
                      />
                    </TeamLogo>
                    <span>{getTeam(stats.highestScoringMatch.awayTeamId).shortName}</span>
                  </TeamInfo>
                </div>
              )}
              <p>Date: {formatMatchDate(stats.highestScoringMatch.date)}</p>
              <p>Total Runs: {stats.highestScoringMatch.totalRuns}</p>
              <p>Venue: {stats.highestScoringMatch.venue}</p>
            </div>
          )}
        </ChartCard>
        <ChartCard>
          <ChartHeader>
            <ChartIcon>
              <img src={getIconPath('most_wins')} alt="Most Wins" />
            </ChartIcon>
            <ChartTitle>Most Wins</ChartTitle>
          </ChartHeader>
          {stats.mostWins && (
            <div>
              <TeamInfo>
                <TeamLogo color={stats.mostWins.color}>
                  <img 
                    src={getTeamLogoPath(stats.mostWins.shortName)} 
                    alt={stats.mostWins.name} 
                  />
                </TeamLogo>
                <span>{stats.mostWins.name}</span>
              </TeamInfo>
              <p>Wins: {stats.mostWins.wins}</p>
            </div>
          )}
        </ChartCard>
        <ChartCard>
          <ChartHeader>
            <ChartIcon>
              <img src={getIconPath('batting_average')} alt="Batting Average" />
            </ChartIcon>
            <ChartTitle>Best Batting Average</ChartTitle>
          </ChartHeader>
          {stats.bestBattingAverage && (
            <div>
              <TeamInfo>
                <TeamLogo color={stats.bestBattingAverage.color}>
                  <img 
                    src={getTeamLogoPath(stats.bestBattingAverage.shortName)} 
                    alt={stats.bestBattingAverage.name} 
                  />
                </TeamLogo>
                <span>{stats.bestBattingAverage.name}</span>
              </TeamInfo>
              <p>Average: {stats.bestBattingAverage.average.toFixed(2)} runs per match</p>
            </div>
          )}
        </ChartCard>
      </AnalyticsCharts>
    </AnalyticsContainer>
  );
};

export default Analytics;
