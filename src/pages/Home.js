import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import theme from '../utils/theme';
import axiosClient from '../services/axiosClient';
import IPLTodaysMatch from '../components/matches/IPLTodaysMatch';

const HomeContainer = styled.div`
  padding: 0.5rem 1.5rem 1.5rem;
`;

const HeroSection = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 2rem 2rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  text-align: center;
  
  h1 {
    color: white;
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    max-width: 800px;
    margin: 0 auto 1.5rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1rem;
    border-bottom: 2px solid ${props => props.theme.colors.secondary};
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;
    
    img {
      width: 24px;
      height: 24px;
      margin-right: 10px;
    }
    
    a {
      color: inherit;
      text-decoration: none;
      display: flex;
      align-items: center;
      width: 100%;
      
      &:hover {
        text-decoration: none;
      }
    }
  }
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const IPLCard = styled.div`
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  }
`;

const IPLBanner = styled.div`
  position: relative;
  height: 140px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  }
`;

const IPLTitle = styled.div`
  position: absolute;
  bottom: 15px;
  left: 20px;
  color: white;
  z-index: 1;
  
  h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 700;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
  
  p {
    margin: 5px 0 0;
    font-size: 0.8rem;
    opacity: 0.9;
  }
`;

const IPLContent = styled.div`
  padding: 15px;
  
  h3 {
    margin: 10px 0;
    font-size: 1.1rem;
    color: ${props => props.theme.colors.text.primary};
  }
`;

const IPLStats = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const StatItem = styled.div`
  text-align: center;
  
  .number {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${props => props.theme.colors.primary};
  }
  
  .label {
    font-size: 0.8rem;
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const IPLMatchesList = styled.div`
  margin-bottom: 15px;
`;

const IPLMatch = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: ${props => props.theme.colors.background.light};
  margin-bottom: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const IPLTeams = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  font-size: 0.9rem;
`;

const IPLTeamLogo = styled.div`
  width: 24px;
  height: 24px;
  margin: 0 5px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

const IPLVersus = styled.span`
  margin: 0 8px;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.8rem;
`;

const IPLMatchInfo = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.8rem;
`;

const IPLLinks = styled.div`
  display: flex;
  justify-content: space-between;
`;

const IPLLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 500;
  font-size: 0.85rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #A30015;
    text-decoration: none;
    color: white;
  }
  
  svg {
    margin-left: 5px;
  }
`;

const UpcomingMatchesSection = styled.div`
  background-color: ${props => props.theme.colors.tertiary};
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  
  h2 {
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.primary};
    display: flex;
    align-items: center;
    
    img {
      width: 28px;
      height: 28px;
      margin-right: 10px;
    }
  }
`;

const MatchCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
    text-align: center;
  }
`;

const TeamVsTeam = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-bottom: 1rem;
  }
`;

const TeamName = styled.span`
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  
  img {
    width: 30px;
    height: 30px;
    margin-right: 8px;
  }
`;

const Versus = styled.span`
  margin: 0 1rem;
  color: ${props => props.theme.colors.secondary};
  font-weight: bold;
`;

const MatchInfo = styled.div`
  text-align: right;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    text-align: center;
  }
`;

const MatchDate = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const MatchVenue = styled.div`
  color: ${props => props.theme.colors.darkGray};
`;

const CTASection = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding: 3rem 2rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 8px;
  
  h2 {
    color: white;
    margin-bottom: 1.5rem;
  }
  
  p {
    max-width: 800px;
    margin: 0 auto 2rem;
    font-size: 1.1rem;
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: bold;
  font-size: 1.1rem;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #A30015;
    text-decoration: none;
    color: white;
  }
  
  svg {
    margin-left: 5px;
  }
`;

const LiveMatchSection = styled.div`
  background: linear-gradient(135deg, #003366 0%, #004080 100%);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: 0;
  }
`;

const LiveBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #ff4444;
  color: white;
  font-weight: bold;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
`;

const LiveDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  margin-right: 5px;
  animation: ${keyframes`
    0% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
    100% { opacity: 0.5; transform: scale(1); }
  `} 1.5s infinite;
`;

const LiveMatchContent = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 1;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const LiveMatchInfo = styled.div`
  color: white;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 2rem;
  }
  
  h3 {
    color: white;
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin-bottom: 0.5rem;
    opacity: 0.9;
  }
`;

const LiveMatchTeams = styled.div`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

const LiveTeamName = styled.div`
  text-align: center;
  font-weight: bold;
  font-size: 1.2rem;
`;

const LiveTeamScore = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  margin-top: 0.3rem;
`;

const LiveVersus = styled.div`
  margin: 0 1.5rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
`;

const LiveMatchCTA = styled(Link)`
  display: inline-block;
  background-color: #ff9900;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s, transform 0.3s;
  text-align: center;
  
  @media (min-width: 768px) {
    min-width: 200px;
  }
  
  &:hover {
    background-color: #ffaa22;
    transform: translateY(-2px);
    text-decoration: none;
    color: white;
  }
`;

const LiveMatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const LiveMatchCard = styled(Link)`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  text-decoration: none;
  color: inherit;
  display: block;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
    text-decoration: none;
    color: inherit;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background-color: ${props => props.theme.colors.primary};
  }
`;

const MatchStatus = styled.div`
  display: inline-block;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
  color: white;
  background-color: ${props => {
    if (props.status === 'Live') return '#ff4444';
    if (props.status === 'Completed') return '#4caf50';
    return '#ff9800'; // Upcoming
  }};
`;

const MatchTitle = styled.h3`
  margin-bottom: 0.8rem;
  color: ${props => props.theme.colors.primary};
  font-size: 1.1rem;
`;

const MatchVenueDate = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: 1rem;
`;

const ScoreContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

const TeamScore = styled.div`
  text-align: ${props => props.align};
  flex: 1;
`;

const TeamNameDisplay = styled.div`
  font-weight: bold;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
`;

const Score = styled.div`
  font-size: ${props => props.empty ? '0.9rem' : '1.2rem'};
  font-weight: ${props => props.empty ? 'normal' : 'bold'};
  color: ${props => props.empty ? '#666' : 'inherit'};
`;

const ViewMatchButton = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-align: center;
  padding: 0.5rem;
  border-radius: 4px;
  margin-top: 1rem;
  font-weight: bold;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const NoMatchesMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 2rem;
`;

const RefreshButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 1rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.theme.colors.secondary};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const TeamLogo = styled.div`
  width: 32px;
  height: 32px;
  margin-right: 8px;
  
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
  }
`;

const IPLNewsSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const IPLNewsHeader = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IPLNewsTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  color: white;
  
  svg {
    margin-right: 10px;
  }
`;

const IPLNewsContent = styled.div`
  padding: 1.5rem;
`;

const IPLNewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const IPLNewsItem = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f9f9f9;
  border-radius: 8px;
  overflow: hidden;
  height: 100%;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const IPLNewsImage = styled.div`
  width: 100%;
  height: 160px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const IPLNewsDetails = styled.div`
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const IPLNewsHeadline = styled.h3`
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: ${props => props.theme.colors.primary};
`;

const IPLNewsDate = styled.p`
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.textLight};
`;

const IPLNewsSummary = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: ${props => props.theme.colors.text};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ReadMoreLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: 0.5rem;
  display: inline-block;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ViewAllNewsLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  font-weight: bold;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  svg {
    margin-left: 5px;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #A30015;
    text-decoration: none;
    color: white;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background-color: transparent;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;
  border: 2px solid white;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
    color: white;
  }
`;

const IPLLiveMatchSection = styled.div`
  margin-bottom: 15px;
`;

const IPLLiveMatch = styled.div`
  background-color: ${props => props.theme.colors.background.light};
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 8px;
  position: relative;
  border-left: 3px solid #ff4444;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const IPLLiveStatus = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ff4444;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background-color: white;
    border-radius: 50%;
    margin-right: 4px;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
    100% {
      opacity: 1;
    }
  }
`;

const IPLLiveScores = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid ${props => props.theme.colors.border};
  font-size: 0.9rem;
`;

const IPLTeamScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${props => props.align};
  flex: 1;
  
  .team-name {
    font-weight: 600;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    ${props => props.align === 'flex-end' ? 'flex-direction: row-reverse;' : ''}
  }
  
  .score {
    font-weight: 700;
    color: ${props => props.theme.colors.text.primary};
  }
  
  img {
    width: 20px;
    height: 20px;
    margin: ${props => props.align === 'flex-end' ? '0 0 0 5px' : '0 5px 0 0'};
  }
`;

const IPLMatchStatus = styled.div`
  text-align: center;
  font-size: 0.8rem;
  color: ${props => props.theme.colors.text.secondary};
  margin: 0 10px;
  flex: 0.5;
`;

const Home = () => {
  const [liveMatches, setLiveMatches] = useState([]);
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [completedMatches, setCompletedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaysMatches, setTodaysMatches] = useState([]);
  const [todaysMatchesLoading, setTodaysMatchesLoading] = useState(true);
  const [iplNews, setIplNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState(null);
  const [usingMockNews, setUsingMockNews] = useState(false);
  const [liveMatchData, setLiveMatchData] = useState(null);
  const [liveMatchLoading, setLiveMatchLoading] = useState(true);
  const [liveMatchError, setLiveMatchError] = useState(null);

  // Mock IPL news data for fallback
  const mockIplNews = [
    {
      id: 1,
      title: "IPL 2025 Schedule Announced: Season to Begin on March 22",
      summary: "The Board of Control for Cricket in India (BCCI) has announced the schedule for the 2025 Indian Premier League. The tournament will begin on March 22 with defending champions Mumbai Indians taking on Chennai Super Kings.",
      date: "2025-03-10",
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "Virat Kohli Aims for Record-Breaking Season in IPL 2025",
      summary: "Royal Challengers Bangalore star Virat Kohli has set his sights on breaking the record for most runs in a single IPL season. The former India captain has been in exceptional form in recent months.",
      date: "2025-03-09",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "New AI-Powered Analytics to Transform Cricket Strategy",
      summary: "Teams are increasingly turning to artificial intelligence and advanced analytics to gain a competitive edge. The upcoming IPL season will see teams employ sophisticated data analysis tools to inform their strategies.",
      date: "2025-03-08",
      image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
  ];

  // IPL Series ID
  const IPL_SERIES_ID = 'd5a498c8-7596-4b93-8ab0-e0efc3345312';
  const LIVE_MATCH_ID = '7431523f-7ccb-4a4a-aed7-5c42fc08464c'; // CSK vs RCB match ID

  // Helper function to get correct team image path - moved outside to be reusable
  const getTeamImagePath = (teamName) => {
    if (!teamName) return '/assets/images/teams/default.svg';
    
    // Map team names to their correct image file names
    const teamImageMap = {
      'Chennai Super Kings': 'csk',
      'Delhi Capitals': 'dc',
      'Gujarat Titans': 'gt',
      'Kolkata Knight Riders': 'kkr',
      'Lucknow Super Giants': 'lsg',
      'Mumbai Indians': 'mi',
      'Punjab Kings': 'pbks',
      'Royal Challengers Bengaluru': 'rcb',
      'Royal Challengers Bangalore': 'rcb', // Handle both naming variations
      'Rajasthan Royals': 'rr',
      'Sunrisers Hyderabad': 'srh'
    };
    
    // Get the correct image file name or use a default
    const imageFileName = teamImageMap[teamName] || teamName.toLowerCase().replace(/\s+/g, '-');
    return `/assets/images/teams/${imageFileName}.svg`;
  };

  // Function to fetch matches from API
  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching matches...');
      
      // Try to fetch from the series_info endpoint
      const response = await axiosClient.get(`series_info?id=${IPL_SERIES_ID}`);
      
      console.log('API Response:', response.data);
      
      if (response.data && response.data.data && response.data.data.matchList) {
        console.log('Successfully fetched matches');
        
        // Process matches
        const allMatches = response.data.data.matchList.map(match => {
          // Format the match data
          return {
            ...match,
            teamInfo: match.teamInfo ? match.teamInfo.map(team => ({
              ...team,
              img: getTeamImagePath(team.name)
            })) : []
          };
        });
        
        // Sort matches into categories
        const now = new Date();
        
        const liveMatches = allMatches.filter(match => 
          match.matchStarted && !match.matchEnded
        );
        
        const upcomingMatches = allMatches.filter(match => 
          !match.matchStarted
        ).sort((a, b) => new Date(a.dateTimeGMT) - new Date(b.dateTimeGMT));
        
        const completedMatches = allMatches.filter(match => 
          match.matchEnded
        ).sort((a, b) => new Date(b.dateTimeGMT) - new Date(a.dateTimeGMT));
        
        setLiveMatches(liveMatches);
        setUpcomingMatches(upcomingMatches);
        setCompletedMatches(completedMatches);
        
        // Cache the data
        try {
          sessionStorage.setItem('iplMatches', JSON.stringify({
            live: liveMatches,
            upcoming: upcomingMatches,
            completed: completedMatches
          }));
          sessionStorage.setItem('iplMatchesTimestamp', new Date().getTime());
          console.log('Cached matches in sessionStorage');
        } catch (cacheError) {
          console.error('Failed to cache matches:', cacheError);
        }
      } else {
        console.warn('No match data found in API response');
        throw new Error('No match data found in API response');
      }
    } catch (error) {
      console.error('Error fetching matches:', error.message);
      setError(error.message);
      
      // Try to use cached data first
      try {
        const cachedMatches = sessionStorage.getItem('iplMatches');
        const cacheTimestamp = sessionStorage.getItem('iplMatchesTimestamp');
        
        if (cachedMatches && cacheTimestamp) {
          const cacheAge = new Date().getTime() - cacheTimestamp;
          // Use cache if it's less than 30 minutes old
          if (cacheAge < 30 * 60 * 1000) {
            console.log('Using cached matches (less than 30 minutes old)');
            setLiveMatches(JSON.parse(cachedMatches).live);
            setUpcomingMatches(JSON.parse(cachedMatches).upcoming);
            setCompletedMatches(JSON.parse(cachedMatches).completed);
            setLoading(false);
            return;
          }
        }
      } catch (cacheError) {
        console.error('Error using cached matches:', cacheError);
      }
      
      // If no valid cache, use mock data
      const mockMatches = {
        live: [
          {
            id: 'mock-live-1',
            name: 'Royal Challengers Bangalore vs Chennai Super Kings',
            status: 'Royal Challengers Bangalore won the toss and elected to bat',
            venue: 'M. Chinnaswamy Stadium, Bangalore',
            date: '2025-03-29',
            dateTimeGMT: new Date().toISOString(),
            teams: ['Royal Challengers Bangalore', 'Chennai Super Kings'],
            teamInfo: [
              { name: 'Royal Challengers Bangalore', shortname: 'RCB', img: '/assets/images/teams/royal-challengers-bangalore.svg' },
              { name: 'Chennai Super Kings', shortname: 'CSK', img: '/assets/images/teams/chennai-super-kings.svg' }
            ],
            score: [
              { team: 'Royal Challengers Bangalore', inning: '1', r: 142, w: 4, o: 16.3 },
              { team: 'Chennai Super Kings', inning: '1', r: 0, w: 0, o: 0 }
            ],
            matchStarted: true,
            matchEnded: false
          }
        ],
        upcoming: [
          {
            id: 'mock-upcoming-1',
            name: 'Royal Challengers Bangalore vs Kolkata Knight Riders',
            status: 'Match starts at 7:30 PM',
            venue: 'M. Chinnaswamy Stadium, Bangalore',
            date: '2025-03-30',
            dateTimeGMT: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
            teams: ['Royal Challengers Bangalore', 'Kolkata Knight Riders'],
            teamInfo: [
              { name: 'Royal Challengers Bangalore', shortname: 'RCB' },
              { name: 'Kolkata Knight Riders', shortname: 'KKR' }
            ],
            matchStarted: false,
            matchEnded: false
          },
          {
            id: 'mock-upcoming-2',
            name: 'Delhi Capitals vs Rajasthan Royals',
            status: 'Match starts at 3:30 PM',
            venue: 'Arun Jaitley Stadium, Delhi',
            date: '2025-03-31',
            dateTimeGMT: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            teams: ['Delhi Capitals', 'Rajasthan Royals'],
            teamInfo: [
              { name: 'Delhi Capitals', shortname: 'DC' },
              { name: 'Rajasthan Royals', shortname: 'RR' }
            ],
            matchStarted: false,
            matchEnded: false
          }
        ],
        completed: [
          {
            id: 'mock-completed-1',
            name: 'Gujarat Titans vs Punjab Kings',
            status: 'Gujarat Titans won by 6 wickets',
            venue: 'Narendra Modi Stadium, Ahmedabad',
            date: '2025-03-28',
            dateTimeGMT: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
            teams: ['Gujarat Titans', 'Punjab Kings'],
            teamInfo: [
              { name: 'Gujarat Titans', shortname: 'GT' },
              { name: 'Punjab Kings', shortname: 'PBKS' }
            ],
            score: [
              { team: 'Punjab Kings', inning: '1', r: 165, w: 10, o: 19.4 },
              { team: 'Gujarat Titans', inning: '1', r: 166, w: 4, o: 18.2 }
            ],
            matchStarted: true,
            matchEnded: true
          },
          {
            id: 'mock-completed-2',
            name: 'Sunrisers Hyderabad vs Lucknow Super Giants',
            status: 'Sunrisers Hyderabad won by 22 runs',
            venue: 'Rajiv Gandhi International Stadium, Hyderabad',
            date: '2025-03-27',
            dateTimeGMT: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            teams: ['Sunrisers Hyderabad', 'Lucknow Super Giants'],
            teamInfo: [
              { name: 'Sunrisers Hyderabad', shortname: 'SRH' },
              { name: 'Lucknow Super Giants', shortname: 'LSG' }
            ],
            score: [
              { team: 'Sunrisers Hyderabad', inning: '1', r: 182, w: 6, o: 20 },
              { team: 'Lucknow Super Giants', inning: '1', r: 160, w: 8, o: 20 }
            ],
            matchStarted: true,
            matchEnded: true
          }
        ]
      };
      
      setLiveMatches(mockMatches.live);
      setUpcomingMatches(mockMatches.upcoming);
      setCompletedMatches(mockMatches.completed);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch specific live match data
  const fetchLiveMatchData = async () => {
    setLiveMatchLoading(true);
    setLiveMatchError(null);
    
    try {
      console.log('Fetching specific live match data...');
      
      // Use the match_info endpoint with the specific match ID
      const response = await axiosClient.get(`match_info?id=${LIVE_MATCH_ID}`, {
        timeout: 15000 // Increase timeout for better reliability
      });
      
      console.log('Live Match API Response:', response.data);
      
      if (response.data && response.data.data) {
        const matchData = response.data.data;
        console.log('Successfully fetched live match data');
        
        // Determine which team is batting from the score data
        let battingTeamIndex = 0;
        let nonBattingTeamIndex = 1;
        
        if (matchData.score && matchData.score.length > 0) {
          // Check which team is batting based on the inning information
          const inningInfo = matchData.score[0].inning;
          if (inningInfo && inningInfo.includes(matchData.teams[1])) {
            // If team 2 is batting
            battingTeamIndex = 1;
            nonBattingTeamIndex = 0;
          }
        }
        
        // Format the match data to match our expected structure with correct batting order
        const formattedMatch = {
          id: matchData.id,
          name: matchData.name,
          status: matchData.status,
          venue: matchData.venue,
          date: matchData.date,
          dateTimeGMT: matchData.dateTimeGMT,
          teams: [
            matchData.teams[battingTeamIndex],
            matchData.teams[nonBattingTeamIndex]
          ],
          teamInfo: [
            { 
              name: matchData.teams[battingTeamIndex], 
              shortname: matchData.teams[battingTeamIndex].split(' ').map(word => word[0]).join(''),
              img: getTeamImagePath(matchData.teams[battingTeamIndex])
            },
            { 
              name: matchData.teams[nonBattingTeamIndex], 
              shortname: matchData.teams[nonBattingTeamIndex].split(' ').map(word => word[0]).join(''),
              img: getTeamImagePath(matchData.teams[nonBattingTeamIndex])
            }
          ],
          score: [
            { team: matchData.teams[battingTeamIndex], inning: '1', r: matchData.score[0].r, w: matchData.score[0].w, o: matchData.score[0].o },
            { team: matchData.teams[nonBattingTeamIndex], inning: '1', r: 0, w: 0, o: 0 }
          ],
          matchStarted: matchData.matchStarted,
          matchEnded: matchData.matchEnded
        };
        
        setLiveMatchData(formattedMatch);
        
        // Cache the data
        try {
          sessionStorage.setItem('iplLiveMatch', JSON.stringify(formattedMatch));
          sessionStorage.setItem('iplLiveMatchTimestamp', new Date().getTime());
          console.log('Cached live match data in sessionStorage');
        } catch (cacheError) {
          console.error('Failed to cache live match data:', cacheError);
        }
      } else {
        console.warn('No live match data found in API response');
        throw new Error('No live match data found in API response');
      }
    } catch (error) {
      console.error('Error fetching live match data:', error.message);
      setLiveMatchError(error.message);
      
      // Try to use cached data first
      try {
        const cachedMatch = sessionStorage.getItem('iplLiveMatch');
        const cacheTimestamp = sessionStorage.getItem('iplLiveMatchTimestamp');
        
        if (cachedMatch && cacheTimestamp) {
          const cacheAge = new Date().getTime() - cacheTimestamp;
          // Use cache if it's less than 30 minutes old
          if (cacheAge < 30 * 60 * 1000) {
            console.log('Using cached live match data (less than 30 minutes old)');
            setLiveMatchData(JSON.parse(cachedMatch));
            setLiveMatchLoading(false);
            return;
          }
        }
      } catch (cacheError) {
        console.error('Error using cached live match data:', cacheError);
      }
      
      // If no valid cache, use mock data
      const mockLiveMatch = {
        id: 'mock-live-1',
        name: 'Royal Challengers Bangalore vs Chennai Super Kings',
        status: 'Royal Challengers Bangalore won the toss and elected to bat',
        venue: 'M. Chinnaswamy Stadium, Bangalore',
        date: '2025-03-29',
        dateTimeGMT: new Date().toISOString(),
        teams: ['Royal Challengers Bangalore', 'Chennai Super Kings'],
        teamInfo: [
          { name: 'Royal Challengers Bangalore', shortname: 'RCB', img: '/assets/images/teams/royal-challengers-bangalore.svg' },
          { name: 'Chennai Super Kings', shortname: 'CSK', img: '/assets/images/teams/chennai-super-kings.svg' }
        ],
        score: [
          { team: 'Royal Challengers Bangalore', inning: '1', r: 142, w: 4, o: 16.3 },
          { team: 'Chennai Super Kings', inning: '1', r: 0, w: 0, o: 0 }
        ],
        matchStarted: true,
        matchEnded: false
      };
      setLiveMatchData(mockLiveMatch);
    } finally {
      setLiveMatchLoading(false);
    }
  };

  // Function to fetch news
  const fetchNews = async () => {
    setNewsLoading(true);
    setNewsError(null);
    
    try {
      console.log('Fetching IPL news...');
      const response = await axiosClient.get('news?id=' + IPL_SERIES_ID, {
        timeout: 15000 // Increase timeout for better reliability
      });
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        console.log('Successfully fetched news data:', response.data.data);
        setIplNews(response.data.data);
        setUsingMockNews(false);
        
        // Cache the news data
        try {
          sessionStorage.setItem('iplNews', JSON.stringify(response.data.data));
          sessionStorage.setItem('iplNewsTimestamp', new Date().getTime());
          console.log('Cached news data in sessionStorage');
        } catch (cacheError) {
          console.error('Failed to cache news data:', cacheError);
        }
      } else {
        console.warn('No news data found in API response');
        loadFallbackNews();
      }
    } catch (error) {
      console.error('Error fetching news:', error.message);
      setNewsError(error.message);
      
      // Try to use cached data first
      loadFallbackNews();
    } finally {
      setNewsLoading(false);
    }
  };

  // Function to load fallback news data
  const loadFallbackNews = () => {
    console.log('Using fallback news data...');
    
    // First try to use cached news if available and not too old
    try {
      const cachedNews = sessionStorage.getItem('iplNews');
      
      if (cachedNews) {
        const newsData = JSON.parse(cachedNews);
        const cacheAge = new Date().getTime() - sessionStorage.getItem('iplNewsTimestamp');
        
        // Only use cache if it's less than 2 hours old
        if (cacheAge < 2 * 60 * 60 * 1000) {
          console.log('Using cached news data (less than 2 hours old)');
          setIplNews(newsData);
          setUsingMockNews(true);
          return;
        } else {
          console.log(`Cached news data is too old (${Math.round(cacheAge/60000)} minutes)`);
        }
      } else {
        console.log('No cached news data found in sessionStorage');
      }
    } catch (cacheError) {
      console.error('Failed to use cached news data:', cacheError);
    }
    
    // If no valid cache, use mock news data
    console.log('Using mock news data');
    setIplNews(mockIplNews);
    setUsingMockNews(true);
  };

  // Fetch matches on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMatches();
        await fetchLiveMatchData();
      } catch (error) {
        console.error('Error in initial data fetch:', error);
      }
    };
    
    fetchData();
    
    // Also fetch news data
    fetchNews();
    
    // Set up a refresh interval (every 5 minutes)
    const refreshInterval = setInterval(() => {
      console.log('Auto-refreshing match and news data...');
      fetchMatches();
      fetchLiveMatchData();
      fetchNews();
    }, 5 * 60 * 1000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []);

  return (
    <HomeContainer>
      <HeroSection>
        <h1>IPL Cricket Analytics</h1>
        <p>
          Dive deep into cricket data with comprehensive analytics, visualizations, and insights.
          Track player performance, analyze match statistics, and discover trends.
        </p>
        <HeroButtons>
          <PrimaryButton to="/matches">Explore Matches</PrimaryButton>
          <SecondaryButton to="/players">Player Stats</SecondaryButton>
        </HeroButtons>
      </HeroSection>
      
      {/* IPL News Section */}
      <IPLNewsSection>
        <IPLNewsHeader>
          <IPLNewsTitle>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42l-3.3 3.31c-.18.18-.18.49 0 .67l3.3 3.3c.18.18.49.18.67 0l2.93-2.93c.18-.18.18-.49 0-.67l-2.93-2.93c-.18-.18-.49-.18-.67 0z" fill="#fff"/>
            </svg>
            IPL News
          </IPLNewsTitle>
          <ViewAllNewsLink to="/news">
            View All News
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ViewAllNewsLink>
        </IPLNewsHeader>
        <IPLNewsContent>
          {newsLoading ? (
            <div style={{ padding: '15px', textAlign: 'center' }}>
              <div className="spinner"></div>
              <p>Loading news...</p>
            </div>
          ) : iplNews.length > 0 ? (
            <IPLNewsGrid>
              {iplNews.map(news => (
                <IPLNewsItem key={news.id}>
                  <IPLNewsImage>
                    <img src={news.image} alt={news.title} onError={(e) => { e.target.src = 'https://source.unsplash.com/random/300x200?cricket'; }} />
                  </IPLNewsImage>
                  <IPLNewsDetails>
                    <IPLNewsHeadline>{news.title}</IPLNewsHeadline>
                    <IPLNewsDate>{new Date(news.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</IPLNewsDate>
                    <IPLNewsSummary>{news.summary}</IPLNewsSummary>
                    <ReadMoreLink to={`/news/${news.id}`}>Read More</ReadMoreLink>
                  </IPLNewsDetails>
                </IPLNewsItem>
              ))}
            </IPLNewsGrid>
          ) : (
            <div style={{ padding: '15px', textAlign: 'center', color: '#666' }}>
              No news available
            </div>
          )}
          {usingMockNews && (
            <div style={{ padding: '10px', textAlign: 'center', fontSize: '0.8rem', color: '#888', fontStyle: 'italic' }}>
              Using cached news data
            </div>
          )}
        </IPLNewsContent>
      </IPLNewsSection>
      
      <IPLCard>
        <IPLBanner>
          <img src="/assets/images/banners/IPL_CardHeader_1.png" alt="IPL 2025" />
          <IPLTitle>
            <h2>Indian Premier League 2025</h2>
            <p>March 22 - May 26, 2025</p>
          </IPLTitle>
        </IPLBanner>
        <IPLContent>
          <IPLStats>
            <StatItem>
              <div className="number">74</div>
              <div className="label">Matches</div>
            </StatItem>
            <StatItem>
              <div className="number">10</div>
              <div className="label">Teams</div>
            </StatItem>
            <StatItem>
              <div className="number">220</div>
              <div className="label">Players</div>
            </StatItem>
          </IPLStats>
          
          {/* IPL Live Match Section */}
          <h3 style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '8px', 
              height: '8px', 
              backgroundColor: '#ff4444', 
              borderRadius: '50%', 
              marginRight: '8px',
              animation: 'pulse 1.5s infinite'
            }}></span>
            Live Matches
          </h3>
          <IPLMatchesList>
            {liveMatchData && liveMatchData.matchStarted && !liveMatchData.matchEnded ? (
              <IPLLiveMatch key={liveMatchData.id}>
                <IPLLiveStatus>LIVE</IPLLiveStatus>
                <IPLTeams>
                  <span>{liveMatchData.teams && liveMatchData.teams[0] ? liveMatchData.teams[0] : 'Team 1'}</span>
                  <IPLVersus>vs</IPLVersus>
                  <span>{liveMatchData.teams && liveMatchData.teams[1] ? liveMatchData.teams[1] : 'Team 2'}</span>
                </IPLTeams>
                <IPLLiveScores>
                  <IPLTeamScore align="flex-start">
                    <div className="team-name">
                      <img 
                        src={`/assets/images/teams/${liveMatchData.teams && liveMatchData.teams[0] ? liveMatchData.teams[0].toLowerCase().replace(/\s+/g, '-') : 'default'}.svg`}
                        alt={liveMatchData.teams && liveMatchData.teams[0] ? liveMatchData.teams[0] : 'Team 1'} 
                        onError={(e) => { e.target.src = '/assets/images/teams/default.svg'; }} 
                      />
                      {liveMatchData.teamInfo && liveMatchData.teamInfo[0] && liveMatchData.teamInfo[0].shortname ? 
                        liveMatchData.teamInfo[0].shortname : 
                        (liveMatchData.teams && liveMatchData.teams[0] ? liveMatchData.teams[0].split(' ').map(word => word[0]).join('') : 'T1')}
                    </div>
                    <div className="score">
                      {liveMatchData.score && liveMatchData.score[0] ? 
                        `${liveMatchData.score[0].r}/${liveMatchData.score[0].w} (${liveMatchData.score[0].o})` : 
                        'Yet to bat'}
                    </div>
                  </IPLTeamScore>
                  
                  <IPLMatchStatus>
                    {liveMatchData.status}
                  </IPLMatchStatus>
                  
                  <IPLTeamScore align="flex-end">
                    <div className="team-name">
                      {liveMatchData.teamInfo && liveMatchData.teamInfo[1] && liveMatchData.teamInfo[1].shortname ? 
                        liveMatchData.teamInfo[1].shortname : 
                        (liveMatchData.teams && liveMatchData.teams[1] ? liveMatchData.teams[1].split(' ').map(word => word[0]).join('') : 'T2')}
                      <img 
                        src={`/assets/images/teams/${liveMatchData.teams && liveMatchData.teams[1] ? liveMatchData.teams[1].toLowerCase().replace(/\s+/g, '-') : 'default'}.svg`}
                        alt={liveMatchData.teams && liveMatchData.teams[1] ? liveMatchData.teams[1] : 'Team 2'} 
                        onError={(e) => { e.target.src = '/assets/images/teams/default.svg'; }} 
                      />
                    </div>
                    <div className="score">
                      {liveMatchData.score && liveMatchData.score.length > 1 ? 
                        `${liveMatchData.score[1].r}/${liveMatchData.score[1].w} (${liveMatchData.score[1].o})` : 
                        'Yet to bat'}
                    </div>
                  </IPLTeamScore>
                </IPLLiveScores>
              </IPLLiveMatch>
            ) : liveMatchLoading ? (
              <div style={{ padding: '10px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                Loading live match data...
              </div>
            ) : (
              <div style={{ padding: '10px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
                No live IPL matches at the moment
              </div>
            )}
          </IPLMatchesList>
          
          <h3>Today's Matches - {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
          <IPLMatchesList>
            <IPLTodaysMatch />
          </IPLMatchesList>
          
          <IPLLinks>
            <IPLLink to="/series/indian-premier-league-2025/matches">
              View All Matches
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IPLLink>
            <IPLLink to="/series/indian-premier-league-2025/live-points">
              Live Points
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </IPLLink>
          </IPLLinks>
        </IPLContent>
      </IPLCard>
      
      {/* Live Matches Section */}
      <IPLLiveMatchSection>
        <SectionHeader>
          <h2>
            <img src="/assets/images/icons/live_match.svg" alt="Live Matches Icon" style={{ width: '24px', height: '24px', marginRight: '10px' }} />
            Live Matches
          </h2>
          <div>
            <Link to="/live-matches" style={{ marginRight: '15px', textDecoration: 'none', color: theme.colors.primary, fontWeight: 'bold' }}>
              View All
            </Link>
            <RefreshButton onClick={fetchMatches}>
              Refresh Matches
            </RefreshButton>
          </div>
        </SectionHeader>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner"></div>
            <p>Loading matches...</p>
          </div>
        ) : error ? (
          <div style={{ color: 'red', padding: '1rem', textAlign: 'center' }}>{error}</div>
        ) : liveMatches.length > 0 ? (
          <LiveMatchesGrid>
            {liveMatches.map(match => (
              <LiveMatchCard key={match.id} to={`/live-match.html?id=${match.id}`}>
                <MatchStatus status={match.status}>{match.status}</MatchStatus>
                <MatchTitle>{match.name}</MatchTitle>
                <MatchVenueDate>{match.venue} • {new Date(match.dateTimeGMT).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric'
                })}</MatchVenueDate>
                
                <ScoreContainer>
                  <TeamScore align="left">
                    <TeamLogo>
                      {match.teamInfo && match.teamInfo[0] && match.teamInfo[0].img ? (
                        <img src={match.teamInfo[0].img} alt={match.teams && match.teams[0] ? match.teams[0] : 'Team 1'} onError={(e) => { e.target.src = '/assets/images/teams/default.svg'; }} />
                      ) : (
                        <div className="placeholder-logo">{match.teamInfo && match.teamInfo[0] && match.teamInfo[0].shortname ? match.teamInfo[0].shortname.charAt(0) : 'T'}</div>
                      )}
                    </TeamLogo>
                    <TeamNameDisplay>{match.teamInfo && match.teamInfo[0] && match.teamInfo[0].shortname ? match.teamInfo[0].shortname : (match.teams && match.teams[0] ? match.teams[0] : 'Team 1')}</TeamNameDisplay>
                    <Score empty={!match.score || !match.score[0]}>
                      {match.score && match.score[0] ? 
                        `${match.score[0].r}/${match.score[0].w} (${match.score[0].o})` : 
                        'Yet to bat'}
                    </Score>
                  </TeamScore>
                  
                  <MatchInfo>vs</MatchInfo>
                  
                  <TeamScore align="right">
                    <TeamLogo>
                      {match.teamInfo && match.teamInfo[1] && match.teamInfo[1].img ? (
                        <img src={match.teamInfo[1].img} alt={match.teams && match.teams[1] ? match.teams[1] : 'Team 2'} onError={(e) => { e.target.src = '/assets/images/teams/default.svg'; }} />
                      ) : (
                        <div className="placeholder-logo">{match.teamInfo && match.teamInfo[1] && match.teamInfo[1].shortname ? match.teamInfo[1].shortname.charAt(0) : 'T'}</div>
                      )}
                    </TeamLogo>
                    <TeamNameDisplay>{match.teamInfo && match.teamInfo[1] && match.teamInfo[1].shortname ? match.teamInfo[1].shortname : (match.teams && match.teams[1] ? match.teams[1] : 'Team 2')}</TeamNameDisplay>
                    <Score empty={!match.score || !match.score[1]}>
                      {match.score && match.score[1] ? 
                        `${match.score[1].r}/${match.score[1].w} (${match.score[1].o})` : 
                        'Yet to bat'}
                    </Score>
                  </TeamScore>
                </ScoreContainer>
                
                <LiveMatchCTA to={`/live-match.html?id=${match.id}`}>
                  Watch Live
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </LiveMatchCTA>
              </LiveMatchCard>
            ))}
          </LiveMatchesGrid>
        ) : (
          <NoMatchesMessage>
            <p>No live matches at the moment.</p>
            <p>Check back later or view upcoming matches below.</p>
          </NoMatchesMessage>
        )}
      </IPLLiveMatchSection>
      
      <UpcomingMatchesSection>
        <h2>
          <img src="/assets/images/icons/upcoming_matches.svg" alt="Upcoming Matches Icon" />
          Upcoming Matches
        </h2>
        {upcomingMatches
          .filter(match => {
            const matchDate = new Date(match.dateTimeGMT);
            const twoDaysFromNow = new Date();
            twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
            return matchDate <= twoDaysFromNow;
          })
          .slice(0, 3) // Limit to 3 matches maximum
          .map(match => (
          <MatchCard key={match.id}>
            <TeamVsTeam>
              <TeamName>
                <img 
                  src={match.teamInfo && match.teamInfo[0] && match.teamInfo[0].img 
                    ? match.teamInfo[0].img 
                    : `/assets/images/teams/${match.teams && match.teams[0] ? match.teams[0].toLowerCase().replace(/\s+/g, '-') : 'default'}.svg`} 
                  alt={match.teams && match.teams[0] ? match.teams[0] : 'Team 1'} 
                  onError={(e) => { e.target.src = '/assets/images/teams/default.svg'; }}
                />
                {match.teamInfo && match.teamInfo[0] && match.teamInfo[0].shortname ? 
                  match.teamInfo[0].shortname : 
                  (match.teams && match.teams[0] ? match.teams[0] : 'Team 1')}
              </TeamName>
              <Versus>vs</Versus>
              <TeamName>
                <img 
                  src={match.teamInfo && match.teamInfo[1] && match.teamInfo[1].img 
                    ? match.teamInfo[1].img 
                    : `/assets/images/teams/${match.teams && match.teams[1] ? match.teams[1].toLowerCase().replace(/\s+/g, '-') : 'default'}.svg`} 
                  alt={match.teams && match.teams[1] ? match.teams[1] : 'Team 2'} 
                  onError={(e) => { e.target.src = '/assets/images/teams/default.svg'; }}
                />
                {match.teamInfo && match.teamInfo[1] && match.teamInfo[1].shortname ? 
                  match.teamInfo[1].shortname : 
                  (match.teams && match.teams[1] ? match.teams[1] : 'Team 2')}
              </TeamName>
            </TeamVsTeam>
            <MatchInfo>
              <MatchDate>{new Date(match.dateTimeGMT).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}</MatchDate>
              <MatchVenue>{match.venue || 'Venue TBD'}</MatchVenue>
            </MatchInfo>
          </MatchCard>
        ))}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link to="/matches" className="btn" style={{ 
            backgroundColor: '#1565c0', 
            color: 'white', 
            padding: '0.75rem 1.5rem',
            borderRadius: '4px',
            fontWeight: 'bold',
            textDecoration: 'none',
            display: 'inline-block',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>View All Matches</Link>
        </div>
      </UpcomingMatchesSection>
      
      <FeaturesGrid>
        <FeatureCard>
          <h3>
            <Link to="/players">
              <img src="/assets/images/icons/batting_average.svg" alt="Player Analytics Icon" />
              Player Analytics
            </Link>
          </h3>
          <p>
            Dive deep into player statistics with comprehensive batting, bowling, and fielding analytics.
            Compare players, track performance trends, and discover hidden insights.
          </p>
          <Link to="/players" className="btn">Explore Players</Link>
        </FeatureCard>
        
        <FeatureCard>
          <h3>
            <Link to="/matches">
              <img src="/assets/images/icons/completed_matches.svg" alt="Match Analysis Icon" />
              Match Analysis
            </Link>
          </h3>
          <p>
            Get detailed match analysis with key moments, session-by-session breakdown, and performance metrics.
            Relive the excitement with comprehensive match coverage.
          </p>
          <Link to="/matches" className="btn">View Matches</Link>
        </FeatureCard>
        
        <FeatureCard>
          <h3>
            <Link to="/database-status">
              <img src="/assets/images/icons/database.svg" alt="Database Status Icon" />
              Database Status
            </Link>
          </h3>
          <p>
            Check the status of the database connection and view available tables.
            Useful for troubleshooting and verifying data availability.
          </p>
          <Link to="/database-status" className="btn">Check Status</Link>
        </FeatureCard>
        
        <FeatureCard>
          <h3>
            <Link to="/teams">
              <img src="/assets/images/icons/most_wins.svg" alt="Team Statistics Icon" />
              Team Statistics
            </Link>
          </h3>
          <p>
            Explore team performance metrics, head-to-head records, and strategic insights.
            Understand team strengths, weaknesses, and tactical approaches.
          </p>
          <Link to="/teams" className="btn">Team Stats</Link>
        </FeatureCard>
        
        <FeatureCard>
          <h3>
            <Link to="/insights">
              <img src="/assets/images/icons/runs_scored.svg" alt="AI Insights Icon" />
              AI Insights
            </Link>
          </h3>
          <p>
            Leverage the power of artificial intelligence for predictive analysis, performance forecasts,
            and strategic recommendations based on historical data.
          </p>
          <Link to="/insights" className="btn">AI Insights</Link>
        </FeatureCard>
      </FeaturesGrid>
      
      <CTASection>
        <h2>Experience Cricket Like Never Before</h2>
        <p>
          Our advanced analytics platform provides unprecedented insights into the game of cricket.
          Whether you're a casual fan or a serious analyst, our tools will enhance your understanding and enjoyment of the IPL 2025 season.
        </p>
        <CTAButton to="/analytics">Explore Analytics</CTAButton>
      </CTASection>
    </HomeContainer>
  );
};

export default Home;
