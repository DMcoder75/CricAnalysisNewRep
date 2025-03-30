import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import axiosClient from '../../utils/axiosClient';

const NavContainer = styled.nav`
  background-color: #002c54;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavInner = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 0.5rem;
  position: relative;

  @media (min-width: 992px) {
    padding: 0 1rem;
  }
`;

const NavTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
  position: relative;

  @media (min-width: 768px) {
    padding: 0.6rem 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -50%;
    bottom: 0;
    width: 200%;
    height: 1px;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0)
    );
  }
`;

const NavList = styled.ul`
  display: ${({ open }) => (open ? 'flex' : 'flex')};
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  background-color: #001c3a;
  position: relative;
  
  @media (min-width: 992px) {
    display: flex !important;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
`;

const NavItem = styled.li`
  margin: 0;
  padding: 0;
  position: relative;
  
  @media (min-width: 992px) {
    margin: 0 3px;
  }
  
  a {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s;
    font-size: 0.85rem;
    
    &:hover, &.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    &.active {
      border-bottom: 2px solid #ff9800;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  
  img {
    height: 40px;
    width: 40px;
    margin-right: 0.5rem;
    object-fit: contain;
    
    @media (min-width: 768px) {
      height: 45px;
      width: 45px;
      margin-right: 0.75rem;
    }
    
    @media (min-width: 992px) {
      height: 50px;
      width: 50px;
      margin-right: 1rem;
    }
  }
  
  .text-container {
    display: flex;
    flex-direction: column;
    
    h1 {
      font-size: 1.2rem;
      margin: 0;
      color: white;
      font-weight: 700;
      line-height: 1.1;
      
      @media (min-width: 768px) {
        font-size: 1.4rem;
      }
      
      @media (min-width: 992px) {
        font-size: 1.6rem;
      }
    }
    
    p {
      font-size: 0.7rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
      
      @media (min-width: 768px) {
        font-size: 0.8rem;
      }
      
      @media (min-width: 992px) {
        font-size: 0.9rem;
      }
    }
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 1.8rem;
  height: 1.8rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
  
  @media (min-width: 992px) {
    display: none;
  }
  
  div {
    width: 1.8rem;
    height: 0.2rem;
    background: white;
    border-radius: 8px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }
`;

const SearchBar = styled.div`
  display: none;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 4px 12px;
  margin-right: 12px;
  
  @media (min-width: 768px) {
    display: flex;
  }
  
  svg {
    color: rgba(255, 255, 255, 0.7);
    margin-right: 6px;
    font-size: 0.9rem;
  }
  
  form {
    display: flex;
    align-items: center;
  }
  
  input {
    background: transparent;
    border: none;
    color: white;
    padding: 5px 0;
    width: 180px;
    font-size: 0.9rem;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
    
    &:focus {
      outline: none;
    }
    
    @media (min-width: 992px) {
      width: 220px;
    }
  }
`;

const pulse = keyframes`
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 5px rgba(255, 68, 68, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
`;

const LiveDot = styled.div`
  width: 8px;
  height: 8px;
  background-color: #ff4444;
  border-radius: 50%;
  margin-right: 5px;
  animation: ${pulse} 1.5s infinite;
`;

const HeaderActions = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
  }
  
  a {
    display: flex;
    align-items: center;
    color: white;
    text-decoration: none;
    margin-left: 20px;
    font-size: 0.9rem;
    font-weight: 500;
    
    svg {
      margin-right: 5px;
    }
    
    &:hover {
      color: #ff9800;
    }
  }
`;

const PromoBanner = styled.div`
  background-color: #ff9800;
  color: #002c54;
  font-weight: bold;
  text-align: center;
  padding: 5px 0;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
  
  @keyframes slideIn {
    0% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
  
  span {
    margin-left: 5px;
    font-weight: normal;
  }
  
  .live-indicator {
    display: inline-flex;
    align-items: center;
    margin-left: 15px;
    margin-right: 15px;
    
    .dot {
      width: 8px;
      height: 8px;
      background-color: #ff4444;
      border-radius: 50%;
      margin-right: 6px;
      animation: ${pulse} 1.5s infinite;
    }
    
    .text {
      color: #ff4444;
      font-weight: bold;
      font-size: 0.8rem;
    }
  }
  
  .team-names {
    display: flex;
    align-items: center;
    font-weight: 600;
    
    .vs {
      margin: 0 10px;
      font-weight: normal;
      opacity: 0.8;
    }
    
    .team {
      display: flex;
      align-items: center;
      
      .score {
        margin-left: 5px;
        font-weight: normal;
        font-size: 0.85rem;
      }
    }
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [liveMatch, setLiveMatch] = useState(null);
  
  const timestamp = new Date().getTime();
  const logoPath = `${process.env.PUBLIC_URL}/assets/images/sitelogo/CricketHattrickLogo.png?t=${timestamp}`;
  
  // Specific match ID for the live match
  const LIVE_MATCH_ID = '7431523f-7ccb-4a4a-aed7-5c42fc08464c';
  
  // Function to fetch specific live match data
  const fetchLiveMatchData = async () => {
    try {
      console.log('Navbar: Fetching specific live match data...');
      
      // Use the match_info endpoint with the specific match ID
      const response = await axiosClient.get(`match_info?id=${LIVE_MATCH_ID}`, {
        timeout: 15000 // Increase timeout for better reliability
      });
      
      if (response.data && response.data.data) {
        const matchData = response.data.data;
        console.log('Navbar: Successfully fetched live match data');
        
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
        
        // Helper function to get correct team image path
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
            'Rajasthan Royals': 'rr',
            'Sunrisers Hyderabad': 'srh'
          };
          
          // Get the correct image file name or use a default
          const imageFileName = teamImageMap[teamName] || teamName.toLowerCase().replace(/\s+/g, '-');
          return `/assets/images/teams/${imageFileName}.svg`;
        };
        
        // Format scores
        const battingTeamScore = matchData.score && matchData.score.length > 0 
          ? `${matchData.score[0].r}/${matchData.score[0].w}` 
          : '0/0';
          
        const nonBattingTeamScore = '0/0'; // Usually the non-batting team hasn't started their innings
        
        setLiveMatch({
          team1: matchData.teams[battingTeamIndex],
          team2: matchData.teams[nonBattingTeamIndex],
          team1Score: battingTeamScore,
          team2Score: nonBattingTeamScore,
          isLive: true,
          team1Img: getTeamImagePath(matchData.teams[battingTeamIndex]),
          team2Img: getTeamImagePath(matchData.teams[nonBattingTeamIndex])
        });
        
        // Cache the data
        try {
          sessionStorage.setItem('navbarLiveMatch', JSON.stringify({
            team1: matchData.teams[battingTeamIndex],
            team2: matchData.teams[nonBattingTeamIndex],
            team1Score: battingTeamScore,
            team2Score: nonBattingTeamScore,
            isLive: true,
            team1Img: getTeamImagePath(matchData.teams[battingTeamIndex]),
            team2Img: getTeamImagePath(matchData.teams[nonBattingTeamIndex])
          }));
          sessionStorage.setItem('navbarLiveMatchTimestamp', new Date().getTime());
        } catch (cacheError) {
          console.error('Failed to cache navbar live match data:', cacheError);
        }
      } else {
        console.warn('No live match data found in API response');
        checkCachedMatch();
      }
    } catch (error) {
      console.error('Error fetching live match data:', error.message);
      checkCachedMatch();
    }
  };
  
  // Function to check for cached match data
  const checkCachedMatch = () => {
    try {
      const cachedMatch = sessionStorage.getItem('navbarLiveMatch');
      const cacheTimestamp = sessionStorage.getItem('navbarLiveMatchTimestamp');
      
      if (cachedMatch && cacheTimestamp) {
        const cacheAge = new Date().getTime() - cacheTimestamp;
        // Use cache if it's less than 30 minutes old
        if (cacheAge < 30 * 60 * 1000) {
          console.log('Using cached navbar live match data (less than 30 minutes old)');
          setLiveMatch(JSON.parse(cachedMatch));
          return true;
        }
      }
    } catch (cacheError) {
      console.error('Error using cached navbar live match data:', cacheError);
    }
    return false;
  };
  
  useEffect(() => {
    // Fetch live match data when component mounts
    fetchLiveMatchData();
    
    // Set up interval to refresh live match data every 5 minutes
    const intervalId = setInterval(fetchLiveMatchData, 5 * 60 * 1000);
    
    // Handle scroll event for navbar shadow
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, []);
  
  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <NavContainer style={{ 
      boxShadow: scrolled ? '0 4px 10px rgba(0, 0, 0, 0.1)' : '0 2px 10px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease'
    }}>
      <NavInner>
        {liveMatch && (
          <PromoBanner>
            <>
              IPL 2025
              <div className="live-indicator">
                <div className="dot"></div>
                <div className="text">LIVE</div>
              </div>
              <div className="team-names">
                <div className="team">
                  <img src={liveMatch.team1Img} alt={liveMatch.team1} style={{ height: '20px', width: '20px', marginRight: '5px' }} />
                  <span>{liveMatch.team1}</span>
                  <span className="score">{liveMatch.team1Score}</span>
                </div>
                <span className="vs">vs</span>
                <div className="team">
                  <img src={liveMatch.team2Img} alt={liveMatch.team2} style={{ height: '20px', width: '20px', marginRight: '5px' }} />
                  <span>{liveMatch.team2}</span>
                  <span className="score">{liveMatch.team2Score}</span>
                </div>
              </div>
            </>
          </PromoBanner>
        )}
        
        <NavTop>
          <Logo>
            <Link to="/">
              <img src={logoPath} alt="Crichattric Logo" />
            </Link>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div className="text-container">
                <h1>Crichattric</h1>
                <p># 1 Analytics</p>
              </div>
            </Link>
          </Logo>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <SearchBar>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
              <form onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="text" 
                  placeholder="Search players, teams..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </SearchBar>
            
            <HeaderActions>
              <Link to="/live">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                </svg>
                Live
              </Link>
              <Link to="/about">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
                About
              </Link>
              <Link to="/news">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5v-11zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5H12z"/>
                  <path d="M2 3h10v2H2V3zm0 3h4v3H2V6zm0 4h4v1H2v-1zm0 2h4v1H2v-1zM7 9h7v1H7v-1zm0 2h7v1H7v-1zm0 2h7v1H7v-1z"/>
                </svg>
                News
              </Link>
            </HeaderActions>
          </div>
          
          <MobileMenuButton onClick={() => setIsOpen(!isOpen)}>
            <div style={{ 
              transform: isOpen ? 'rotate(45deg)' : 'rotate(0)',
              marginBottom: '5px'
            }} />
            <div style={{ 
              opacity: isOpen ? '0' : '1',
              transform: isOpen ? 'translateX(20px)' : 'translateX(0)',
              marginBottom: '5px'
            }} />
            <div style={{ 
              transform: isOpen ? 'rotate(-45deg)' : 'rotate(0)'
            }} />
          </MobileMenuButton>
        </NavTop>
        
        <NavList open={isOpen}>
          <NavItem>
            <NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/matches" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
              Matches
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/news" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
              News
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/live-matches" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
              <span style={{ color: '#ff4444', fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <LiveDot />
                Live Matches
              </span>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/series" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
              Series
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/teams" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
              Teams
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/about" className={({isActive}) => isActive ? 'active' : ''} onClick={() => setIsOpen(false)}>
              About Us
            </NavLink>
          </NavItem>
        </NavList>
      </NavInner>
    </NavContainer>
  );
};

export default Navbar;
