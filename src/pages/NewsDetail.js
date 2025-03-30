import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { Container } from '../components/common/Container';
import { FaCalendarAlt, FaNewspaper, FaArrowLeft } from 'react-icons/fa';

const NewsDetailContainer = styled.div`
  padding: 2rem 0 4rem;
`;

const NewsHeader = styled.div`
  position: relative;
  height: 400px;
  background-size: cover;
  background-position: center;
  margin-bottom: 3rem;
  display: flex;
  align-items: flex-end;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.8) 100%);
    z-index: 1;
  }
`;

const HeaderContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 2rem;
  width: 100%;
`;

const NewsTitle = styled.h1`
  font-size: 2.5rem;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const NewsMetadata = styled.div`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  
  svg {
    margin-right: 0.5rem;
  }
  
  span {
    margin-right: 1.5rem;
    display: flex;
    align-items: center;
  }
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-weight: 500;
  margin-bottom: 2rem;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const NewsContent = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
  
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 1.5rem;
    color: ${props => props.theme.colors.text};
  }
  
  h2 {
    font-size: 1.8rem;
    color: ${props => props.theme.colors.primary};
    margin: 2rem 0 1rem;
  }
  
  h3 {
    font-size: 1.5rem;
    color: ${props => props.theme.colors.primary};
    margin: 1.5rem 0 1rem;
  }
  
  ul, ol {
    margin-bottom: 1.5rem;
    padding-left: 2rem;
    
    li {
      margin-bottom: 0.5rem;
      line-height: 1.6;
    }
  }
  
  blockquote {
    border-left: 4px solid ${props => props.theme.colors.secondary};
    padding-left: 1.5rem;
    font-style: italic;
    margin: 1.5rem 0;
    color: #4a5568;
  }
`;

const RelatedNews = styled.div`
  margin-top: 3rem;
  
  h2 {
    font-size: 1.8rem;
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${props => props.theme.colors.secondary};
  }
`;

const RelatedNewsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const RelatedNewsCard = styled(Link)`
  display: flex;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const RelatedNewsImage = styled.div`
  flex: 0 0 100px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RelatedNewsContent = styled.div`
  padding: 1rem;
  
  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textLight};
    margin: 0;
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
`;

// Mock news data (same as in News.js)
const mockNewsData = [
  {
    id: 1,
    title: "IPL 2025 Schedule Announced: Season to Begin on March 22",
    summary: "The Board of Control for Cricket in India (BCCI) has announced the schedule for the 2025 Indian Premier League. The tournament will begin on March 22 with defending champions Mumbai Indians taking on Chennai Super Kings.",
    content: `
      <p>The Board of Control for Cricket in India (BCCI) has officially announced the schedule for the 2025 Indian Premier League. The tournament will begin on March 22 with defending champions Mumbai Indians taking on Chennai Super Kings at the Wankhede Stadium in Mumbai.</p>
      
      <p>The 18th edition of the IPL will feature 10 teams competing in a total of 74 matches over a period of 51 days. The final is scheduled to be played on May 11, 2025, at the Narendra Modi Stadium in Ahmedabad.</p>
      
      <h2>Key Highlights of the Schedule</h2>
      
      <p>The schedule has been carefully crafted to minimize team travel and ensure adequate rest for players. Each team will play a total of 14 matches in the league stage, facing each opponent at least once and some twice.</p>
      
      <p>The playoff format remains unchanged, with the top four teams at the end of the league stage qualifying for the playoffs. The first and second-placed teams will face off in Qualifier 1, while the third and fourth-placed teams will compete in the Eliminator.</p>
      
      <h2>Impact on International Calendar</h2>
      
      <p>The IPL 2025 schedule has been designed to avoid clashes with major international cricket events. This ensures that international stars will be available for the entire tournament, enhancing the quality of cricket and global appeal of the league.</p>
      
      <blockquote>
        "We have worked closely with all cricket boards to ensure player availability throughout the tournament. This will be one of the most competitive IPL seasons ever," said a BCCI spokesperson.
      </blockquote>
      
      <h2>Venue Distribution</h2>
      
      <p>Matches will be played across 12 venues in India, with each team playing at least seven matches at their home ground. The decision to increase the number of venues aims to bring the IPL experience to more fans across the country.</p>
      
      <p>The complete match schedule, including timings and venues, is now available on the official IPL website.</p>
    `,
    date: "2025-02-15",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    source: "Crichattric"
  },
  {
    id: 2,
    title: "Virat Kohli Aims for Record-Breaking Season in IPL 2025",
    summary: "Royal Challengers Bangalore star Virat Kohli has set his sights on breaking the record for most runs in a single IPL season. The former India captain has been in exceptional form in recent months.",
    content: `
      <p>Royal Challengers Bangalore star Virat Kohli has set his sights on breaking the record for most runs in a single IPL season. The former India captain has been in exceptional form in recent months, and analysts believe he is primed for a record-breaking IPL 2025 campaign.</p>
      
      <p>Kohli, who currently holds the record for most runs in a single IPL season with 973 runs in 2016, has been working on specific technical adjustments to his batting approach for the T20 format.</p>
      
      <h2>Technical Refinements</h2>
      
      <p>According to sources close to the player, Kohli has been focusing on expanding his range of shots, particularly against spin bowling. He has also been working on his power-hitting capabilities to improve his strike rate in the middle and death overs.</p>
      
      <p>"I've been working on a few things in my batting. The goal is always to contribute to the team's success, but yes, I do have some personal milestones in mind for this IPL," Kohli said during a recent press conference.</p>
      
      <h2>RCB's Title Hopes</h2>
      
      <p>Royal Challengers Bangalore, despite having star players like Kohli, have never won the IPL trophy. The team management believes that Kohli's form will be crucial to their chances of winning their maiden title in 2025.</p>
      
      <blockquote>
        "Virat is in the best shape of his life, both physically and mentally. His preparation has been meticulous, and we're expecting a special season from him," said the RCB head coach.
      </blockquote>
      
      <h2>Competition for Orange Cap</h2>
      
      <p>While Kohli is a strong contender for the Orange Cap (awarded to the highest run-scorer of the season), he will face stiff competition from other batting stalwarts like Rohit Sharma, KL Rahul, and Jos Buttler.</p>
      
      <p>Cricket analysts predict that the 2025 season could see multiple batsmen cross the 600-run mark, making it one of the most competitive seasons for the Orange Cap race.</p>
    `,
    date: "2025-02-20",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    source: "Crichattric"
  },
  {
    id: 3,
    title: "New AI-Powered Analytics to Transform Cricket Strategy",
    summary: "Teams are increasingly turning to artificial intelligence and advanced analytics to gain a competitive edge. The upcoming IPL season will see teams employ sophisticated data analysis tools to inform their strategies.",
    content: `
      <p>Cricket teams are increasingly turning to artificial intelligence and advanced analytics to gain a competitive edge. The upcoming IPL 2025 season will see teams employ sophisticated data analysis tools to inform their strategies, player selections, and in-game decisions.</p>
      
      <p>This technological revolution is changing how teams prepare for matches and adapt during games, with real-time data providing insights that were previously unavailable to coaches and players.</p>
      
      <h2>Real-time Decision Making</h2>
      
      <p>One of the most significant advancements is the use of AI algorithms that can process vast amounts of data in real-time during matches. These systems can analyze player movements, ball trajectories, and field placements to suggest tactical adjustments.</p>
      
      <p>"We can now receive insights about opponent patterns and weaknesses as the game progresses," explained a data analyst working with one of the IPL franchises. "This allows captains to make more informed decisions about bowling changes, field placements, and batting strategies."</p>
      
      <h2>Predictive Player Performance</h2>
      
      <p>Teams are also using AI to predict player performance based on historical data, current form, and matchup statistics. This is particularly valuable during the auction process and for game-day team selection.</p>
      
      <blockquote>
        "The predictive models have become remarkably accurate. We can now forecast with a high degree of confidence how a player might perform against specific opponents or in particular conditions," said a team analytics head.
      </blockquote>
      
      <h2>Fan Experience Enhancement</h2>
      
      <p>The benefits of AI analytics aren't limited to teams. Broadcasters and digital platforms are using these technologies to enhance the viewing experience for fans, providing deeper insights and more engaging content.</p>
      
      <p>From win probability meters that update ball-by-ball to detailed breakdowns of player techniques, viewers will have access to a wealth of information that adds new dimensions to their understanding and enjoyment of the game.</p>
    `,
    date: "2025-02-25",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    source: "Crichattric"
  },
  {
    id: 4,
    title: "Rising Stars to Watch in IPL 2025",
    summary: "As the IPL continues to be a platform for discovering new talent, we highlight five uncapped players who could make a significant impact in the upcoming season based on their domestic performances.",
    content: `
      <p>As the IPL continues to be a platform for discovering new talent, we highlight five uncapped players who could make a significant impact in the upcoming season based on their domestic performances and recent form.</p>
      
      <p>These young cricketers have shown exceptional skill and temperament in domestic cricket and are poised to make their mark on the biggest T20 stage.</p>
      
      <h2>1. Rajat Patidar (Royal Challengers Bangalore)</h2>
      
      <p>Patidar has been in sensational form in domestic cricket, scoring consistently across formats. His ability to play both pace and spin with equal comfort makes him a valuable asset for RCB. His recent double century in the Ranji Trophy has caught the attention of cricket pundits nationwide.</p>
      
      <h2>2. Abhishek Sharma (Sunrisers Hyderabad)</h2>
      
      <p>A hard-hitting opener who can also bowl useful left-arm spin, Sharma has developed his game significantly in the past year. His improved technique against short-pitched bowling and his ability to accelerate from the start make him a dangerous proposition for opposition bowlers.</p>
      
      <h2>3. Yash Dayal (Gujarat Titans)</h2>
      
      <p>Left-arm pacers are always in demand in T20 cricket, and Dayal has shown he has both the skills and temperament to succeed at the highest level. His ability to swing the new ball and execute yorkers in the death overs makes him a complete package.</p>
      
      <blockquote>
        "These young players represent the future of Indian cricket. The IPL provides them with the perfect platform to showcase their talents and learn from the best in the world," said a national selector.
      </blockquote>
      
      <h2>4. Riyan Parag (Rajasthan Royals)</h2>
      
      <p>After showing glimpses of his potential in previous seasons, Parag seems ready to deliver consistently. His improved power-hitting ability and useful leg-spin make him a valuable all-rounder. His recent performances in domestic T20 competitions suggest he's ready for a breakthrough season.</p>
      
      <h2>5. Harshit Rana (Kolkata Knight Riders)</h2>
      
      <p>A tall fast bowler with the ability to extract bounce from even the most docile pitches, Rana has been impressive in domestic cricket. His variations and control in pressure situations have improved significantly, making him a potential impact player for KKR.</p>
    `,
    date: "2025-03-01",
    image: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    source: "Crichattric"
  },
  {
    id: 5,
    title: "New Stadium Technology Enhances Fan Experience",
    summary: "IPL venues are being equipped with cutting-edge technology to enhance the in-stadium experience for fans. From augmented reality features to real-time statistics displays, the 2025 season promises a more immersive experience.",
    content: `
      <p>IPL venues are being equipped with cutting-edge technology to enhance the in-stadium experience for fans. From augmented reality features to real-time statistics displays, the 2025 season promises a more immersive and interactive experience for spectators.</p>
      
      <p>These technological innovations aim to bridge the gap between the at-home viewing experience, with its wealth of statistics and replays, and the atmospheric but sometimes information-limited in-stadium experience.</p>
      
      <h2>Augmented Reality Integration</h2>
      
      <p>Several stadiums will feature augmented reality zones where fans can use their smartphones to access additional content, including player statistics, 3D replays, and interactive games. Special AR viewing areas will allow fans to see real-time data overlays as they watch the match.</p>
      
      <p>"We want to create an experience that combines the energy of being at the stadium with the information richness of watching at home," explained an IPL technology director.</p>
      
      <h2>Smart Seating and Connectivity</h2>
      
      <p>Upgraded seating areas will include embedded screens showing replays, statistics, and alternative camera angles. High-density Wi-Fi networks have been installed to ensure all fans can access digital content without connectivity issues.</p>
      
      <blockquote>
        "The modern cricket fan wants to be connected and informed. Our goal is to make the stadium the best place to experience cricket, combining the irreplaceable atmosphere with cutting-edge digital enhancements," said a stadium operations manager.
      </blockquote>
      
      <h2>Interactive Fan Engagement</h2>
      
      <p>New apps will allow fans to participate in real-time polls, predict outcomes of specific deliveries or overs, and even influence certain aspects of the in-stadium experience such as music selection and big-screen content.</p>
      
      <p>Some venues will also feature "Fan Zones" where spectators can test their cricket skills using technology-enhanced training equipment similar to what the players use.</p>
    `,
    date: "2025-03-05",
    image: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    source: "Crichattric"
  },
  {
    id: 6,
    title: "International Stars Confirm Availability for Full IPL Season",
    summary: "Several international cricket boards have confirmed that their players will be available for the entire IPL 2025 season, avoiding the mid-season departures that have affected team compositions in previous years.",
    content: `
      <p>Several international cricket boards have confirmed that their players will be available for the entire IPL 2025 season, avoiding the mid-season departures that have affected team compositions in previous years.</p>
      
      <p>This development ensures that teams can plan their strategies for the entire tournament without worrying about losing key overseas players during crucial stages.</p>
      
      <h2>Coordinated International Calendar</h2>
      
      <p>The ICC, in collaboration with member boards, has worked to minimize scheduling conflicts with the IPL. This coordinated approach reflects the growing recognition of the IPL's importance in the global cricket ecosystem.</p>
      
      <p>"We've been in discussions with all the major cricket boards to ensure that the international calendar accommodates the IPL window," said a BCCI official. "This benefits everyone – the players get to participate in the full tournament, and fans get to watch the best players throughout the season."</p>
      
      <h2>Player Availability by Country</h2>
      
      <p>England, Australia, New Zealand, West Indies, and South Africa have all confirmed that their contracted players will be available for the entire tournament. This is a significant change from previous years when players from these countries often had to leave mid-season for international duties.</p>
      
      <blockquote>
        "Having our overseas players available for the entire tournament is a game-changer for planning and team balance. It allows us to build a more cohesive unit," said a franchise coach.
      </blockquote>
      
      <h2>Impact on Team Strategies</h2>
      
      <p>The consistent availability of international players will influence auction strategies and team compositions. Franchises can now bid more confidently for overseas stars, knowing they won't lose them at critical stages of the tournament.</p>
      
      <p>Analysts predict that this development could lead to more balanced team compositions and potentially higher quality cricket throughout the tournament, especially in the latter stages when teams are competing for playoff spots.</p>
    `,
    date: "2025-03-10",
    image: "https://images.unsplash.com/photo-1589801258579-18e091f4ca26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80",
    source: "Crichattric"
  }
];

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real application, you would fetch the specific news item from an API
        // For now, we'll use our mock data
        const newsId = parseInt(id);
        const foundNews = mockNewsData.find(item => item.id === newsId);
        
        if (foundNews) {
          setNewsItem(foundNews);
          
          // Get related news (excluding the current one)
          const related = mockNewsData
            .filter(item => item.id !== newsId)
            .sort(() => 0.5 - Math.random()) // Shuffle array
            .slice(0, 3); // Get first 3 items
          
          setRelatedNews(related);
        } else {
          setError("News article not found");
        }
      } catch (err) {
        console.error("Error fetching news detail:", err);
        setError("Failed to load news article");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
    // Scroll to top when component mounts or id changes
    window.scrollTo(0, 0);
  }, [id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <p>Loading article...</p>
        </LoadingContainer>
      </Container>
    );
  }

  if (error || !newsItem) {
    return (
      <Container>
        <ErrorContainer>
          <h3>Article Not Found</h3>
          <p>{error || "The requested news article could not be found."}</p>
          <BackButton to="/news">
            <FaArrowLeft /> Back to News
          </BackButton>
        </ErrorContainer>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{newsItem.title} | Crichattric News</title>
        <meta name="description" content={newsItem.summary} />
      </Helmet>
      
      <NewsHeader style={{ backgroundImage: `url(${newsItem.image})` }}>
        <HeaderContent>
          <NewsTitle>{newsItem.title}</NewsTitle>
          <NewsMetadata>
            <span><FaCalendarAlt /> {formatDate(newsItem.date)}</span>
            <span><FaNewspaper /> {newsItem.source}</span>
          </NewsMetadata>
        </HeaderContent>
      </NewsHeader>
      
      <Container>
        <NewsDetailContainer>
          <BackButton to="/news">
            <FaArrowLeft /> Back to News
          </BackButton>
          
          <NewsContent dangerouslySetInnerHTML={{ __html: newsItem.content }} />
          
          {relatedNews.length > 0 && (
            <RelatedNews>
              <h2>Related News</h2>
              <RelatedNewsList>
                {relatedNews.map(item => (
                  <RelatedNewsCard key={item.id} to={`/news/${item.id}`}>
                    <RelatedNewsImage>
                      <img src={item.image} alt={item.title} />
                    </RelatedNewsImage>
                    <RelatedNewsContent>
                      <h3>{item.title}</h3>
                      <p>{formatDate(item.date)}</p>
                    </RelatedNewsContent>
                  </RelatedNewsCard>
                ))}
              </RelatedNewsList>
            </RelatedNews>
          )}
        </NewsDetailContainer>
      </Container>
    </>
  );
};

export default NewsDetail;
