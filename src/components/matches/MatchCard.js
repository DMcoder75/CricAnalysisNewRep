import React from 'react';
import styled from 'styled-components';
import { CalendarToday as CalendarIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import theme from '../../utils/theme';

const MatchCard = ({ match, onClick }) => {
  const getStatusColor = (statusCategory) => {
    switch (statusCategory) {
      case 'live':
        return theme.colors.status.live;
      case 'completed':
        return theme.colors.status.completed;
      case 'upcoming':
      default:
        return theme.colors.status.upcoming;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card 
      status={match.statusCategory || 'upcoming'} 
      onClick={onClick}
    >
      <MatchTitle>{match.name}</MatchTitle>
      <MatchDate>
        <CalendarIcon fontSize="small" />
        <span>{formatDate(match.date)}</span>
      </MatchDate>
      {match.venue && (
        <MatchVenue>
          <LocationIcon fontSize="small" />
          <span>{match.venue}</span>
        </MatchVenue>
      )}
      <MatchStatus status={match.statusCategory || 'upcoming'}>
        {match.status}
      </MatchStatus>
      
      {match.score && match.score.length > 0 && (
        <ScoreContainer>
          {match.score.map((score, idx) => (
            <ScoreItem key={idx}>
              <TeamName>{score.team}</TeamName>
              <Score>{score.score}</Score>
            </ScoreItem>
          ))}
        </ScoreContainer>
      )}
    </Card>
  );
};

const Card = styled.div`
  background-color: ${theme.colors.background.card};
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  border-left: 4px solid ${props => getStatusColor(props.status)};
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const MatchTitle = styled.h3`
  font-size: 16px;
  margin: 0 0 12px 0;
  color: ${theme.colors.text.primary};
`;

const MatchDate = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 8px;
  color: ${theme.colors.text.secondary};
  
  svg {
    margin-right: 6px;
    font-size: 16px;
  }
`;

const MatchVenue = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  margin-bottom: 12px;
  color: ${theme.colors.text.secondary};
  
  svg {
    margin-right: 6px;
    font-size: 16px;
  }
`;

const MatchStatus = styled.div`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 12px;
  background-color: ${props => getStatusColor(props.status)}20;
  color: ${props => getStatusColor(props.status)};
`;

const ScoreContainer = styled.div`
  margin-top: 12px;
  border-top: 1px solid ${theme.colors.border};
  padding-top: 12px;
`;

const ScoreItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TeamName = styled.span`
  font-size: 14px;
  color: ${theme.colors.text.secondary};
`;

const Score = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${theme.colors.text.primary};
`;

// Helper function to determine status color
const getStatusColor = (statusCategory) => {
  switch (statusCategory) {
    case 'live':
      return theme.colors.status.live;
    case 'completed':
      return theme.colors.status.completed;
    case 'upcoming':
    default:
      return theme.colors.status.upcoming;
  }
};

export default MatchCard;
