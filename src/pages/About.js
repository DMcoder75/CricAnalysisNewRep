import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { Container } from '../components/common/Container';

const AboutContainer = styled.div`
  padding: 2rem 0 4rem;
`;

const AboutHeader = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 3rem 0;
  margin-bottom: 3rem;
  text-align: center;
`;

const AboutTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const AboutSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
`;

const ContentSection = styled.section`
  max-width: 900px;
  margin: 0 auto 3rem;
  line-height: 1.8;
  
  p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
    color: ${props => props.theme.colors.text};
  }
`;

const About = () => {
  return (
    <>
      <Helmet>
        <title>About Us | Crichattric</title>
        <meta name="description" content="Learn about Crichattric, our mission, and our passion for revolutionizing cricket analytics with AI-driven insights." />
      </Helmet>
      
      <AboutHeader>
        <Container>
          <AboutTitle>About Us</AboutTitle>
          <AboutSubtitle>
            Revolutionizing cricket analytics with AI-driven insights and real-time data
          </AboutSubtitle>
        </Container>
      </AboutHeader>
      
      <Container>
        <AboutContainer>
          <ContentSection>
            <p>
              At Crichattric, we are passionate about revolutionizing the way cricket fans experience their favorite sport. Our mission is to provide a platform that not only delivers real-time scores and match updates but also offers in-depth, advanced AI-driven insights into the game. We believe that cricket is more than just a sport; it's a tapestry of strategies, performances, and moments that captivate millions worldwide. Our team is dedicated to weaving this tapestry with data, analytics, and AI to create a richer, more immersive experience for every cricket enthusiast.
            </p>
            
            <p>
              Our journey began with a simple yet profound idea: to harness the power of technology to enhance the cricket fan's journey. We recognized that while traditional scoring systems provide essential information, they often leave fans wanting more. That's why we've developed a platform that integrates cutting-edge AI insights, predictive analytics, and real-time updates to give fans a deeper understanding of the game. Whether you're a seasoned strategist or a casual observer, our platform is designed to engage, inform, and inspire. From analyzing player performances to predicting match outcomes, we aim to make every aspect of cricket more accessible and enjoyable.
            </p>
            
            <p>
              What sets us apart is our commitment to innovation and fan engagement. We understand that cricket is a sport of nuances, where every delivery, every shot, and every catch tells a story. Our AI-powered tools are designed to uncover these stories, providing insights that go beyond mere statistics. We delve into the intricacies of the game, offering fans a chance to explore new dimensions of cricket strategy and performance. Our platform is not just a source of information; it's a community where fans can share, discuss, and learn from each other's perspectives. We invite you to join this vibrant community and experience cricket like never before.
            </p>
            
            <p>
              As we continue to evolve and improve, our vision remains steadfast: to become the go-to destination for cricket fans seeking more than just scores. We envision a future where AI insights and data analytics not only enhance the fan experience but also contribute to the sport's growth and development. Our team is constantly working to refine our tools, expand our offerings, and push the boundaries of what's possible in cricket analytics. At Crichattric, we're not just building a website; we're crafting a new way to love, understand, and enjoy the beautiful game of cricket. Join us on this exciting journey and discover a world of cricket that's more engaging, more insightful, and more thrilling than ever before.
            </p>
          </ContentSection>
        </AboutContainer>
      </Container>
    </>
  );
};

export default About;
