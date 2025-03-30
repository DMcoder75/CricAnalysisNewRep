/**
 * IPL Cricket Analytics Server
 * This server provides API endpoints for the React frontend and handles live match data polling
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysqlService = require('../src/services/mysqlService');
const cricketApiService = require('../src/services/cricketApiService');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../build')));

// Import API routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Points table update interval (in milliseconds)
const POINTS_TABLE_UPDATE_INTERVAL = process.env.POINTS_TABLE_UPDATE_INTERVAL || 6 * 60 * 60 * 1000; // Default: 6 hours

// Initialize database
mysqlService.init()
  .then(() => {
    console.log('Database initialized successfully');
    
    // Start live match polling (every 2 minutes)
    const pollingIntervalId = cricketApiService.setupLiveMatchPolling(2);
    console.log('Live match polling started');
    
    // Setup automatic points table update for IPL 2025
    const { updateIPL2025PointsTable } = require('./routes/api');
    
    // Initial update of the points table
    console.log('Performing initial update of IPL 2025 points table...');
    updateIPL2025PointsTable()
      .then(success => {
        if (success) {
          console.log('Initial IPL 2025 points table update completed successfully');
        } else {
          console.warn('Initial IPL 2025 points table update failed');
        }
      })
      .catch(error => {
        console.error('Error during initial IPL 2025 points table update:', error);
      });
    
    // Schedule regular updates of the points table
    const pointsTableIntervalId = setInterval(() => {
      console.log(`Scheduled update of IPL 2025 points table (every ${POINTS_TABLE_UPDATE_INTERVAL/3600000} hours)...`);
      updateIPL2025PointsTable()
        .then(success => {
          if (success) {
            console.log('Scheduled IPL 2025 points table update completed successfully');
          } else {
            console.warn('Scheduled IPL 2025 points table update failed');
          }
        })
        .catch(error => {
          console.error('Error during scheduled IPL 2025 points table update:', error);
        });
    }, POINTS_TABLE_UPDATE_INTERVAL);
    
    // Handle application shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      clearInterval(pollingIntervalId);
      clearInterval(pointsTableIntervalId);
      process.exit(0);
    });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
  });

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`IPL 2025 points table will auto-update every ${POINTS_TABLE_UPDATE_INTERVAL/3600000} hours`);
});
