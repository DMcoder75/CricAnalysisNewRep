import React from 'react';
import styled from 'styled-components';
import theme from '../../utils/theme';

const SeriesAnalytics = ({ series }) => {
  return (
    <AnalyticsContainer>
      <SectionTitle>Series Analytics</SectionTitle>
      
      <ComingSoonMessage>
        <ComingSoonIcon>📊</ComingSoonIcon>
        <h3>Advanced Analytics Coming Soon</h3>
        <p>We're working on comprehensive analytics for this series, including:</p>
        <FeatureList>
          <FeatureItem>
            <FeatureIcon>📈</FeatureIcon>
            <FeatureText>Team Performance Trends</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🏏</FeatureIcon>
            <FeatureText>Batting & Bowling Statistics</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🎯</FeatureIcon>
            <FeatureText>Player Form Analysis</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureText>Match Momentum Shifts</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🔍</FeatureIcon>
            <FeatureText>Head-to-Head Comparisons</FeatureText>
          </FeatureItem>
        </FeatureList>
        <p>Check back soon for detailed analytics on {series.name}!</p>
      </ComingSoonMessage>
    </AnalyticsContainer>
  );
};

const AnalyticsContainer = styled.div`
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

const ComingSoonMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background-color: rgba(0, 44, 84, 0.03);
  border-radius: 8px;
  
  h3 {
    margin: 1rem 0 0.5rem;
    color: ${theme.colors.primary};
  }
  
  p {
    margin: 0.5rem 0 1.5rem;
    color: ${theme.colors.text.secondary};
    max-width: 600px;
  }
`;

const ComingSoonIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  width: 100%;
  max-width: 800px;
  margin-bottom: 1.5rem;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 1rem;
  color: ${theme.colors.primary};
`;

const FeatureText = styled.div`
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

export default SeriesAnalytics;
