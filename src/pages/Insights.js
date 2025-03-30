import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import dbService from '../services/dbService';
import { formatMatchDate } from '../utils/dataParser';

const InsightsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const InsightsHeader = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const InsightsTitle = styled.h1`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
`;

const InsightsTabs = styled.div`
  display: flex;
  border-bottom: 2px solid ${props => props.theme.colors.lightGray};
  margin-bottom: 2rem;
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

const InsightsContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const InsightsSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: 1rem;
`;

const InsightsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const InsightItem = styled.li`
  background-color: ${props => props.theme.colors.lightGray};
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Insights = () => {
  const [activeTab, setActiveTab] = useState('match');
  const [insights, setInsights] = useState({
    match: [],
    team: [],
    player: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get all matches and teams
        const [matches, teams] = await Promise.all([
          dbService.getAllMatches(),
          dbService.getAllTeams()
        ]);

        // Generate match insights
        const matchInsights = [
          {
            title: 'Most Competitive Matches',
            insights: matches
              .filter(m => m.status === 'Completed')
              .sort((a, b) => {
                const aDiff = Math.abs((a.homeTeamScore?.split('/')[0] || 0) - (a.awayTeamScore?.split('/')[0] || 0));
                const bDiff = Math.abs((b.homeTeamScore?.split('/')[0] || 0) - (b.awayTeamScore?.split('/')[0] || 0));
                return aDiff - bDiff;
              })
              .slice(0, 5)
              .map(match => ({
                date: formatMatchDate(match.date),
                teams: `${teams.find(t => t.id === match.homeTeamId)?.name} vs ${teams.find(t => t.id === match.awayTeamId)?.name}`,
                score: `${match.homeTeamScore} vs ${match.awayTeamScore}`,
                margin: Math.abs((match.homeTeamScore?.split('/')[0] || 0) - (match.awayTeamScore?.split('/')[0] || 0))
              }))
          },
          {
            title: 'Highest Run Chases',
            insights: matches
              .filter(m => m.status === 'Completed')
              .sort((a, b) => {
                const aTarget = (a.homeTeamScore?.split('/')[0] || 0) + 1;
                const bTarget = (b.homeTeamScore?.split('/')[0] || 0) + 1;
                return bTarget - aTarget;
              })
              .slice(0, 5)
              .map(match => ({
                date: formatMatchDate(match.date),
                teams: `${teams.find(t => t.id === match.homeTeamId)?.name} vs ${teams.find(t => t.id === match.awayTeamId)?.name}`,
                target: (match.homeTeamScore?.split('/')[0] || 0) + 1,
                result: match.winnerId === match.awayTeamId ? 'Successfully chased' : 'Failed to chase'
              }))
          }
        ];

        // Generate team insights
        const teamInsights = [
          {
            title: 'Most Consistent Teams',
            insights: teams
              .map(team => {
                const teamMatches = matches.filter(m => 
                  m.status === 'Completed' && 
                  (m.homeTeamId === team.id || m.awayTeamId === team.id)
                );
                const wins = teamMatches.filter(m => m.winnerId === team.id).length;
                const total = teamMatches.length;
                return {
                  name: team.name,
                  winPercentage: total > 0 ? (wins / total * 100).toFixed(1) : 0,
                  totalMatches: total
                };
              })
              .sort((a, b) => b.winPercentage - a.winPercentage)
              .slice(0, 5)
          },
          {
            title: 'Best Batting Teams',
            insights: teams
              .map(team => {
                const teamMatches = matches.filter(m => 
                  m.status === 'Completed' && 
                  (m.homeTeamId === team.id || m.awayTeamId === team.id)
                );
                const totalRuns = teamMatches.reduce((sum, m) => {
                  return sum + (m.homeTeamId === team.id 
                    ? m.homeTeamScore?.split('/')[0] || 0
                    : m.awayTeamScore?.split('/')[0] || 0);
                }, 0);
                return {
                  name: team.name,
                  averageRuns: teamMatches.length > 0 ? (totalRuns / teamMatches.length).toFixed(1) : 0,
                  totalMatches: teamMatches.length
                };
              })
              .sort((a, b) => b.averageRuns - a.averageRuns)
              .slice(0, 5)
          }
        ];

        // Generate player insights (placeholder - would need player data)
        const playerInsights = [
          {
            title: 'Top Performers',
            insights: [
              { name: 'Player A', team: 'Team X', metric: 'Highest Runs', value: '1200' },
              { name: 'Player B', team: 'Team Y', metric: 'Most Wickets', value: '25' },
              { name: 'Player C', team: 'Team Z', metric: 'Best Strike Rate', value: '180.00' }
            ]
          },
          {
            title: 'Consistent Performers',
            insights: [
              { name: 'Player D', team: 'Team A', metric: 'Average Runs', value: '45.00' },
              { name: 'Player E', team: 'Team B', metric: 'Average Wickets', value: '2.50' },
              { name: 'Player F', team: 'Team C', metric: 'Average Economy', value: '7.50' }
            ]
          }
        ];

        setInsights({
          match: matchInsights,
          team: teamInsights,
          player: playerInsights
        });
        setLoading(false);
      } catch (error) {
        setError('Failed to load insights. Please try again later.');
        setLoading(false);
        console.error('Error fetching insights:', error);
      }
    };

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <InsightsContainer>
        <InsightsHeader>
          <InsightsTitle>Loading Insights...</InsightsTitle>
        </InsightsHeader>
      </InsightsContainer>
    );
  }

  if (error) {
    return (
      <InsightsContainer>
        <InsightsHeader>
          <InsightsTitle>Error</InsightsTitle>
          <p>{error}</p>
        </InsightsHeader>
      </InsightsContainer>
    );
  }

  const currentInsights = insights[activeTab];

  return (
    <InsightsContainer>
      <InsightsHeader>
        <InsightsTitle>IPL 2025 Insights</InsightsTitle>
        <InsightsTabs>
          <TabButton 
            active={activeTab === 'match'} 
            onClick={() => setActiveTab('match')}
          >
            Match Insights
          </TabButton>
          <TabButton 
            active={activeTab === 'team'} 
            onClick={() => setActiveTab('team')}
          >
            Team Insights
          </TabButton>
          <TabButton 
            active={activeTab === 'player'} 
            onClick={() => setActiveTab('player')}
          >
            Player Insights
          </TabButton>
        </InsightsTabs>
      </InsightsHeader>

      <InsightsContent>
        {currentInsights.map((section, index) => (
          <InsightsSection key={index}>
            <SectionTitle>{section.title}</SectionTitle>
            <InsightsList>
              {section.insights.map((item, i) => (
                <InsightItem key={i}>
                  {Object.entries(item).map(([key, value]) => (
                    <p key={key}>
                      <strong>{key.replace(/([A-Z])/g, ' $1').trim()}: </strong>
                      {value}
                    </p>
                  ))}
                </InsightItem>
              ))}
            </InsightsList>
          </InsightsSection>
        ))}
      </InsightsContent>
    </InsightsContainer>
  );
};

export default Insights;
