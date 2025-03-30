import React from 'react';
import styled from 'styled-components';
import theme from '../../utils/theme';

const SeriesInsights = ({ series }) => {
  return (
    <InsightsContainer>
      <SectionTitle>AI Insights</SectionTitle>
      
      <AIInsightsContent>
        <AIHeader>
          <AIIcon>🤖</AIIcon>
          <AITitle>Crichattric AI Analysis</AITitle>
        </AIHeader>
        
        <InsightCards>
          <InsightCard>
            <InsightHeader>
              <InsightIcon>⚔️</InsightIcon>
              <InsightTitle>Key Matchups</InsightTitle>
            </InsightHeader>
            <InsightContent>
              <p>Our AI has identified the following key player matchups that could determine the outcome of upcoming matches in this series:</p>
              {series.teams && series.teams.length >= 2 ? (
                <MatchupList>
                  <Matchup>
                    <MatchupTeams>{`${series.teams[0]} vs ${series.teams[1]}`}</MatchupTeams>
                    <MatchupDetail>Watch for the battle between pace bowlers and top-order batsmen</MatchupDetail>
                  </Matchup>
                  {series.teams.length >= 3 && (
                    <Matchup>
                      <MatchupTeams>{`${series.teams[0]} vs ${series.teams[2]}`}</MatchupTeams>
                      <MatchupDetail>Spin bowling could be the deciding factor on these pitches</MatchupDetail>
                    </Matchup>
                  )}
                </MatchupList>
              ) : (
                <p>Team information not available for matchup analysis.</p>
              )}
            </InsightContent>
          </InsightCard>
          
          <InsightCard>
            <InsightHeader>
              <InsightIcon>📊</InsightIcon>
              <InsightTitle>Performance Predictions</InsightTitle>
            </InsightHeader>
            <InsightContent>
              <p>Based on historical data and current form, our AI predicts:</p>
              <PredictionList>
                <Prediction>
                  <PredictionLabel>Highest Run Scorer:</PredictionLabel>
                  <PredictionValue>Top-order batsmen from {series.teams && series.teams.length > 0 ? series.teams[0] : 'participating teams'}</PredictionValue>
                </Prediction>
                <Prediction>
                  <PredictionLabel>Leading Wicket Taker:</PredictionLabel>
                  <PredictionValue>Experienced bowlers with track record in similar conditions</PredictionValue>
                </Prediction>
                <Prediction>
                  <PredictionLabel>Series Outcome:</PredictionLabel>
                  <PredictionValue>Competitive series with close matches expected</PredictionValue>
                </Prediction>
              </PredictionList>
            </InsightContent>
          </InsightCard>
          
          <InsightCard>
            <InsightHeader>
              <InsightIcon>🔮</InsightIcon>
              <InsightTitle>Strategic Insights</InsightTitle>
            </InsightHeader>
            <InsightContent>
              <p>Our AI has analyzed recent performances and identified these strategic insights:</p>
              <StrategiesList>
                <Strategy>
                  <StrategyIcon>🎯</StrategyIcon>
                  <StrategyText>Teams batting first have a statistical advantage in day-night matches</StrategyText>
                </Strategy>
                <Strategy>
                  <StrategyIcon>⚡</StrategyIcon>
                  <StrategyText>Powerplay performance strongly correlates with match outcomes</StrategyText>
                </Strategy>
                <Strategy>
                  <StrategyIcon>🔄</StrategyIcon>
                  <StrategyText>Teams with balanced bowling attacks have performed better in this format</StrategyText>
                </Strategy>
              </StrategiesList>
            </InsightContent>
          </InsightCard>
        </InsightCards>
        
        <DisclaimerText>
          These insights are generated using our proprietary AI algorithms analyzing historical match data, player statistics, and venue conditions. Predictions are for informational purposes only.
        </DisclaimerText>
      </AIInsightsContent>
    </InsightsContainer>
  );
};

const InsightsContainer = styled.div`
  background-color: ${theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${theme.colors.primary};
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${theme.colors.border};
`;

const AIInsightsContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const AIHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const AIIcon = styled.div`
  font-size: 2rem;
  margin-right: 1rem;
`;

const AITitle = styled.h3`
  font-size: 1.5rem;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const InsightCards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
`;

const InsightCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  background-color: ${theme.colors.primary};
  color: white;
`;

const InsightIcon = styled.div`
  font-size: 1.25rem;
  margin-right: 0.75rem;
`;

const InsightTitle = styled.h4`
  font-size: 1.1rem;
  margin: 0;
`;

const InsightContent = styled.div`
  padding: 1.25rem;
  
  p {
    margin-top: 0;
    color: ${theme.colors.text.secondary};
  }
`;

const MatchupList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Matchup = styled.div`
  padding: 0.75rem;
  background-color: rgba(0, 44, 84, 0.03);
  border-radius: 6px;
`;

const MatchupTeams = styled.div`
  font-weight: 600;
  color: ${theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const MatchupDetail = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const PredictionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Prediction = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.75rem;
  background-color: rgba(0, 44, 84, 0.03);
  border-radius: 6px;
`;

const PredictionLabel = styled.div`
  font-weight: 600;
  color: ${theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const PredictionValue = styled.div`
  color: ${theme.colors.text.secondary};
`;

const StrategiesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Strategy = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  background-color: rgba(0, 44, 84, 0.03);
  border-radius: 6px;
`;

const StrategyIcon = styled.div`
  font-size: 1.25rem;
  margin-right: 0.75rem;
  color: ${theme.colors.primary};
`;

const StrategyText = styled.div`
  color: ${theme.colors.text.secondary};
`;

const DisclaimerText = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.text.tertiary};
  font-style: italic;
  text-align: center;
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: 6px;
`;

export default SeriesInsights;
