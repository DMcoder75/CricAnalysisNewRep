import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 2rem;
  margin-top: 2rem;
`;

const FooterContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: column;
  }
`;

const FooterSection = styled.div`
  flex: 1;
  min-width: 200px;
  margin-bottom: 1.5rem;
  
  h3 {
    color: white;
    margin-bottom: 1rem;
    border-bottom: 2px solid ${props => props.theme.colors.secondary};
    padding-bottom: 0.5rem;
    display: inline-block;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  a {
    color: white;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
      color: ${props => props.theme.colors.tertiary};
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/players">Players</Link></li>
            <li><Link to="/matches">Matches</Link></li>
            <li><Link to="/teams">Teams</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h3>Resources</h3>
          <ul>
            <li><Link to="/insights">AI Insights</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/about">About Us</Link></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h3>CONTACT</h3>
          <ul>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
          </ul>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        <p>&copy; {currentYear} Crichattric. All rights reserved.</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
