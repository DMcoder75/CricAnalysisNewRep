import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../../utils/theme';

const HeaderContainer = styled.header`
  position: relative;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BannerImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 31, 63, 0.8);
  z-index: -1;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  
  img {
    height: 100px;
    width: 100px;
    margin-right: 20px;
    object-fit: contain;
  }
  
  .text-container {
    display: flex;
    flex-direction: column;
    
    h1 {
      font-size: 2.5rem;
      margin: 0;
      color: white;
      font-weight: 700;
      line-height: 1.1;
    }
    
    p {
      font-size: 1.2rem;
      margin: 0;
      color: rgba(255, 255, 255, 0.8);
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  
  a {
    color: white;
    margin-left: 20px;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Header = () => {
  // Generate a timestamp for cache-busting
  const timestamp = new Date().getTime();
  
  // Use the main logo with cache-busting
  const logoPath = `${process.env.PUBLIC_URL}/assets/images/sitelogo/CricketHattrickLogo.png?t=${timestamp}`;
  
  return (
    <HeaderContainer>
      <BannerImage src="/assets/images/banner.png" alt="IPL 2025 Banner" />
      <Overlay />
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
      <HeaderActions>
        <Link to="/about">About</Link>
        <Link to="/news">News</Link>
      </HeaderActions>
    </HeaderContainer>
  );
};

export default Header;
