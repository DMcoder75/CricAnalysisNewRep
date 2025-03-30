import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import LiveMatchFeed from '../components/LiveMatchFeed';

/**
 * LiveMatch page component
 * Displays live match feed for Durham Women vs ZIM-W HP-XI
 */
const LiveMatch = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Live Match
          </Typography>
          <Button 
            component={Link} 
            to="/" 
            variant="outlined"
          >
            Back to Home
          </Button>
        </Box>
        
        <LiveMatchFeed 
          matchId="durham-zim-2025-03-20" 
          matchTitle="Durham Women vs ZIM-W HP-XI, 1st Match"
        />
      </Box>
    </Container>
  );
};

export default LiveMatch;
