import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { Container } from '../components/common/Container';
import axios from 'axios';

const NewsContainer = styled.div`
  padding: 2rem 0 4rem;
`;

const NewsHeader = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 3rem 0;
  margin-bottom: 3rem;
  text-align: center;
`;

const NewsTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const NewsSubtitle = styled.p`
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto;
`;

const NewsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const NewsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const NewsImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  ${NewsCard}:hover & img {
    transform: scale(1.05);
  }
`;

const NewsContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const NewsDate = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.textLight};
  margin-bottom: 0.5rem;
`;

const NewsHeadline = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
  line-height: 1.4;
`;

const NewsSummary = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
`;

const ReadMoreLink = styled(Link)`
  align-self: flex-start;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryDark};
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textLight};
`;

const ErrorContainer = styled.div`
  background-color: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin: 2rem 0;
  
  h3 {
    color: #e53e3e;
    margin-bottom: 1rem;
  }
  
  p {
    color: #4a5568;
    margin-bottom: 1rem;
  }
  
  button {
    background-color: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: ${props => props.theme.colors.primaryDark};
    }
  }
`;

// Mock news data to use as fallback
const mockNewsData = [
  {
    id: 1,
    title: "IPL 2025 Schedule Announced: Season to Begin on March 22",
    summary: "The Board of Control for Cricket in India (BCCI) has announced the schedule for the 2025 Indian Premier League. The tournament will begin on March 22 with defending champions Mumbai Indians taking on Chennai Super Kings.",
    date: "2025-02-15",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    source: "Crichattric"
  },
  {
    id: 2,
    title: "Virat Kohli Aims for Record-Breaking Season in IPL 2025",
    summary: "Royal Challengers Bangalore star Virat Kohli has set his sights on breaking the record for most runs in a single IPL season. The former India captain has been in exceptional form in recent months.",
    date: "2025-02-20",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    source: "Crichattric"
  },
  {
    id: 3,
    title: "New AI-Powered Analytics to Transform Cricket Strategy",
    summary: "Teams are increasingly turning to artificial intelligence and advanced analytics to gain a competitive edge. The upcoming IPL season will see teams employ sophisticated data analysis tools to inform their strategies.",
    date: "2025-02-25",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    source: "Crichattric"
  },
  {
    id: 4,
    title: "Rising Stars to Watch in IPL 2025",
    summary: "As the IPL continues to be a platform for discovering new talent, we highlight five uncapped players who could make a significant impact in the upcoming season based on their domestic performances.",
    date: "2025-03-01",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    source: "Crichattric"
  },
  {
    id: 5,
    title: "New Stadium Technology Enhances Fan Experience",
    summary: "IPL venues are being equipped with cutting-edge technology to enhance the in-stadium experience for fans. From augmented reality features to real-time statistics displays, the 2025 season promises a more immersive experience.",
    date: "2025-03-05",
    image: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    source: "Crichattric"
  },
  {
    id: 6,
    title: "International Stars Confirm Availability for Full IPL Season",
    summary: "Several international cricket boards have confirmed that their players will be available for the entire IPL 2025 season, avoiding the mid-season departures that have affected team compositions in previous years.",
    date: "2025-03-10",
    image: "https://images.unsplash.com/photo-1589801258579-18e091f4ca26?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
    source: "Crichattric"
  }
];

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    setUsingMockData(false);
    
    try {
      // Try to fetch from CricAPI
      const apiKey = '1f2ad458-2220-4a94-888b-59b78221920b';
      const response = await axios.get(`https://api.cricapi.com/v1/news?apikey=${apiKey}`);
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        const formattedNews = response.data.data.map((item, index) => ({
          id: index + 1,
          title: item.title,
          summary: item.description || "Click to read more about this news story.",
          date: new Date(item.published_at || Date.now()).toISOString().split('T')[0],
          image: item.urlToImage || `https://source.unsplash.com/random/300x200?cricket,${index}`,
          source: item.source || "Crichattric",
          url: item.url
        }));
        
        setNews(formattedNews);
      } else {
        // If no data from API, use mock data
        console.log("No news data from API, using mock data");
        setNews(mockNewsData);
        setUsingMockData(true);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to fetch news data. Using mock data instead.");
      setNews(mockNewsData);
      setUsingMockData(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <Helmet>
        <title>Cricket News | Crichattric</title>
        <meta name="description" content="Stay updated with the latest cricket news, match reports, player interviews, and more." />
      </Helmet>
      
      <NewsHeader>
        <Container>
          <NewsTitle>Cricket News</NewsTitle>
          <NewsSubtitle>
            Stay updated with the latest cricket news, match reports, player interviews, and more
          </NewsSubtitle>
        </Container>
      </NewsHeader>
      
      <Container>
        <NewsContainer>
          {usingMockData && (
            <div style={{ 
              background: '#f8f9fa', 
              padding: '1rem', 
              borderRadius: '8px', 
              marginBottom: '2rem',
              borderLeft: '4px solid #ffc107'
            }}>
              <p style={{ margin: 0 }}>
                <strong>Note:</strong> Displaying sample news content. Real-time news data will be shown when available.
              </p>
            </div>
          )}
          
          {loading ? (
            <LoadingContainer>
              <p>Loading cricket news...</p>
            </LoadingContainer>
          ) : error ? (
            <ErrorContainer>
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button onClick={fetchNews}>Try Again</button>
            </ErrorContainer>
          ) : (
            <>
              <NewsList>
                {news.map((item) => (
                  <NewsCard key={item.id}>
                    <NewsImage>
                      <img src={item.image} alt={item.title} />
                    </NewsImage>
                    <NewsContent>
                      <NewsDate>{formatDate(item.date)} • {item.source}</NewsDate>
                      <NewsHeadline>{item.title}</NewsHeadline>
                      <NewsSummary>{item.summary}</NewsSummary>
                      <ReadMoreLink to={`/news/${item.id}`}>Read More</ReadMoreLink>
                    </NewsContent>
                  </NewsCard>
                ))}
              </NewsList>
            </>
          )}
        </NewsContainer>
      </Container>
    </>
  );
};

export default News;
