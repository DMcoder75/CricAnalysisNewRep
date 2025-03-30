import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import theme from '../../utils/theme';

const SeriesOverview = ({ series }) => {
  const navigate = useNavigate();

  // Calculate series duration in days
  const calculateDuration = () => {
    if (!series || !series.startDate || !series.endDate) {
      return 'N/A';
    }
    
    const startDate = new Date(series.startDate);
    const endDate = new Date(series.endDate);
    
    // Check if dates are valid
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 'N/A';
    }
    
    const durationInDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return durationInDays;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'TBD';
    
    // Use a more explicit date format that includes day, month name, and full year
    const options = { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    };
    return date.toLocaleDateString(undefined, options);
  };

  // Check if a match format is included in this series
  const hasFormat = (format) => {
    if (!series) return false;
    
    // Check if the format property exists and has a positive value
    if (format === 'test' && series.test && series.test > 0) return true;
    if (format === 'odi' && series.odi && series.odi > 0) return true;
    if (format === 't20' && series.t20 && series.t20 > 0) return true;
    
    // Check if any matches have this format
    if (series.matches && Array.isArray(series.matches)) {
      for (const match of series.matches) {
        if (match.matchType) {
          if (format === 'test' && match.matchType.toLowerCase().includes('test')) return true;
          if (format === 'odi' && match.matchType.toLowerCase().includes('odi')) return true;
          if (format === 't20' && match.matchType.toLowerCase().includes('t20')) return true;
        }
        if (match.format) {
          if (format === 'test' && match.format.toLowerCase().includes('test')) return true;
          if (format === 'odi' && match.format.toLowerCase().includes('odi')) return true;
          if (format === 't20' && match.format.toLowerCase().includes('t20')) return true;
        }
      }
    }
    
    // Special case for IPL (always T20)
    if (format === 't20' && series.name && 
        (series.name.toLowerCase().includes('indian premier league') || 
         series.name.toLowerCase().includes('ipl'))) {
      return true;
    }
    
    return false;
  };

  // Get team icons for the series
  const getTeamIcons = () => {
    // Check if this is an IPL series
    const isIpl = series && series.name && 
      (series.name.toLowerCase().includes('indian premier league') || 
       series.name.toLowerCase().includes('ipl'));
       
    // If no teams are specified but it's an IPL series, use default IPL teams
    if (isIpl && (!series.teams || !Array.isArray(series.teams) || series.teams.length === 0)) {
      return [
        { 
          name: 'Chennai Super Kings', 
          shortname: 'CSK', 
          icon: '/assets/images/teams/csk.svg',
          captain: 'MS Dhoni',
          coach: 'Stephen Fleming'
        },
        { 
          name: 'Mumbai Indians', 
          shortname: 'MI', 
          icon: '/assets/images/teams/mi.svg',
          captain: 'Hardik Pandya',
          coach: 'Mark Boucher'
        },
        { 
          name: 'Royal Challengers Bangalore', 
          shortname: 'RCB', 
          icon: '/assets/images/teams/rcb.svg',
          captain: 'Faf du Plessis',
          coach: 'Andy Flower'
        },
        { 
          name: 'Delhi Capitals', 
          shortname: 'DC', 
          icon: '/assets/images/teams/dc.svg',
          captain: 'Rishabh Pant',
          coach: 'Ricky Ponting'
        },
        { 
          name: 'Kolkata Knight Riders', 
          shortname: 'KKR', 
          icon: '/assets/images/teams/kkr.svg',
          captain: 'Shreyas Iyer',
          coach: 'Chandrakant Pandit'
        },
        { 
          name: 'Punjab Kings', 
          shortname: 'PBKS', 
          icon: '/assets/images/teams/pbks.svg',
          captain: 'Shikhar Dhawan',
          coach: 'Trevor Bayliss'
        },
        { 
          name: 'Rajasthan Royals', 
          shortname: 'RR', 
          icon: '/assets/images/teams/rr.svg',
          captain: 'Sanju Samson',
          coach: 'Kumar Sangakkara'
        },
        { 
          name: 'Sunrisers Hyderabad', 
          shortname: 'SRH', 
          icon: '/assets/images/teams/srh.svg',
          captain: 'Pat Cummins',
          coach: 'Daniel Vettori'
        },
        { 
          name: 'Gujarat Titans', 
          shortname: 'GT', 
          icon: '/assets/images/teams/gt.svg',
          captain: 'Shubman Gill',
          coach: 'Ashish Nehra'
        },
        { 
          name: 'Lucknow Super Giants', 
          shortname: 'LSG', 
          icon: '/assets/images/teams/lsg.svg',
          captain: 'KL Rahul',
          coach: 'Justin Langer'
        }
      ];
    }
    
    if (!series || !series.teams || !Array.isArray(series.teams)) {
      return [];
    }
    
    return series.teams.map(team => {
      // Handle both string and object formats for team
      const teamName = typeof team === 'string' ? team.trim() : (team.name ? team.name.trim() : '');
      const teamShortname = typeof team === 'object' && team.shortname ? team.shortname : '';
      const teamInitial = teamName.charAt(0).toUpperCase();
      
      // For IPL teams, use specific icons
      let teamIcon = '';
      if (teamName.includes('Chennai') || teamName.includes('CSK') || teamShortname === 'CSK') {
        teamIcon = '/assets/images/teams/csk.svg';
      } else if (teamName.includes('Mumbai') || teamName.includes('MI') || teamShortname === 'MI') {
        teamIcon = '/assets/images/teams/mi.svg';
      } else if (teamName.includes('Bangalore') || teamName.includes('RCB') || teamShortname === 'RCB') {
        teamIcon = '/assets/images/teams/rcb.svg';
      } else if (teamName.includes('Kolkata') || teamName.includes('KKR') || teamShortname === 'KKR') {
        teamIcon = '/assets/images/teams/kkr.svg';
      } else if (teamName.includes('Hyderabad') || teamName.includes('SRH') || teamShortname === 'SRH') {
        teamIcon = '/assets/images/teams/srh.svg';
      } else if (teamName.includes('Delhi') || teamName.includes('DC') || teamShortname === 'DC') {
        teamIcon = '/assets/images/teams/dc.svg';
      } else if (teamName.includes('Punjab') || teamName.includes('PBKS') || teamShortname === 'PBKS') {
        teamIcon = '/assets/images/teams/pbks.svg';
      } else if (teamName.includes('Rajasthan') || teamName.includes('RR') || teamShortname === 'RR') {
        teamIcon = '/assets/images/teams/rr.svg';
      } else if (teamName.includes('Lucknow') || teamName.includes('LSG') || teamShortname === 'LSG') {
        teamIcon = '/assets/images/teams/lsg.svg';
      } else if (teamName.includes('Gujarat') || teamName.includes('GT') || teamShortname === 'GT') {
        teamIcon = '/assets/images/teams/gt.svg';
      }
      
      return {
        name: teamName,
        icon: teamIcon,
        initial: teamInitial
      };
    });
  };

  if (!series) {
    return <div>Loading series information...</div>;
  }

  return (
    <OverviewContainer>
      <OverviewHeader>
        <SectionTitle>Series Overview</SectionTitle>
      </OverviewHeader>
      
      <SeriesInfoContainer>
        <SeriesName>{series.name || 'Unnamed Series'}</SeriesName>
        
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Start Date</InfoLabel>
            <InfoValue>{formatDate(series.startDate)}</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>End Date</InfoLabel>
            <InfoValue>{formatDate(series.endDate)}</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Duration</InfoLabel>
            <InfoValue>{calculateDuration()} days</InfoValue>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Match Formats</InfoLabel>
            <FormatContainer>
              {hasFormat('test') && <FormatBadge><CricketIcon />Test</FormatBadge>}
              {hasFormat('odi') && <FormatBadge><CricketIcon />ODI</FormatBadge>}
              {hasFormat('t20') && <FormatBadge><CricketIcon />T20</FormatBadge>}
              {!hasFormat('test') && !hasFormat('odi') && !hasFormat('t20') && (
                <FormatBadge style={{ backgroundColor: '#f0f0f0', color: '#666' }}>
                  <CricketIcon />Not specified
                </FormatBadge>
              )}
            </FormatContainer>
          </InfoItem>
          
          <InfoItem>
            <InfoLabel>Teams</InfoLabel>
            <TeamsContainer>
              {getTeamIcons().map((team, index) => (
                <TeamItem key={index}>
                  <TeamIcon>
                    {team.icon ? (
                      <img src={team.icon} alt={team.name} />
                    ) : (
                      team.initial
                    )}
                  </TeamIcon>
                  <TeamDetails>
                    <TeamName>
                      {team.name}
                      {team.captain && <TeamInfo> | Captain: {team.captain}</TeamInfo>}
                      {team.coach && <TeamInfo> | Coach: {team.coach}</TeamInfo>}
                    </TeamName>
                  </TeamDetails>
                </TeamItem>
              ))}
              {getTeamIcons().length === 0 && (
                <NoTeamsMessage>Teams not specified</NoTeamsMessage>
              )}
            </TeamsContainer>
          </InfoItem>
        </InfoGrid>
      </SeriesInfoContainer>
    </OverviewContainer>
  );
};

// Styled components
const OverviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${theme.colors.cardBackground};
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  padding: 0.8rem;
  margin-bottom: 1rem;
`;

const OverviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  color: ${theme.colors.primary};
  margin: 0;
`;

const SeriesInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SeriesName = styled.h3`
  font-size: 1.3rem;
  color: ${theme.colors.text.primary};
  margin: 0 0 0.8rem 0;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.text.secondary};
  margin-bottom: 0.3rem;
`;

const InfoValue = styled.span`
  font-size: 0.95rem;
  color: ${theme.colors.text.primary};
  font-weight: 500;
`;

const FormatContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const FormatBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  background-color: ${theme.colors.lightGray};
  color: ${theme.colors.text.primary};
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.8rem;
`;

const CricketIcon = styled.div`
  width: 12px;
  height: 12px;
  background-color: ${theme.colors.darkGray};
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'%3E%3Cpath d='M496.5 127.5l-15.9 15.9-67.1-67.1 15.9-15.9c18.8-18.8 49.2-18.8 67.1 0 18.9 18.8 18.9 49.2 0 67.1zM63.7 399.8l-15.9 15.9-67.1-67.1 15.9-15.9c18.8-18.8 49.2-18.8 67.1 0 18.8 18.8 18.8 49.2 0 67.1zM337.7 126.6L126.6 337.7l47.8 47.8 211.1-211.1-47.8-47.8zm-24.5 24.5l23.3 23.3-185.4 185.4-23.3-23.3 185.4-185.4zm-47.8-47.8l23.3 23.3-185.4 185.4-23.3-23.3 185.4-185.4zm-47.8-47.8l23.3 23.3-185.4 185.4-23.3-23.3 185.4-185.4z'/%3E%3C/svg%3E") no-repeat center center;
  mask-size: contain;
`;

const TeamsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  overflow: visible;
`;

const TeamItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 6px;
  background-color: ${theme.colors.background.light};
  border-radius: 4px;
  padding: 6px 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  width: 100%;
  min-width: 0;
  overflow: visible;
`;

const TeamIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const TeamDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-grow: 1;
  min-width: 0;
  overflow: visible;
`;

const TeamName = styled.span`
  font-weight: 600;
  color: ${theme.colors.text.primary};
  white-space: normal;
  overflow: visible;
  text-overflow: clip;
  display: inline;
  align-items: center;
  width: 100%;
  font-size: 0.85rem;
`;

const TeamInfo = styled.span`
  font-size: 0.8rem;
  font-weight: normal;
  color: ${theme.colors.text.secondary};
  margin-left: 4px;
  white-space: normal;
`;

const NoTeamsMessage = styled.span`
  color: ${theme.colors.text.secondary};
  font-style: italic;
  font-size: 0.85rem;
`;

export default SeriesOverview;
