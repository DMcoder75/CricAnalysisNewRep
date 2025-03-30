import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import theme from '../../utils/theme';
import dbService from '../../services/dbService';

// Styled components
const ProfileContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const BreadcrumbNav = styled.div`
  margin-bottom: 1.5rem;
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 0.5rem;
    color: ${props => props.theme.colors.darkGray};
  }
`;

const ErrorMessage = styled.div`
  background-color: #FEE;
  color: #D00;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  margin: 2rem auto;
  max-width: 600px;
  
  h2 {
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 1.5rem;
  }
  
  a {
    display: inline-block;
    background-color: ${props => props.theme.colors.primary};
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: #001F3B;
    }
  }
`;

const TeamHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  background: linear-gradient(to right, ${props => props.bgColor || props.theme.colors.primary}, ${props => props.bgColor || props.theme.colors.primary}CC);
  border-radius: 12px;
  padding: 2rem;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TeamLogo = styled.div`
  width: 180px;
  height: 180px;
  background-color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  
  img {
    max-width: 80%;
    max-height: 80%;
    object-fit: contain;
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
`;

const TeamInfo = styled.div`
  flex: 1;
`;

const TeamName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

const TeamFullName = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  opacity: 0.9;
  font-weight: 400;
`;

const SeasonSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SeasonTab = styled.button`
  padding: 0.5rem 1rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.darkGray};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s;
`;

const SeasonInfoCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #333;
`;

const SeasonTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const TeamStats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const StatItem = styled.div`
  .value {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
  }
  
  .label {
    font-size: 0.9rem;
    opacity: 0.8;
    color: #333;
  }
`;

const SeasonHighlights = styled.div`
  margin-top: 2rem;
`;

const HighlightItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const HighlightLabel = styled.span`
  font-size: 1rem;
  opacity: 0.8;
  color: #333;
`;

const HighlightValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

const UpcomingSeasonInfo = styled.div`
  margin-top: 2rem;
  color: #333;
`;

const UpcomingSeasonDate = styled.p`
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 1rem;
  color: #333;
`;

const UpcomingSeasonDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #333;
`;

const UpcomingDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #333;
`;

const UpcomingIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 0.5rem;
`;

const UpcomingText = styled.span`
  font-size: 1rem;
  color: #333;
`;

const TabsContainer = styled.div`
  margin-top: 2rem;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  margin-bottom: 2rem;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    flex-wrap: nowrap;
    justify-content: flex-start;
  }
`;

const Tab = styled.button`
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 3px solid ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.darkGray};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const ViewToggle = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  border: 1px solid ${props => props.theme.colors.lightGray};
  border-radius: 4px;
  overflow: hidden;
  width: fit-content;
`;

const ViewToggleButton = styled.button`
  padding: 0.5rem 1rem;
  background: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.darkGray};
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: ${props => props.active ? '600' : '400'};
  
  &:hover {
    background: ${props => props.active ? props.theme.colors.primary : props.theme.colors.lightGray};
  }
`;

const SquadTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background-color: ${props => props.theme.colors.primary};
  color: white;
`;

const TableHeaderCell = styled.th`
  padding: 1rem;
  text-align: left;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${props => props.theme.colors.lightGray}30;
  }
  
  &:hover {
    background-color: ${props => props.theme.colors.lightGray}70;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.lightGray}50;
  vertical-align: middle;
`;

const PlayerImageCell = styled(TableCell)`
  width: 70px;
  padding: 0.5rem;
`;

const CircularPlayerImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlayerNameCell = styled.div`
  font-weight: 500;
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PlayerRowDetails = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NationalitySpan = styled.span`
  color: ${props => props.theme.colors.darkGray};
  font-size: 0.9rem;
  font-weight: normal;
  margin-left: 0.5rem;
`;

const PriceCell = styled(TableCell)`
  font-weight: 600;
  color: #2e7d32;
`;

const AcquisitionCell = styled(TableCell)`
  span {
    padding: 0.3rem 0.8rem;
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: 500;
  }
  
  .retained {
    background-color: #e3f2fd;
    color: #1565c0;
  }
  
  .auction {
    background-color: #fff8e1;
    color: #ff8f00;
  }
  
  .rtm {
    background-color: #f3e5f5;
    color: #7b1fa2;
  }
  
  .traded {
    background-color: #e8f5e9;
    color: #2e7d32;
  }
`;

const RoleCell = styled(TableCell)`
  color: ${props => props.theme.colors.darkGray};
`;

const CaptainBadge = styled.span`
  background-color: gold;
  color: #333;
  font-size: 0.7rem;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  margin-left: 0.5rem;
  font-weight: bold;
`;

const SectionTitle = styled.h2`
  color: ${props => props.theme.colors.primary};
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  border-left: 4px solid ${props => props.theme.colors.primary};
  padding-left: 1rem;
`;

const PlayerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const PlayerCard = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const PlayerImageContainer = styled.div`
  height: 200px;
  background-color: ${props => props.theme.colors.lightGray};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlayerRole = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  font-size: 0.8rem;
  text-align: center;
`;

const PlayerInfo = styled.div`
  padding: 1rem;
`;

const PlayerName = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.primary};
`;

const PlayerDetails = styled.div`
  font-size: 0.9rem;
  color: ${props => props.theme.colors.darkGray};
  margin-bottom: 1rem;
  
  div {
    margin-bottom: 0.25rem;
  }
`;

const PlayerStats = styled.div`
  margin-bottom: 1rem;
`;

const StatGroup = styled.div`
  margin-bottom: 1rem;
`;

const StatTitle = styled.h4`
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const StatRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PlayerStatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatLabel = styled.span`
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 0.2rem;
`;

const StatValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
`;

const ViewProfileButton = styled(Link)`
  display: block;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  text-align: center;
  padding: 0.75rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #001F3B;
    color: white;
    text-decoration: none;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid ${props => props.theme.colors.primary};
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const TeamProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('squad');
  const [activeSeason, setActiveSeason] = useState('2025');
  const [squadView, setSquadView] = useState('table'); // 'table' or 'grid'
  
  // Function to get team logo path
  const getTeamLogoPath = (teamShortName) => {
    const logoFilename = theme.TEAM_LOGO_MAP[teamShortName] || 'default.png';
    return `${process.env.PUBLIC_URL}${theme.ASSETS_PATH.TEAMS}${logoFilename}`;
  };
  
  // Function to get player image (placeholder for now)
  const getPlayerImagePath = (playerId) => {
    // CSK Player image mapping
    const cskPlayerImages = {
      // Batsmen
      101: "https://assets.iplt20.com/ipl/IPLHeadshot2022/1.png", // MS Dhoni
      102: "https://assets.iplt20.com/ipl/IPLHeadshot2022/5443.png", // Ruturaj Gaikwad
      103: "https://assets.iplt20.com/ipl/IPLHeadshot2022/20572.png", // Devon Conway
      104: "https://assets.iplt20.com/ipl/IPLHeadshot2022/135.png", // Ajinkya Rahane
      105: "https://assets.iplt20.com/ipl/IPLHeadshot2022/20586.png", // Sameer Rizvi
      106: "https://assets.iplt20.com/ipl/IPLHeadshot2022/20593.png", // Avanish Aravelly

      // All-rounders
      107: "https://assets.iplt20.com/ipl/IPLHeadshot2022/9.png", // Ravindra Jadeja
      108: "https://assets.iplt20.com/ipl/IPLHeadshot2022/1735.png", // Moeen Ali
      109: "https://assets.iplt20.com/ipl/IPLHeadshot2022/5431.png", // Shivam Dube
      110: "https://assets.iplt20.com/ipl/IPLHeadshot2022/20571.png", // Rachin Ravindra
      111: "https://assets.iplt20.com/ipl/IPLHeadshot2022/1903.png", // Mitchell Santner

      // Bowlers
      112: "https://assets.iplt20.com/ipl/IPLHeadshot2022/140.png", // Deepak Chahar
      113: "https://assets.iplt20.com/ipl/IPLHeadshot2022/5433.png", // Tushar Deshpande
      114: "https://assets.iplt20.com/ipl/IPLHeadshot2022/20574.png", // Matheesha Pathirana
      115: "https://assets.iplt20.com/ipl/IPLHeadshot2022/1745.png", // Shardul Thakur
      116: "https://assets.iplt20.com/ipl/IPLHeadshot2022/20570.png", // Maheesh Theekshana
      117: "https://assets.iplt20.com/ipl/IPLHeadshot2022/10789.png", // Simarjeet Singh
      118: "https://assets.iplt20.com/ipl/IPLHeadshot2022/20597.png", // Mukesh Choudhary
      119: "https://assets.iplt20.com/ipl/IPLHeadshot2022/20580.png", // Prashant Solanki
      120: "https://assets.iplt20.com/ipl/IPLHeadshot2022/20582.png", // Richard Gleeson
    };

    // If it's a CSK player and we have a specific image
    if (team?.id === 2 && cskPlayerImages[playerId]) {
      return cskPlayerImages[playerId];
    }

    // Fallback to default player image if no specific image is available
    return `${process.env.PUBLIC_URL}/assets/images/players/default.svg`;
  };
  
  // Function to get player price (mock data for now)
  const getPlayerPrice = (playerId) => {
    // Mock data for player prices in crores (₹)
    const playerPrices = {
      // Delhi Capitals (Team ID 5)
      24: '16.50', // Axar Patel
      25: '13.25', // Kuldeep Yadav
      26: '10.00', // Tristan Stubbs
      27: '4.00',  // Abishek Porel
      28: '5.75',  // Ishant Sharma
      29: '14.00', // KL Rahul
      30: '9.00',  // Jake Fraser-McGurk
      31: '10.75', // T Natarajan
      32: '0.50',  // Karun Nair
      33: '0.95',  // Sameer Rizvi
      34: '3.80',  // Ashutosh Sharma
      35: '2.20',  // Mohit Sharma
      36: '2.00',  // Faf du Plessis
      37: '8.00',  // Mukesh Kumar
      38: '0.30',  // Darshan Nalkande
      39: '0.50',  // Vipraj Nigam
      40: '0.75',  // Dushmantha Chameera
      41: '0.75',  // Donovan Ferreira
      42: '0.30',  // Ajay Mandal
      43: '0.30',  // Manvanth Kumar
      44: '0.40',  // Madhav Tiwari
      45: '0.30',  // Tripurana Vijay
      46: '11.75', // Mitchell Starc (Delhi Capitals)
      
      // Chennai Super Kings (Team ID 2)
      101: '12.00', // MS Dhoni
      102: '14.00', // Ruturaj Gaikwad
      103: '8.50',  // Devon Conway
      104: '2.00',  // Ajinkya Rahane
      105: '1.50',  // Sameer Rizvi
      106: '0.50',  // Avanish Aravelly
      107: '16.00', // Ravindra Jadeja
      108: '8.00',  // Moeen Ali
      109: '7.50',  // Shivam Dube
      110: '2.00',  // Rachin Ravindra
      111: '4.50',  // Mitchell Santner
      112: '16.00', // Ravindra Jadeja (duplicate, will be fixed)
      113: '10.50', // Deepak Chahar
      114: '2.00',  // Tushar Deshpande
      115: '4.00',  // Maheesh Theekshana
      116: '1.50',  // Simarjeet Singh
      117: '2.00',  // Matheesha Pathirana
      118: '0.75',  // Prashant Solanki
      119: '1.50',  // Mukesh Choudhary
      120: '0.50',  // Ajay Mandal
      121: '6.50',  // Shardul Thakur
      122: '5.00',  // Daryl Mitchell
      123: '3.00',  // Mustafizur Rahman
      124: '1.00',  // Richard Gleeson
      125: '1.50',  // Rajvardhan Hangargekar
      
      // Rajasthan Royals (Team ID 7)
      201: '14.00', // Sanju Samson
      202: '15.75', // Jos Buttler
      203: '18.00', // Yashasvi Jaiswal
      204: '6.50',  // Shimron Hetmyer
      205: '8.00',  // Riyan Parag
      206: '1.50',  // Dhruv Jurel
      207: '0.75',  // Donovan Ferreira
      208: '0.30',  // Kunal Rathore
      209: '9.00',  // Ravichandran Ashwin
      210: '12.50', // Yuzvendra Chahal
      211: '10.00', // Trent Boult
      212: '2.50',  // Sandeep Sharma
      213: '5.75',  // Avesh Khan
      214: '4.00',  // Prasidh Krishna
      215: '2.00',  // Nandre Burger
      216: '1.50',  // Navdeep Saini
      217: '1.00',  // Kuldeep Sen
      218: '7.50',  // Rovman Powell
      219: '0.85',  // Shubham Dubey
      220: '0.50',  // Tom Kohler-Cadmore
      221: '0.30',  // Abid Mushtaq
      222: '0.30',  // Tanush Kotian
      223: '1.75',  // Keshav Maharaj
      224: '2.00',  // Adam Zampa
      225: '1.00',  // Obed McCoy
      
      // Mumbai Indians (Team ID 1)
      301: '16.00', // Rohit Sharma
      302: '16.25', // Hardik Pandya
      303: '18.00', // Jasprit Bumrah
      304: '15.50', // Suryakumar Yadav
      305: '13.00', // Ishan Kishan
      306: '8.50',  // Tim David
      307: '9.00',  // Tilak Varma
      308: '4.50',  // Piyush Chawla
      309: '3.00',  // Nehal Wadhera
      310: '4.00',  // Dewald Brevis
      311: '1.50',  // Harvik Desai
      312: '0.75',  // Naman Dhir
      313: '0.50',  // Shams Mulani
      314: '1.00',  // Arjun Tendulkar
      315: '0.75',  // Kumar Kartikeya
      316: '0.30',  // Shivalik Sharma
      317: '0.30',  // Anshul Kamboj
      318: '1.00',  // Nuwan Thushara
      319: '3.50',  // Romario Shepherd
      320: '5.00',  // Gerald Coetzee
      321: '2.00',  // Dilshan Madushanka
      322: '3.00',  // Mohammad Nabi
      323: '1.50',  // Shreyas Gopal
      324: '0.50',  // Kwena Maphaka
      325: '1.00',  // Akash Madhwal
      
      // Kolkata Knight Riders (Team ID 4)
      401: '12.25', // Shreyas Iyer
      402: '8.00',  // Nitish Rana
      403: '10.00', // Rinku Singh
      404: '2.00',  // Rahmanullah Gurbaz
      405: '7.50',  // Phil Salt
      406: '15.00', // Sunil Narine
      407: '16.50', // Andre Russell
      408: '9.00',  // Venkatesh Iyer
      409: '1.50',  // Anukul Roy
      410: '1.00',  // Ramandeep Singh
      411: '1.50',  // Angkrish Raghuvanshi
      412: '3.50',  // Sherfane Rutherford
      413: '2.00',  // Manish Pandey
      414: '2.00',  // K.S. Bharat
      415: '1.00',  // Vaibhav Arora
      416: '2.50',  // Chetan Sakariya
      417: '24.75', // Mitchell Starc
      418: '1.75',  // Harshit Rana
      419: '8.00',  // Varun Chakravarthy
      420: '4.00',  // Mujeeb Ur Rahman
      421: '0.50',  // Gurnoor Brar
      422: '0.30',  // Sakib Hussain
      423: '6.50',  // Anrich Nortje
      424: '2.00',  // Dushmantha Chameera
      425: '1.00',  // Suyash Sharma
      
      // Royal Challengers Bangalore (Team ID 3)
      501: '18.00', // Virat Kohli
      502: '12.00', // Faf du Plessis
      503: '11.00', // Glenn Maxwell
      504: '7.00',  // Mohammed Siraj
      505: '5.50',  // Rajat Patidar
      506: '1.00',  // Anuj Rawat
      507: '5.50',  // Dinesh Karthik
      508: '3.25',  // Will Jacks
      509: '1.00',  // Mahipal Lomror
      510: '1.00',  // Karn Sharma
      511: '0.75',  // Suyash Prabhudessai
      512: '0.30',  // Manoj Bhandage
      513: '1.50',  // Akash Deep
      514: '17.50', // Cameron Green
      515: '11.50', // Alzarri Joseph
      516: '5.00',  // Yash Dayal
      517: '1.50',  // Tom Curran
      518: '2.00',  // Lockie Ferguson
      519: '0.75',  // Swapnil Singh
      520: '0.30',  // Saurav Chauhan
      521: '1.50',  // Reece Topley
      522: '0.30',  // Himanshu Sharma
      523: '0.30',  // Rajan Kumar
      524: '1.75',  // Mayank Dagar
      525: '0.75',  // Vyshak Vijaykumar
      
      // Punjab Kings (Team ID 6)
      601: '8.25',  // Shikhar Dhawan
      602: '11.00', // Jonny Bairstow
      603: '11.50', // Liam Livingstone
      604: '4.00',  // Jitesh Sharma
      605: '1.75',  // Prabhsimran Singh
      606: '1.00',  // Harpreet Brar
      607: '0.75',  // Rishi Dhawan
      608: '18.50', // Sam Curran
      609: '2.00',  // Sikandar Raza
      610: '0.50',  // Shivam Singh
      611: '0.50',  // Atharva Taide
      612: '4.50',  // Rilee Rossouw
      613: '11.00', // Arshdeep Singh
      614: '3.00',  // Nathan Ellis
      615: '9.25',  // Kagiso Rabada
      616: '13.50', // Harshal Patel
      617: '5.25',  // Rahul Chahar
      618: '1.50',  // Harpreet Singh Bhatia
      619: '0.30',  // Vidwath Kaverappa
      620: '0.30',  // Prince Choudhary
      621: '4.00',  // Chris Woakes
      622: '0.30',  // Vishwanath Singh
      623: '0.30',  // Ashutosh Sharma
      624: '0.30',  // Tanay Thyagarajan
      625: '2.60',  // Shashank Singh
      
      // Gujarat Titans (Team ID 9)
      901: '8.00',  // Shubman Gill
      902: '3.00',  // David Miller
      903: '2.40',  // Matthew Wade
      904: '1.90',  // Wriddhiman Saha
      905: '2.00',  // Kane Williamson
      906: '0.30',  // Abhinav Manohar
      907: '6.00',  // B. Sai Sudharsan
      908: '0.20',  // Darshan Nalkande
      909: '2.60',  // Vijay Shankar
      910: '1.70',  // Jayant Yadav
      911: '4.40',  // Rahul Tewatia
      912: '15.00', // Rashid Khan
      913: '6.25',  // Mohammed Shami
      914: '5.75',  // Alzarri Joseph
      915: '3.20',  // Yash Dayal
      916: '2.60',  // R. Sai Kishore
      917: '3.00',  // Noor Ahmad
      918: '4.40',  // Joshua Little
      919: '2.40',  // Mohit Sharma
      920: '0.20',  // Pradeep Sangwan
      921: '1.00',  // Umesh Yadav
      922: '2.00',  // Spencer Johnson
      923: '7.40',  // Shahrukh Khan
      924: '4.00',  // Kartik Tyagi
      925: '0.50',  // Azmatullah Omarzai
      
      // Lucknow Super Giants (Team ID 10)
      1001: '17.00', // KL Rahul
      1002: '6.75',  // Quinton de Kock
      1003: '16.00', // Nicholas Pooran
      1004: '0.40',  // Ayush Badoni
      1005: '5.75',  // Deepak Hooda
      1006: '10.00', // Marcus Stoinis
      1007: '2.00',  // Kyle Mayers
      1008: '8.25',  // Krunal Pandya
      1009: '0.90',  // Krishnappa Gowtham
      1010: '0.20',  // Prerak Mankad
      1011: '0.20',  // Arshin Kulkarni
      1012: '0.75',  // Ashton Turner
      1013: '2.00',  // Devdutt Padikkal
      1014: '0.90',  // Mohsin Khan
      1015: '4.00',  // Ravi Bishnoi
      1016: '2.40',  // Naveen-ul-Haq
      1017: '0.20',  // Yudhvir Singh
      1018: '0.20',  // Mayank Yadav
      1019: '7.50',  // Mark Wood
      1020: '6.40',  // Shivam Mavi
      1021: '0.45',  // Yash Thakur
      1022: '2.00',  // David Willey
      1023: '0.20',  // Arshad Khan
      1024: '4.00',  // Shamar Joseph
      1025: '0.20',  // M. Siddharth
      
      // Sunrisers Hyderabad (Team ID 8)
      801: '15.50', // Pat Cummins
      802: '6.50',  // Abhishek Sharma
      803: '2.60',  // Aiden Markram
      804: '5.25',  // Heinrich Klaasen
      805: '6.80',  // Travis Head
      806: '1.50',  // Glenn Phillips
      807: '8.50',  // Rahul Tripathi
      808: '4.00',  // Abdul Samad
      809: '8.75',  // Washington Sundar
      810: '4.20',  // Marco Jansen
      811: '0.20',  // Sanvir Singh
      812: '0.20',  // Nitish Kumar Reddy
      813: '2.40',  // Shahbaz Ahmed
      814: '4.20',  // Bhuvneshwar Kumar
      815: '4.00',  // T. Natarajan
      816: '0.50',  // Mayank Markande
      817: '4.00',  // Umran Malik
      818: '1.50',  // Fazalhaq Farooqi
      819: '1.50',  // Mayank Agarwal
      820: '0.20',  // Anmolpreet Singh
      821: '0.20',  // Upendra Yadav
      822: '1.60',  // Jaydev Unadkat
      823: '0.20',  // Akash Singh
      824: '0.20',  // Jhathavedh Subramanyan
      825: '0.20',  // Vijayakanth Viyaskanth
      
      // Other teams (keeping existing data)
      47: '11.0', // Arshdeep Singh
      48: '13.5', // Harshal Patel
      49: '7.5',  // Liam Livingstone
      50: '10.0', // Sam Curran
      
      // Rajasthan Royals
      51: '14.0', // Sanju Samson
      52: '18.0', // Yashasvi Jaiswal
      53: '15.75', // Jos Buttler
      54: '6.5',  // Shimron Hetmyer
      55: '8.0',  // Riyan Parag
      56: '12.0', // Yuzvendra Chahal
      
      // Sunrisers Hyderabad
      57: '18.5', // Pat Cummins
      58: '15.5', // Heinrich Klaasen
      59: '6.75', // Abhishek Sharma
      60: '14.0', // Travis Head
      61: '10.5', // Bhuvneshwar Kumar
      62: '9.0',  // T Natarajan
      
      // Kolkata Knight Riders
      63: '12.25', // Shreyas Iyer
      64: '16.5',  // Andre Russell
      65: '15.0',  // Sunil Narine
      66: '7.0',   // Rinku Singh
      67: '8.5',   // Varun Chakravarthy
      68: '24.75', // Mitchell Starc
      
      // Gujarat Titans
      69: '16.25', // Shubman Gill
      70: '18.0',  // Rashid Khan
      71: '6.0',   // Rahul Tewatia
      72: '7.5',   // David Miller
      73: '14.0',  // Mohammed Shami
      74: '4.0',   // Shahrukh Khan
      
      // Lucknow Super Giants
      75: '21.0',  // KL Rahul
      76: '21.0',  // Nicholas Pooran
      77: '11.5',  // Marcus Stoinis
      78: '8.5',   // Krunal Pandya
      79: '11.0',  // Ravi Bishnoi
      80: '4.0',   // Mohsin Khan
    };
    
    return playerPrices[playerId] || (Math.floor(Math.random() * 10 + 2).toFixed(1));
  };
  
  // Function to get player acquisition method (mock data for now)
  const getPlayerAcquisition = (playerId) => {
    // Mock data for player acquisition methods
    const playerAcquisitions = {
      // Delhi Capitals (Team ID 5)
      24: 'Retained', 25: 'Retained', 26: 'Retained', 27: 'Retained',
      28: 'Auction', 29: 'Auction', 30: 'RTM', 31: 'Auction',
      32: 'Auction', 33: 'Auction', 34: 'Auction', 35: 'Auction',
      36: 'Auction', 37: 'RTM', 38: 'Auction', 39: 'Auction',
      40: 'Auction', 41: 'Auction', 42: 'Auction', 43: 'Auction',
      44: 'Auction', 45: 'Auction', 46: 'Auction',
      
      // Other teams (keeping existing data)
      101: 'Retained', 102: 'Retained', 103: 'Auction', 104: 'Auction',
      105: 'Retained', 106: 'Retained', 107: 'Auction', 
      47: 'Retained', 48: 'Auction', 49: 'Auction',
      50: 'Retained', 51: 'Retained', 52: 'Retained', 53: 'Retained',
      54: 'Auction', 55: 'Retained', 56: 'Auction', 57: 'Retained',
      58: 'Retained', 59: 'Retained', 60: 'Auction', 61: 'Retained',
      62: 'Retained', 63: 'Retained', 64: 'Retained', 65: 'Retained',
      66: 'Retained', 67: 'Retained', 68: 'Auction', 69: 'Retained',
      70: 'Retained', 71: 'Retained', 72: 'Auction', 73: 'Retained',
      74: 'Auction', 75: 'Retained', 76: 'Retained', 77: 'Retained',
      78: 'Retained', 79: 'Retained', 80: 'Retained'
    };
    
    return playerAcquisitions[playerId] || (Math.random() > 0.5 ? 'Retained' : 'Auction');
  };
  
  // Function to get player nationality
  const getPlayerNationality = (playerId) => {
    // Mock data for player nationalities
    const playerNationalities = {
      // Delhi Capitals (Team ID 5)
      26: 'South Africa', // Tristan Stubbs
      28: 'Australia',    // Mitchell Starc
      30: 'Australia',    // Jake Fraser-McGurk
      36: 'South Africa', // Faf du Plessis
      40: 'Sri Lanka',    // Dushmantha Chameera
      41: 'South Africa', // Donovan Ferreira
    };
    
    return playerNationalities[playerId] || 'India';
  };
  
  // Function to get player role
  const getPlayerRole = (playerId) => {
    // Mock data for player roles
    const playerRoles = {
      // Delhi Capitals (Team ID 5)
      24: 'All-rounder',        // Axar Patel
      25: 'Bowler',             // Kuldeep Yadav
      26: 'Batter',             // Tristan Stubbs
      27: 'Wicket-keeper Batsman', // Abishek Porel
      28: 'Bowler',             // Ishant Sharma
      29: 'Wicket-keeper Batsman', // KL Rahul
      30: 'Batter',             // Jake Fraser-McGurk
      31: 'Bowler',             // T Natarajan
      32: 'Batter',             // Karun Nair
      33: 'All-rounder',        // Sameer Rizvi
      34: 'All-rounder',        // Ashutosh Sharma
      35: 'Bowler',             // Mohit Sharma
      36: 'Batter',             // Faf du Plessis
      37: 'Bowler',             // Mukesh Kumar
      38: 'All-rounder',        // Darshan Nalkande
      39: 'All-rounder',        // Vipraj Nigam
      40: 'Bowler',             // Dushmantha Chameera
      41: 'Batter',             // Donovan Ferreira
      42: 'All-rounder',        // Ajay Mandal
      43: 'All-rounder',        // Manvanth Kumar
      44: 'All-rounder',        // Madhav Tiwari
      45: 'All-rounder',        // Tripurana Vijay
      46: 'Bowler',             // Mitchell Starc
      
      // Punjab Kings
      101: 'Batter', // Shashank Singh
      102: 'Bowler', // Arshdeep Singh
      103: 'Bowler', // Harshal Patel
      104: 'All-rounder', // Liam Livingstone
      105: 'All-rounder', // Sam Curran
      106: 'Wicket-keeper Batsman', // Jitesh Sharma
      107: 'Batter', // Rilee Rossouw
    };
    
    return playerRoles[playerId] || 'Batter';
  };
  
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        
        // Ensure ID is a number
        const numericId = parseInt(id);
        
        // Fetch team data
        const teamData = await dbService.getTeamById(numericId);
        if (!teamData) {
          setError('Team not found');
          setLoading(false);
          return;
        }
        
        setTeam(teamData);
        
        // Fetch players for this team - use the numeric ID consistently
        let playersData = await dbService.getPlayersByTeam(numericId);
        
        // Log the result for debugging
        console.log(`Fetched ${playersData?.length || 0} players for team ${numericId}`);
        
        // If no players found in database or fewer than expected, use hardcoded data
        if (!playersData || playersData.length < 11) {
          console.log(`Insufficient players found for team ${numericId}, using hardcoded data`);
          
          // For Mumbai Indians (team ID 1)
          if (numericId === 1) {
            console.log('Adding hardcoded Mumbai Indians players');
            
            // Create mock Mumbai Indians players
            const miPlayers = [
              { id: 301, name: 'Rohit Sharma', teamId: 1, role: 'Batter', nationality: 'India' },
              { id: 302, name: 'Hardik Pandya', teamId: 1, role: 'All-rounder', nationality: 'India', isCaptain: true },
              { id: 303, name: 'Jasprit Bumrah', teamId: 1, role: 'Bowler', nationality: 'India' },
              { id: 304, name: 'Suryakumar Yadav', teamId: 1, role: 'Batter', nationality: 'India' },
              { id: 305, name: 'Ishan Kishan', teamId: 1, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 306, name: 'Tim David', teamId: 1, role: 'All-rounder', nationality: 'Australia' },
              { id: 307, name: 'Tilak Varma', teamId: 1, role: 'Batter', nationality: 'India' },
              { id: 308, name: 'Piyush Chawla', teamId: 1, role: 'Bowler', nationality: 'India' },
              { id: 309, name: 'Nehal Wadhera', teamId: 1, role: 'All-rounder', nationality: 'India' },
              { id: 310, name: 'Dewald Brevis', teamId: 1, role: 'Batter', nationality: 'South Africa' },
              { id: 311, name: 'Harvik Desai', teamId: 1, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 312, name: 'Naman Dhir', teamId: 1, role: 'All-rounder', nationality: 'India' },
              { id: 313, name: 'Shams Mulani', teamId: 1, role: 'All-rounder', nationality: 'India' },
              { id: 314, name: 'Arjun Tendulkar', teamId: 1, role: 'All-rounder', nationality: 'India' },
              { id: 315, name: 'Kumar Kartikeya', teamId: 1, role: 'Bowler', nationality: 'India' },
              { id: 316, name: 'Shivalik Sharma', teamId: 1, role: 'All-rounder', nationality: 'India' },
              { id: 317, name: 'Anshul Kamboj', teamId: 1, role: 'Bowler', nationality: 'India' },
              { id: 318, name: 'Nuwan Thushara', teamId: 1, role: 'Bowler', nationality: 'Sri Lanka' },
              { id: 319, name: 'Romario Shepherd', teamId: 1, role: 'All-rounder', nationality: 'West Indies' },
              { id: 320, name: 'Gerald Coetzee', teamId: 1, role: 'Bowler', nationality: 'South Africa' },
              { id: 321, name: 'Dilshan Madushanka', teamId: 1, role: 'Bowler', nationality: 'Sri Lanka' },
              { id: 322, name: 'Mohammad Nabi', teamId: 1, role: 'All-rounder', nationality: 'Afghanistan' },
              { id: 323, name: 'Shreyas Gopal', teamId: 1, role: 'Bowler', nationality: 'India' },
              { id: 324, name: 'Kwena Maphaka', teamId: 1, role: 'Bowler', nationality: 'South Africa' },
              { id: 325, name: 'Akash Madhwal', teamId: 1, role: 'Bowler', nationality: 'India' }
            ];
            
            setPlayers(miPlayers);
          } 
          // For Chennai Super Kings (team ID 2), add hardcoded players if none are found
          else if (numericId === 2) {
            console.log('Adding hardcoded Chennai Super Kings players');
            
            // Create mock Chennai Super Kings players
            const cskPlayers = [
              { id: 101, name: 'MS Dhoni', teamId: 2, role: 'Wicket-keeper Batsman', nationality: 'India', isCaptain: true },
              { id: 102, name: 'Ruturaj Gaikwad', teamId: 2, role: 'Batter', nationality: 'India' },
              { id: 103, name: 'Devon Conway', teamId: 2, role: 'Batter', nationality: 'New Zealand' },
              { id: 104, name: 'Ajinkya Rahane', teamId: 2, role: 'Batter', nationality: 'India' },
              { id: 105, name: 'Sameer Rizvi', teamId: 2, role: 'Batter', nationality: 'India' },
              { id: 106, name: 'Avanish Aravelly', teamId: 2, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 107, name: 'Ravindra Jadeja', teamId: 2, role: 'All-rounder', nationality: 'India' },
              { id: 108, name: 'Moeen Ali', teamId: 2, role: 'All-rounder', nationality: 'England' },
              { id: 109, name: 'Shivam Dube', teamId: 2, role: 'All-rounder', nationality: 'India' },
              { id: 110, name: 'Rachin Ravindra', teamId: 2, role: 'All-rounder', nationality: 'New Zealand' },
              { id: 111, name: 'Mitchell Santner', teamId: 2, role: 'All-rounder', nationality: 'New Zealand' },
              { id: 112, name: 'Ravindra Jadeja', teamId: 2, role: 'All-rounder', nationality: 'India' },
              { id: 113, name: 'Deepak Chahar', teamId: 2, role: 'Bowler', nationality: 'India' },
              { id: 114, name: 'Tushar Deshpande', teamId: 2, role: 'Bowler', nationality: 'India' },
              { id: 115, name: 'Maheesh Theekshana', teamId: 2, role: 'Bowler', nationality: 'Sri Lanka' },
              { id: 116, name: 'Simarjeet Singh', teamId: 2, role: 'Bowler', nationality: 'India' },
              { id: 117, name: 'Matheesha Pathirana', teamId: 2, role: 'Bowler', nationality: 'Sri Lanka' },
              { id: 118, name: 'Prashant Solanki', teamId: 2, role: 'Bowler', nationality: 'India' },
              { id: 119, name: 'Mukesh Choudhary', teamId: 2, role: 'Bowler', nationality: 'India' },
              { id: 120, name: 'Ajay Mandal', teamId: 2, role: 'All-rounder', nationality: 'India' },
              { id: 121, name: 'Shardul Thakur', teamId: 2, role: 'All-rounder', nationality: 'India' },
              { id: 122, name: 'Daryl Mitchell', teamId: 2, role: 'All-rounder', nationality: 'New Zealand' },
              { id: 123, name: 'Mustafizur Rahman', teamId: 2, role: 'Bowler', nationality: 'Bangladesh' },
              { id: 124, name: 'Richard Gleeson', teamId: 2, role: 'Bowler', nationality: 'England' },
              { id: 125, name: 'Rajvardhan Hangargekar', teamId: 2, role: 'All-rounder', nationality: 'India' }
            ];
            
            setPlayers(cskPlayers);
          } 
          // For Rajasthan Royals (team ID 7), add hardcoded players if none are found
          else if (numericId === 7) {
            console.log('Adding hardcoded Rajasthan Royals players');
            
            // Create mock Rajasthan Royals players
            const rrPlayers = [
              { id: 201, name: 'Sanju Samson', teamId: 7, role: 'Wicket-keeper Batsman', nationality: 'India', isCaptain: true },
              { id: 202, name: 'Jos Buttler', teamId: 7, role: 'Wicket-keeper Batsman', nationality: 'England' },
              { id: 203, name: 'Yashasvi Jaiswal', teamId: 7, role: 'Batter', nationality: 'India' },
              { id: 204, name: 'Shimron Hetmyer', teamId: 7, role: 'Batter', nationality: 'West Indies' },
              { id: 205, name: 'Riyan Parag', teamId: 7, role: 'All-rounder', nationality: 'India' },
              { id: 206, name: 'Dhruv Jurel', teamId: 7, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 207, name: 'Donovan Ferreira', teamId: 7, role: 'Wicket-keeper Batsman', nationality: 'South Africa' },
              { id: 208, name: 'Kunal Rathore', teamId: 7, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 209, name: 'Ravichandran Ashwin', teamId: 7, role: 'All-rounder', nationality: 'India' },
              { id: 210, name: 'Yuzvendra Chahal', teamId: 7, role: 'Bowler', nationality: 'India' },
              { id: 211, name: 'Trent Boult', teamId: 7, role: 'Bowler', nationality: 'New Zealand' },
              { id: 212, name: 'Sandeep Sharma', teamId: 7, role: 'Bowler', nationality: 'India' },
              { id: 213, name: 'Avesh Khan', teamId: 7, role: 'Bowler', nationality: 'India' },
              { id: 214, name: 'Prasidh Krishna', teamId: 7, role: 'Bowler', nationality: 'India' },
              { id: 215, name: 'Nandre Burger', teamId: 7, role: 'Bowler', nationality: 'South Africa' },
              { id: 216, name: 'Navdeep Saini', teamId: 7, role: 'Bowler', nationality: 'India' },
              { id: 217, name: 'Kuldeep Sen', teamId: 7, role: 'Bowler', nationality: 'India' },
              { id: 218, name: 'Rovman Powell', teamId: 7, role: 'Batter', nationality: 'West Indies' },
              { id: 219, name: 'Shubham Dubey', teamId: 7, role: 'All-rounder', nationality: 'India' },
              { id: 220, name: 'Tom Kohler-Cadmore', teamId: 7, role: 'Batter', nationality: 'England' },
              { id: 221, name: 'Abid Mushtaq', teamId: 7, role: 'All-rounder', nationality: 'India' },
              { id: 222, name: 'Tanush Kotian', teamId: 7, role: 'All-rounder', nationality: 'India' },
              { id: 223, name: 'Keshav Maharaj', teamId: 7, role: 'Bowler', nationality: 'South Africa' },
              { id: 224, name: 'Adam Zampa', teamId: 7, role: 'Bowler', nationality: 'Australia' },
              { id: 225, name: 'Obed McCoy', teamId: 7, role: 'Bowler', nationality: 'West Indies' }
            ];
            
            setPlayers(rrPlayers);
          } 
          // For Mumbai Indians (team ID 1), add hardcoded players if none are found
          else if (numericId === 1) {
            console.log('Adding hardcoded Mumbai Indians players');
            
            // Create mock Mumbai Indians players
            const miPlayers = [
              { id: 301, name: 'Rohit Sharma', teamId: 1, role: 'Batter', nationality: 'India' },
              { id: 302, name: 'Hardik Pandya', teamId: 1, role: 'All-rounder', nationality: 'India', isCaptain: true },
              { id: 303, name: 'Jasprit Bumrah', teamId: 1, role: 'Bowler', nationality: 'India' },
              { id: 304, name: 'Suryakumar Yadav', teamId: 1, role: 'Batter', nationality: 'India' },
              { id: 305, name: 'Ishan Kishan', teamId: 1, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 306, name: 'Tim David', teamId: 1, role: 'All-rounder', nationality: 'Australia' },
              { id: 307, name: 'Tilak Varma', teamId: 1, role: 'Batter', nationality: 'India' },
              { id: 308, name: 'Piyush Chawla', teamId: 1, role: 'Bowler', nationality: 'India' },
              { id: 309, name: 'Nehal Wadhera', teamId: 1, role: 'All-rounder', nationality: 'India' },
              { id: 310, name: 'Dewald Brevis', teamId: 1, role: 'Batter', nationality: 'South Africa' },
              { id: 311, name: 'Harvik Desai', teamId: 1, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 312, name: 'Naman Dhir', teamId: 1, role: 'All-rounder', nationality: 'India' },
              { id: 313, name: 'Shams Mulani', teamId: 1, role: 'All-rounder', nationality: 'India' },
              { id: 314, name: 'Arjun Tendulkar', teamId: 1, role: 'All-rounder', nationality: 'India' },
              { id: 315, name: 'Kumar Kartikeya', teamId: 1, role: 'Bowler', nationality: 'India' },
              { id: 316, name: 'Shivalik Sharma', teamId: 1, role: 'All-rounder', nationality: 'India' },
              { id: 317, name: 'Anshul Kamboj', teamId: 1, role: 'Bowler', nationality: 'India' },
              { id: 318, name: 'Nuwan Thushara', teamId: 1, role: 'Bowler', nationality: 'Sri Lanka' },
              { id: 319, name: 'Romario Shepherd', teamId: 1, role: 'All-rounder', nationality: 'West Indies' },
              { id: 320, name: 'Gerald Coetzee', teamId: 1, role: 'Bowler', nationality: 'South Africa' },
              { id: 321, name: 'Dilshan Madushanka', teamId: 1, role: 'Bowler', nationality: 'Sri Lanka' },
              { id: 322, name: 'Mohammad Nabi', teamId: 1, role: 'All-rounder', nationality: 'Afghanistan' },
              { id: 323, name: 'Shreyas Gopal', teamId: 1, role: 'Bowler', nationality: 'India' },
              { id: 324, name: 'Kwena Maphaka', teamId: 1, role: 'Bowler', nationality: 'South Africa' },
              { id: 325, name: 'Akash Madhwal', teamId: 1, role: 'Bowler', nationality: 'India' }
            ];
            
            setPlayers(miPlayers);
          } 
          // For Kolkata Knight Riders (team ID 4), add hardcoded players if none are found
          else if (numericId === 4) {
            console.log('Adding hardcoded Kolkata Knight Riders players');
            
            // Create mock Kolkata Knight Riders players
            const kkrPlayers = [
              { id: 401, name: 'Shreyas Iyer', teamId: 4, role: 'Batter', nationality: 'India', isCaptain: true },
              { id: 402, name: 'Nitish Rana', teamId: 4, role: 'Batter', nationality: 'India' },
              { id: 403, name: 'Rinku Singh', teamId: 4, role: 'Batter', nationality: 'India' },
              { id: 404, name: 'Rahmanullah Gurbaz', teamId: 4, role: 'Wicket-keeper Batsman', nationality: 'Afghanistan' },
              { id: 405, name: 'Phil Salt', teamId: 4, role: 'Wicket-keeper Batsman', nationality: 'England' },
              { id: 406, name: 'Sunil Narine', teamId: 4, role: 'All-rounder', nationality: 'West Indies' },
              { id: 407, name: 'Andre Russell', teamId: 4, role: 'All-rounder', nationality: 'West Indies' },
              { id: 408, name: 'Venkatesh Iyer', teamId: 4, role: 'All-rounder', nationality: 'India' },
              { id: 409, name: 'Anukul Roy', teamId: 4, role: 'All-rounder', nationality: 'India' },
              { id: 410, name: 'Ramandeep Singh', teamId: 4, role: 'All-rounder', nationality: 'India' },
              { id: 411, name: 'Angkrish Raghuvanshi', teamId: 4, role: 'Batter', nationality: 'India' },
              { id: 412, name: 'Sherfane Rutherford', teamId: 4, role: 'All-rounder', nationality: 'West Indies' },
              { id: 413, name: 'Manish Pandey', teamId: 4, role: 'Batter', nationality: 'India' },
              { id: 414, name: 'K.S. Bharat', teamId: 4, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 415, name: 'Vaibhav Arora', teamId: 4, role: 'Bowler', nationality: 'India' },
              { id: 416, name: 'Chetan Sakariya', teamId: 4, role: 'Bowler', nationality: 'India' },
              { id: 417, name: 'Mitchell Starc', teamId: 4, role: 'Bowler', nationality: 'Australia' },
              { id: 418, name: 'Harshit Rana', teamId: 4, role: 'Bowler', nationality: 'India' },
              { id: 419, name: 'Varun Chakravarthy', teamId: 4, role: 'Bowler', nationality: 'India' },
              { id: 420, name: 'Mujeeb Ur Rahman', teamId: 4, role: 'Bowler', nationality: 'Afghanistan' },
              { id: 421, name: 'Gurnoor Brar', teamId: 4, role: 'All-rounder', nationality: 'India' },
              { id: 422, name: 'Sakib Hussain', teamId: 4, role: 'Bowler', nationality: 'India' },
              { id: 423, name: 'Anrich Nortje', teamId: 4, role: 'Bowler', nationality: 'South Africa' },
              { id: 424, name: 'Dushmantha Chameera', teamId: 4, role: 'Bowler', nationality: 'Sri Lanka' },
              { id: 425, name: 'Suyash Sharma', teamId: 4, role: 'Bowler', nationality: 'India' }
            ];
            
            setPlayers(kkrPlayers);
          } 
          // For Royal Challengers Bangalore (team ID 3), add hardcoded players if none are found
          else if (numericId === 3) {
            console.log('Adding hardcoded Royal Challengers Bangalore players');
            
            // Create mock Royal Challengers Bangalore players
            const rcbPlayers = [
              { id: 501, name: 'Virat Kohli', teamId: 3, role: 'Batter', nationality: 'India' },
              { id: 502, name: 'Faf du Plessis', teamId: 3, role: 'Batter', nationality: 'South Africa', isCaptain: true },
              { id: 503, name: 'Glenn Maxwell', teamId: 3, role: 'All-rounder', nationality: 'Australia' },
              { id: 504, name: 'Mohammed Siraj', teamId: 3, role: 'Bowler', nationality: 'India' },
              { id: 505, name: 'Rajat Patidar', teamId: 3, role: 'Batter', nationality: 'India' },
              { id: 506, name: 'Anuj Rawat', teamId: 3, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 507, name: 'Dinesh Karthik', teamId: 3, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 508, name: 'Will Jacks', teamId: 3, role: 'All-rounder', nationality: 'England' },
              { id: 509, name: 'Mahipal Lomror', teamId: 3, role: 'All-rounder', nationality: 'India' },
              { id: 510, name: 'Karn Sharma', teamId: 3, role: 'Bowler', nationality: 'India' },
              { id: 511, name: 'Suyash Prabhudessai', teamId: 3, role: 'All-rounder', nationality: 'India' },
              { id: 512, name: 'Manoj Bhandage', teamId: 3, role: 'All-rounder', nationality: 'India' },
              { id: 513, name: 'Akash Deep', teamId: 3, role: 'Bowler', nationality: 'India' },
              { id: 514, name: 'Cameron Green', teamId: 3, role: 'All-rounder', nationality: 'Australia' },
              { id: 515, name: 'Alzarri Joseph', teamId: 3, role: 'Bowler', nationality: 'West Indies' },
              { id: 516, name: 'Yash Dayal', teamId: 3, role: 'Bowler', nationality: 'India' },
              { id: 517, name: 'Tom Curran', teamId: 3, role: 'All-rounder', nationality: 'England' },
              { id: 518, name: 'Lockie Ferguson', teamId: 3, role: 'Bowler', nationality: 'New Zealand' },
              { id: 519, name: 'Swapnil Singh', teamId: 3, role: 'All-rounder', nationality: 'India' },
              { id: 520, name: 'Saurav Chauhan', teamId: 3, role: 'Batter', nationality: 'India' },
              { id: 521, name: 'Reece Topley', teamId: 3, role: 'Bowler', nationality: 'England' },
              { id: 522, name: 'Himanshu Sharma', teamId: 3, role: 'Bowler', nationality: 'India' },
              { id: 523, name: 'Rajan Kumar', teamId: 3, role: 'Bowler', nationality: 'India' },
              { id: 524, name: 'Mayank Dagar', teamId: 3, role: 'All-rounder', nationality: 'India' },
              { id: 525, name: 'Vyshak Vijaykumar', teamId: 3, role: 'Bowler', nationality: 'India' }
            ];
            
            setPlayers(rcbPlayers);
          } 
          // For Gujarat Titans (team ID 9), add hardcoded players if none are found
          else if (numericId === 9) {
            console.log('Adding hardcoded Gujarat Titans players');
            
            // Create mock Gujarat Titans players
            const gtPlayers = [
              { id: 901, name: 'Shubman Gill', teamId: 9, role: 'Batter', nationality: 'India', isCaptain: true },
              { id: 902, name: 'David Miller', teamId: 9, role: 'Batter', nationality: 'South Africa' },
              { id: 903, name: 'Matthew Wade', teamId: 9, role: 'Wicket-keeper Batsman', nationality: 'Australia' },
              { id: 904, name: 'Wriddhiman Saha', teamId: 9, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 905, name: 'Kane Williamson', teamId: 9, role: 'Batter', nationality: 'New Zealand' },
              { id: 906, name: 'Abhinav Manohar', teamId: 9, role: 'Batter', nationality: 'India' },
              { id: 907, name: 'B. Sai Sudharsan', teamId: 9, role: 'Batter', nationality: 'India' },
              { id: 908, name: 'Darshan Nalkande', teamId: 9, role: 'Bowler', nationality: 'India' },
              { id: 909, name: 'Vijay Shankar', teamId: 9, role: 'All-rounder', nationality: 'India' },
              { id: 910, name: 'Jayant Yadav', teamId: 9, role: 'All-rounder', nationality: 'India' },
              { id: 911, name: 'Rahul Tewatia', teamId: 9, role: 'All-rounder', nationality: 'India' },
              { id: 912, name: 'Rashid Khan', teamId: 9, role: 'All-rounder', nationality: 'Afghanistan' },
              { id: 913, name: 'Mohammed Shami', teamId: 9, role: 'Bowler', nationality: 'India' },
              { id: 914, name: 'Alzarri Joseph', teamId: 9, role: 'Bowler', nationality: 'West Indies' },
              { id: 915, name: 'Yash Dayal', teamId: 9, role: 'Bowler', nationality: 'India' },
              { id: 916, name: 'R. Sai Kishore', teamId: 9, role: 'Bowler', nationality: 'India' },
              { id: 917, name: 'Noor Ahmad', teamId: 9, role: 'Bowler', nationality: 'Afghanistan' },
              { id: 918, name: 'Joshua Little', teamId: 9, role: 'Bowler', nationality: 'Ireland' },
              { id: 919, name: 'Mohit Sharma', teamId: 9, role: 'Bowler', nationality: 'India' },
              { id: 920, name: 'Pradeep Sangwan', teamId: 9, role: 'Bowler', nationality: 'India' },
              { id: 921, name: 'Umesh Yadav', teamId: 9, role: 'Bowler', nationality: 'India' },
              { id: 922, name: 'Spencer Johnson', teamId: 9, role: 'Bowler', nationality: 'Australia' },
              { id: 923, name: 'Shahrukh Khan', teamId: 9, role: 'Batter', nationality: 'India' },
              { id: 924, name: 'Kartik Tyagi', teamId: 9, role: 'Bowler', nationality: 'India' },
              { id: 925, name: 'Azmatullah Omarzai', teamId: 9, role: 'All-rounder', nationality: 'Afghanistan' }
            ];
            
            setPlayers(gtPlayers);
          } 
          // For Punjab Kings (team ID 6), add hardcoded players if none are found
          else if (numericId === 6) {
            console.log('Adding hardcoded Punjab Kings players');
            
            // Create mock Punjab Kings players
            const pbksPlayers = [
              { id: 601, name: 'Shikhar Dhawan', teamId: 6, role: 'Batter', nationality: 'India', isCaptain: true },
              { id: 602, name: 'Jonny Bairstow', teamId: 6, role: 'Wicket-keeper Batsman', nationality: 'England' },
              { id: 603, name: 'Liam Livingstone', teamId: 6, role: 'All-rounder', nationality: 'England' },
              { id: 604, name: 'Jitesh Sharma', teamId: 6, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 605, name: 'Prabhsimran Singh', teamId: 6, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 606, name: 'Harpreet Brar', teamId: 6, role: 'All-rounder', nationality: 'India' },
              { id: 607, name: 'Rishi Dhawan', teamId: 6, role: 'All-rounder', nationality: 'India' },
              { id: 608, name: 'Sam Curran', teamId: 6, role: 'All-rounder', nationality: 'England' },
              { id: 609, name: 'Sikandar Raza', teamId: 6, role: 'All-rounder', nationality: 'Zimbabwe' },
              { id: 610, name: 'Shivam Singh', teamId: 6, role: 'All-rounder', nationality: 'India' },
              { id: 611, name: 'Atharva Taide', teamId: 6, role: 'All-rounder', nationality: 'India' },
              { id: 612, name: 'Rilee Rossouw', teamId: 6, role: 'Batter', nationality: 'South Africa' },
              { id: 613, name: 'Arshdeep Singh', teamId: 6, role: 'Bowler', nationality: 'India' },
              { id: 614, name: 'Nathan Ellis', teamId: 6, role: 'Bowler', nationality: 'Australia' },
              { id: 615, name: 'Kagiso Rabada', teamId: 6, role: 'Bowler', nationality: 'South Africa' },
              { id: 616, name: 'Harshal Patel', teamId: 6, role: 'Bowler', nationality: 'India' },
              { id: 617, name: 'Rahul Chahar', teamId: 6, role: 'Bowler', nationality: 'India' },
              { id: 618, name: 'Harpreet Singh Bhatia', teamId: 6, role: 'Batter', nationality: 'India' },
              { id: 619, name: 'Vidwath Kaverappa', teamId: 6, role: 'Bowler', nationality: 'India' },
              { id: 620, name: 'Prince Choudhary', teamId: 6, role: 'Bowler', nationality: 'India' },
              { id: 621, name: 'Chris Woakes', teamId: 6, role: 'All-rounder', nationality: 'England' },
              { id: 622, name: 'Vishwanath Singh', teamId: 6, role: 'Batter', nationality: 'India' },
              { id: 623, name: 'Ashutosh Sharma', teamId: 6, role: 'Batter', nationality: 'India' },
              { id: 624, name: 'Tanay Thyagarajan', teamId: 6, role: 'Bowler', nationality: 'India' },
              { id: 625, name: 'Shashank Singh', teamId: 6, role: 'All-rounder', nationality: 'India' }
            ];
            
            setPlayers(pbksPlayers);
          } 
          // For Lucknow Super Giants (team ID 10), add hardcoded players if none are found
          else if (numericId === 10) {
            console.log('Adding hardcoded Lucknow Super Giants players');
            
            // Create mock Lucknow Super Giants players
            const lsgPlayers = [
              { id: 1001, name: 'KL Rahul', teamId: 10, role: 'Wicket-keeper Batsman', nationality: 'India', isCaptain: true },
              { id: 1002, name: 'Quinton de Kock', teamId: 10, role: 'Wicket-keeper Batsman', nationality: 'South Africa' },
              { id: 1003, name: 'Nicholas Pooran', teamId: 10, role: 'Wicket-keeper Batsman', nationality: 'West Indies' },
              { id: 1004, name: 'Ayush Badoni', teamId: 10, role: 'Batter', nationality: 'India' },
              { id: 1005, name: 'Deepak Hooda', teamId: 10, role: 'All-rounder', nationality: 'India' },
              { id: 1006, name: 'Marcus Stoinis', teamId: 10, role: 'All-rounder', nationality: 'Australia' },
              { id: 1007, name: 'Kyle Mayers', teamId: 10, role: 'All-rounder', nationality: 'West Indies' },
              { id: 1008, name: 'Krunal Pandya', teamId: 10, role: 'All-rounder', nationality: 'India' },
              { id: 1009, name: 'Krishnappa Gowtham', teamId: 10, role: 'All-rounder', nationality: 'India' },
              { id: 1010, name: 'Prerak Mankad', teamId: 10, role: 'All-rounder', nationality: 'India' },
              { id: 1011, name: 'Arshin Kulkarni', teamId: 10, role: 'All-rounder', nationality: 'India' },
              { id: 1012, name: 'Ashton Turner', teamId: 10, role: 'Batter', nationality: 'Australia' },
              { id: 1013, name: 'Devdutt Padikkal', teamId: 10, role: 'Batter', nationality: 'India' },
              { id: 1014, name: 'Mohsin Khan', teamId: 10, role: 'Bowler', nationality: 'India' },
              { id: 1015, name: 'Ravi Bishnoi', teamId: 10, role: 'Bowler', nationality: 'India' },
              { id: 1016, name: 'Naveen-ul-Haq', teamId: 10, role: 'Bowler', nationality: 'Afghanistan' },
              { id: 1017, name: 'Yudhvir Singh', teamId: 10, role: 'Bowler', nationality: 'India' },
              { id: 1018, name: 'Mayank Yadav', teamId: 10, role: 'Bowler', nationality: 'India' },
              { id: 1019, name: 'Mark Wood', teamId: 10, role: 'Bowler', nationality: 'England' },
              { id: 1020, name: 'Shivam Mavi', teamId: 10, role: 'Bowler', nationality: 'India' },
              { id: 1021, name: 'Yash Thakur', teamId: 10, role: 'Bowler', nationality: 'India' },
              { id: 1022, name: 'David Willey', teamId: 10, role: 'All-rounder', nationality: 'England' },
              { id: 1023, name: 'Arshad Khan', teamId: 10, role: 'All-rounder', nationality: 'India' },
              { id: 1024, name: 'Shamar Joseph', teamId: 10, role: 'Bowler', nationality: 'West Indies' },
              { id: 1025, name: 'M. Siddharth', teamId: 10, role: 'Bowler', nationality: 'India' }
            ];
            
            setPlayers(lsgPlayers);
          } 
          // For Sunrisers Hyderabad (team ID 8), add hardcoded players if none are found
          else if (numericId === 8) {
            console.log('Adding hardcoded Sunrisers Hyderabad players');
            
            // Create mock Sunrisers Hyderabad players
            const srhPlayers = [
              { id: 801, name: 'Pat Cummins', teamId: 8, role: 'All-rounder', nationality: 'Australia', isCaptain: true },
              { id: 802, name: 'Abhishek Sharma', teamId: 8, role: 'All-rounder', nationality: 'India' },
              { id: 803, name: 'Aiden Markram', teamId: 8, role: 'Batter', nationality: 'South Africa' },
              { id: 804, name: 'Heinrich Klaasen', teamId: 8, role: 'Wicket-keeper Batsman', nationality: 'South Africa' },
              { id: 805, name: 'Travis Head', teamId: 8, role: 'Batter', nationality: 'Australia' },
              { id: 806, name: 'Glenn Phillips', teamId: 8, role: 'Wicket-keeper Batsman', nationality: 'New Zealand' },
              { id: 807, name: 'Rahul Tripathi', teamId: 8, role: 'Batter', nationality: 'India' },
              { id: 808, name: 'Abdul Samad', teamId: 8, role: 'All-rounder', nationality: 'India' },
              { id: 809, name: 'Washington Sundar', teamId: 8, role: 'All-rounder', nationality: 'India' },
              { id: 810, name: 'Marco Jansen', teamId: 8, role: 'All-rounder', nationality: 'South Africa' },
              { id: 811, name: 'Sanvir Singh', teamId: 8, role: 'All-rounder', nationality: 'India' },
              { id: 812, name: 'Nitish Kumar Reddy', teamId: 8, role: 'All-rounder', nationality: 'India' },
              { id: 813, name: 'Shahbaz Ahmed', teamId: 8, role: 'All-rounder', nationality: 'India' },
              { id: 814, name: 'Bhuvneshwar Kumar', teamId: 8, role: 'Bowler', nationality: 'India' },
              { id: 815, name: 'T. Natarajan', teamId: 8, role: 'Bowler', nationality: 'India' },
              { id: 816, name: 'Mayank Markande', teamId: 8, role: 'Bowler', nationality: 'India' },
              { id: 817, name: 'Umran Malik', teamId: 8, role: 'Bowler', nationality: 'India' },
              { id: 818, name: 'Fazalhaq Farooqi', teamId: 8, role: 'Bowler', nationality: 'Afghanistan' },
              { id: 819, name: 'Mayank Agarwal', teamId: 8, role: 'Batter', nationality: 'India' },
              { id: 820, name: 'Anmolpreet Singh', teamId: 8, role: 'Batter', nationality: 'India' },
              { id: 821, name: 'Upendra Yadav', teamId: 8, role: 'Wicket-keeper Batsman', nationality: 'India' },
              { id: 822, name: 'Jaydev Unadkat', teamId: 8, role: 'Bowler', nationality: 'India' },
              { id: 823, name: 'Akash Singh', teamId: 8, role: 'Bowler', nationality: 'India' },
              { id: 824, name: 'Jhathavedh Subramanyan', teamId: 8, role: 'Bowler', nationality: 'India' },
              { id: 825, name: 'Vijayakanth Viyaskanth', teamId: 8, role: 'Bowler', nationality: 'Sri Lanka' }
            ];
            
            setPlayers(srhPlayers);
          } else {
            setPlayers([]);
          }
        } else {
          setPlayers(playersData);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching team data:', err);
        setError('Failed to load team data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchTeamData();
  }, [id]);
  
  if (loading) {
    return (
      <ProfileContainer>
        <BreadcrumbNav>
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/teams">Teams</Link>
          <span>›</span>
          <span>Loading...</span>
        </BreadcrumbNav>
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      </ProfileContainer>
    );
  }
  
  if (error || !team) {
    return (
      <ProfileContainer>
        <BreadcrumbNav>
          <Link to="/">Home</Link>
          <span>›</span>
          <Link to="/teams">Teams</Link>
          <span>›</span>
          <span>Error</span>
        </BreadcrumbNav>
        <ErrorMessage>
          <h2>Team not found</h2>
          <p>We couldn't find the team you're looking for. It may have been removed or you might have followed an incorrect link.</p>
          <Link to="/teams">View All Teams</Link>
        </ErrorMessage>
      </ProfileContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <BreadcrumbNav>
        <Link to="/">Home</Link>
        <span>›</span>
        <Link to="/teams">Teams</Link>
        <span>›</span>
        <span>{team.name}</span>
      </BreadcrumbNav>
      
      <TeamHeader bgColor={team.color}>
        <TeamLogo>
          <img 
            src={getTeamLogoPath(team.shortName)} 
            alt={`${team.name} logo`}
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = team.shortName;
            }}
          />
        </TeamLogo>
        <TeamInfo>
          <TeamName>{team.shortName}</TeamName>
          <TeamFullName>{team.name}</TeamFullName>
          
          <SeasonSelector>
            <SeasonTab 
              active={activeSeason === '2024'} 
              onClick={() => setActiveSeason('2024')}
            >
              IPL 2024 (Completed)
            </SeasonTab>
            <SeasonTab 
              active={activeSeason === '2025'} 
              onClick={() => setActiveSeason('2025')}
            >
              IPL 2025 (Upcoming)
            </SeasonTab>
          </SeasonSelector>
          
          {activeSeason === '2024' && (
            <SeasonInfoCard>
              <SeasonTitle>IPL 2024 Season</SeasonTitle>
              <TeamStats>
                <StatItem>
                  <div className="value">14</div>
                  <div className="label">Matches</div>
                </StatItem>
                <StatItem>
                  <div className="value">8</div>
                  <div className="label">Wins</div>
                </StatItem>
                <StatItem>
                  <div className="value">6</div>
                  <div className="label">Losses</div>
                </StatItem>
                <StatItem>
                  <div className="value">57.1%</div>
                  <div className="label">Win Rate</div>
                </StatItem>
                <StatItem>
                  <div className="value">{team.id <= 5 ? '5' : team.id <= 8 ? '1' : '0'}</div>
                  <div className="label">Titles</div>
                </StatItem>
              </TeamStats>
              <SeasonHighlights>
                <HighlightItem>
                  <HighlightLabel>Final Position:</HighlightLabel>
                  <HighlightValue>{team.id % 3 === 0 ? 'Champions' : team.id % 3 === 1 ? 'Playoffs' : 'League Stage'}</HighlightValue>
                </HighlightItem>
                <HighlightItem>
                  <HighlightLabel>Top Scorer:</HighlightLabel>
                  <HighlightValue>{players[0]?.name || 'N/A'} ({Math.floor(Math.random() * 400 + 300)} runs)</HighlightValue>
                </HighlightItem>
                <HighlightItem>
                  <HighlightLabel>Top Wicket-taker:</HighlightLabel>
                  <HighlightValue>{players[1]?.name || 'N/A'} ({Math.floor(Math.random() * 15 + 10)} wickets)</HighlightValue>
                </HighlightItem>
              </SeasonHighlights>
            </SeasonInfoCard>
          )}
          
          {activeSeason === '2025' && (
            <SeasonInfoCard>
              <SeasonTitle>IPL 2025 Season (Upcoming)</SeasonTitle>
              <UpcomingSeasonInfo>
                <UpcomingSeasonDate>Starting April 2025</UpcomingSeasonDate>
                <UpcomingSeasonDetails>
                  <UpcomingDetail>
                    <UpcomingIcon>🏟️</UpcomingIcon>
                    <UpcomingText>Home Ground: {team.id === 1 ? 'Wankhede Stadium' : 
                                              team.id === 2 ? 'M. A. Chidambaram Stadium' : 
                                              team.id === 3 ? 'M. Chinnaswamy Stadium' : 
                                              team.id === 4 ? 'Eden Gardens' : 
                                              team.id === 5 ? 'Arun Jaitley Stadium' : 
                                              team.id === 6 ? 'Punjab Cricket Association Stadium' : 
                                              team.id === 7 ? 'Sawai Mansingh Stadium' : 
                                              team.id === 8 ? 'Rajiv Gandhi International Cricket Stadium' : 
                                              team.id === 9 ? 'Narendra Modi Stadium' : 
                                              'Ekana Cricket Stadium'}</UpcomingText>
                  </UpcomingDetail>
                  <UpcomingDetail>
                    <UpcomingIcon>👨‍💼</UpcomingIcon>
                    <UpcomingText>Coach: {team.id === 1 ? 'Mahela Jayawardene' : 
                                        team.id === 2 ? 'Stephen Fleming' : 
                                        team.id === 3 ? 'Andy Flower' : 
                                        team.id === 4 ? 'Chandrakant Pandit' : 
                                        team.id === 5 ? 'Ricky Ponting' : 
                                        team.id === 6 ? 'Trevor Bayliss' : 
                                        team.id === 7 ? 'Kumar Sangakkara' : 
                                        team.id === 8 ? 'Brian Lara' : 
                                        team.id === 9 ? 'Ashish Nehra' : 
                                        'Justin Langer'}</UpcomingText>
                  </UpcomingDetail>
                  <UpcomingDetail>
                    <UpcomingIcon>💰</UpcomingIcon>
                    <UpcomingText>Remaining Purse: ₹{Math.floor(Math.random() * 10 + 5)} Crore</UpcomingText>
                  </UpcomingDetail>
                  <UpcomingDetail>
                    <UpcomingIcon>🔄</UpcomingIcon>
                    <UpcomingText>RTM Cards: {Math.floor(Math.random() * 3)}</UpcomingText>
                  </UpcomingDetail>
                </UpcomingSeasonDetails>
              </UpcomingSeasonInfo>
            </SeasonInfoCard>
          )}
        </TeamInfo>
      </TeamHeader>
      
      <TabsContainer>
        <TabList>
          <Tab 
            active={activeTab === 'squad'} 
            onClick={() => setActiveTab('squad')}
          >
            Squad
          </Tab>
          <Tab 
            active={activeTab === 'matches'} 
            onClick={() => setActiveTab('matches')}
          >
            Matches
          </Tab>
          <Tab 
            active={activeTab === 'stats'} 
            onClick={() => setActiveTab('stats')}
          >
            Stats & Records
          </Tab>
          <Tab 
            active={activeTab === 'news'} 
            onClick={() => setActiveTab('news')}
          >
            News
          </Tab>
          <Tab 
            active={activeTab === 'videos'} 
            onClick={() => setActiveTab('videos')}
          >
            Videos
          </Tab>
        </TabList>
        
        {activeTab === 'squad' && (
          <>
            <SectionTitle>Team Squad - IPL 2025</SectionTitle>
            
            <ViewToggle>
              <ViewToggleButton 
                active={squadView === 'table'} 
                onClick={() => setSquadView('table')}
              >
                Table View
              </ViewToggleButton>
              <ViewToggleButton 
                active={squadView === 'grid'} 
                onClick={() => setSquadView('grid')}
              >
                Grid View
              </ViewToggleButton>
            </ViewToggle>
            
            {players.length > 0 ? (
              <>
                {squadView === 'table' ? (
                  <SquadTable>
                    <TableHead>
                      <tr>
                        <TableHeaderCell>No.</TableHeaderCell>
                        <TableHeaderCell>Player</TableHeaderCell>
                        <TableHeaderCell>Price (INR)</TableHeaderCell>
                        <TableHeaderCell>Acquisition</TableHeaderCell>
                        <TableHeaderCell>Role</TableHeaderCell>
                      </tr>
                    </TableHead>
                    <tbody>
                      {players.map((player, index) => (
                        <TableRow key={player.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <PlayerRowDetails>
                              <CircularPlayerImage>
                                <img 
                                  src={getPlayerImagePath(player.id)} 
                                  alt={player.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `${process.env.PUBLIC_URL}/assets/images/players/default.svg`;
                                  }}
                                />
                              </CircularPlayerImage>
                              <PlayerNameCell>
                                {player.name}
                                {player.isCaptain && <CaptainBadge>C</CaptainBadge>}
                                {getPlayerNationality(player.id) !== 'India' && 
                                  <NationalitySpan>({getPlayerNationality(player.id)})</NationalitySpan>
                                }
                              </PlayerNameCell>
                            </PlayerRowDetails>
                          </TableCell>
                          <PriceCell>₹{getPlayerPrice(player.id)} crore</PriceCell>
                          <AcquisitionCell>
                            <span className={getPlayerAcquisition(player.id).toLowerCase()}>
                              {getPlayerAcquisition(player.id)}
                            </span>
                          </AcquisitionCell>
                          <RoleCell>{getPlayerRole(player.id) || player.role}</RoleCell>
                        </TableRow>
                      ))}
                    </tbody>
                  </SquadTable>
                ) : (
                  <>
                    {/* Group players by role */}
                    {['Batsman', 'Wicket-keeper Batsman', 'All-rounder', 'Bowler'].map(role => {
                      const roleSpecificPlayers = players.filter(player => 
                        player.role === role || 
                        // Fallback for players without role
                        (role === 'Batsman' && !player.role)
                      );
                      
                      if (roleSpecificPlayers.length === 0) return null;
                      
                      return (
                        <div key={role}>
                          <SectionTitle style={{ fontSize: '1.2rem', marginTop: '1.5rem' }}>{role}s</SectionTitle>
                          <PlayerGrid>
                            {roleSpecificPlayers.map(player => (
                              <PlayerCard key={player.id}>
                                <PlayerImageContainer>
                                  <img 
                                    src={getPlayerImagePath(player.id)} 
                                    alt={player.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `${process.env.PUBLIC_URL}/assets/images/players/default.svg`;
                                    }}
                                  />
                                  <PlayerRole>{getPlayerRole(player.id) || player.role}</PlayerRole>
                                  {player.isCaptain && (
                                    <CaptainBadge>C</CaptainBadge>
                                  )}
                                </PlayerImageContainer>
                                <PlayerInfo>
                                  <PlayerName>
                                    {player.name}
                                    {player.isCaptain && <span style={{ marginLeft: '5px', color: 'gold' }}>★</span>}
                                  </PlayerName>
                                  <PlayerDetails>
                                    <div>Role: {getPlayerRole(player.id) || player.role}</div>
                                    <div>Batting: {player.battingStyle || 'Right-handed'}</div>
                                    <div>Bowling: {player.bowlingStyle || 'Right-arm medium'}</div>
                                    <div>Nationality: {getPlayerNationality(player.id) || 'Indian'}</div>
                                    <div>Age: {player.age || 'N/A'}</div>
                                  </PlayerDetails>
                                  
                                  {/* Player Stats */}
                                  <PlayerStats>
                                    {(getPlayerRole(player.id) || player.role) !== 'Bowler' && (
                                      <StatGroup>
                                        <StatTitle>Batting</StatTitle>
                                        <StatRow>
                                          <PlayerStatItem>
                                            <StatLabel>M</StatLabel>
                                            <StatValue>{player.stats?.batting?.matches || 0}</StatValue>
                                          </PlayerStatItem>
                                          <PlayerStatItem>
                                            <StatLabel>R</StatLabel>
                                            <StatValue>{player.stats?.batting?.runs || 0}</StatValue>
                                          </PlayerStatItem>
                                          <PlayerStatItem>
                                            <StatLabel>Avg</StatLabel>
                                            <StatValue>{player.stats?.batting?.average || 0}</StatValue>
                                          </PlayerStatItem>
                                          <PlayerStatItem>
                                            <StatLabel>SR</StatLabel>
                                            <StatValue>{player.stats?.batting?.strikeRate || 0}</StatValue>
                                          </PlayerStatItem>
                                        </StatRow>
                                      </StatGroup>
                                    )}
                                    
                                    {(getPlayerRole(player.id) || player.role) === 'Bowler' || (getPlayerRole(player.id) || player.role) === 'All-rounder' && (
                                      <StatGroup>
                                        <StatTitle>Bowling</StatTitle>
                                        <StatRow>
                                          <PlayerStatItem>
                                            <StatLabel>M</StatLabel>
                                            <StatValue>{player.stats?.bowling?.matches || 0}</StatValue>
                                          </PlayerStatItem>
                                          <PlayerStatItem>
                                            <StatLabel>W</StatLabel>
                                            <StatValue>{player.stats?.bowling?.wickets || 0}</StatValue>
                                          </PlayerStatItem>
                                          <PlayerStatItem>
                                            <StatLabel>Econ</StatLabel>
                                            <StatValue>{player.stats?.bowling?.economy || 0}</StatValue>
                                          </PlayerStatItem>
                                        </StatRow>
                                      </StatGroup>
                                    )}
                                  </PlayerStats>
                                  
                                  <ViewProfileButton to={`/players/${player.id}`}>
                                    View Profile
                                  </ViewProfileButton>
                                </PlayerInfo>
                              </PlayerCard>
                            ))}
                          </PlayerGrid>
                        </div>
                      );
                    })}
                  </>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No players found for this team.</p>
              </div>
            )}
          </>
        )}
        
        {activeTab === 'matches' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Match schedule will be available soon</h3>
            <p>The IPL 2025 schedule will be announced closer to the tournament start date.</p>
          </div>
        )}
        
        {activeTab === 'stats' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Team statistics will be available soon</h3>
            <p>Detailed team statistics and records will be updated as the tournament progresses.</p>
          </div>
        )}
        
        {activeTab === 'news' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Team news will be available soon</h3>
            <p>Stay tuned for the latest news and updates about {team.name}.</p>
          </div>
        )}
        
        {activeTab === 'videos' && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h3>Team videos will be available soon</h3>
            <p>Highlights, interviews, and behind-the-scenes content will be added soon.</p>
          </div>
        )}
      </TabsContainer>
    </ProfileContainer>
  );
};

export default TeamProfile;
