import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import './styles/global.css';
import theme from './utils/theme';
import GlobalStyles from './utils/GlobalStyles';
import axiosClient from './services/axiosClient';
import { Alert, Button } from '@mui/material';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HeaderBanner from './components/common/HeaderBanner';

// Pages
import Home from './pages/Home';
import Players from './pages/Players';
import Teams from './pages/Teams';
import Matches from './pages/Matches';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import ZimDurhamMatch from './pages/ZimDurhamMatch';
import LiveMatch from './pages/LiveMatch';
import LiveMatches from './pages/LiveMatches';
// import Series from './pages/Series'; // Comment out the old Series component
import SeriesListPage from './pages/SeriesListPage';
import SeriesDetails from './pages/SeriesDetails';
import SeriesMatches from './pages/SeriesMatches';
import MatchDetails from './pages/MatchDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';

// Detailed Components
import PlayerProfile from './components/players/PlayerProfile';
import TeamProfile from './components/teams/TeamProfile';
import { default as MatchDetailsComponent } from './components/matches/MatchDetails';
import PointsTable from './components/points/PointsTable';
import DatabaseStatus from './components/DatabaseStatus';

function App() {
  const [dbError, setDbError] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check API connectivity when the app starts
    const checkApiConnectivity = async () => {
      try {
        // Test API connectivity by making a simple request to the cricket data API
        const response = await axiosClient.get('/countries');
        console.log('API connection successful:', response);
        // If we get here, the API is working
        setDbError(null);
        setShowBanner(false);
      } catch (error) {
        console.error('Error connecting to API:', error);
        // Don't show any error message to users
        setDbError(null);
        setShowBanner(false);
      }
    };

    checkApiConnectivity();
  }, []);

  const handleCloseBanner = () => {
    setShowBanner(false);
  };

  const handleRetryConnection = async () => {
    try {
      const response = await axiosClient.get('/countries');
      console.log('API retry successful:', response);
      setDbError(null);
      setShowBanner(false);
    } catch (error) {
      console.error('Error retrying API connection:', error);
      // Don't show any error message to users
      setDbError(null);
      setShowBanner(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <div className="app-container">
          <HeaderBanner />
          <Navbar />
          <main className="main-content">
            {/* Error banner is now disabled */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/players" element={<Players />} />
              <Route path="/players/:id" element={<PlayerProfile />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamProfile />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/matches/:id" element={<MatchDetailsComponent />} />
              <Route path="/match/:slug" element={<MatchDetails />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/points-table" element={<PointsTable />} />
              <Route path="/database-status" element={<DatabaseStatus />} />
              <Route path="/zim-durham-match" element={<ZimDurhamMatch />} />
              <Route path="/live-match" element={<LiveMatch />} />
              <Route path="/live-matches" element={<LiveMatches />} />
              <Route path="/series" element={<SeriesListPage />} />
              <Route path="/series/:slug" element={<SeriesDetails />} />
              <Route path="/series/:slug/matches" element={<SeriesMatches />} />
              <Route path="/series/:slug/points" element={<SeriesDetails initialTab="points" />} />
              <Route path="/series/:slug/live-points" element={<SeriesDetails initialTab="live-points" />} />
              <Route path="/series/uuid/:uuid" element={<SeriesDetails />} />
              <Route path="/series/uuid/:uuid/matches" element={<SeriesMatches />} />
              <Route path="/series/uuid/:uuid/points" element={<SeriesDetails initialTab="points" />} />
              <Route path="/series/uuid/:uuid/live-points" element={<SeriesDetails initialTab="live-points" />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
