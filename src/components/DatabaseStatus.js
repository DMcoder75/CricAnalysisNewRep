import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, CircularProgress, List, ListItem, ListItemText, Alert, Chip } from '@mui/material';
import axiosClient from '../services/axiosClient';

/**
 * DatabaseStatus component
 * Displays the current status of the database connection and tables
 */
const DatabaseStatus = () => {
  const [dbStatus, setDbStatus] = useState(null);
  const [mysqlStatus, setMysqlStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  const checkDatabaseStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorDetails(null);
      setUsingMockData(false);
      
      console.log('Checking MySQL server status...');
      
      // First check if MySQL server is running
      try {
        const mysqlResponse = await axiosClient.get('/api/mysql-status');
        console.log('MySQL server status response:', mysqlResponse.data);
        setMysqlStatus(mysqlResponse.data);
        
        // Check if we're using mock data
        if (mysqlResponse.data.usingMockData) {
          setUsingMockData(true);
        }
        
        // If MySQL server is running, check database connection
        if (mysqlResponse.data.success) {
          console.log('Checking database connection status...');
          
          try {
            // Check database connection status
            const statusResponse = await axiosClient.get('/api/db-status');
            console.log('Database status response:', statusResponse.data);
            setDbStatus(statusResponse.data);
            
            // Check if we're using mock data
            if (statusResponse.data.usingMockData) {
              setUsingMockData(true);
            }
            
            // If connected, get the list of tables
            if (statusResponse.data.success) {
              try {
                const tablesResponse = await axiosClient.get('/api/db-tables');
                console.log('Database tables response:', tablesResponse.data);
                // Removed unused dbTables state variable
              } catch (tablesErr) {
                console.error('Error fetching database tables:', tablesErr);
                // Don't set an error, just log it
              }
            }
          } catch (dbErr) {
            console.error('Error checking database status:', dbErr);
            setDbStatus({
              success: false,
              message: 'Failed to connect to the database',
              error: dbErr.message || 'Unknown error',
              config: mysqlResponse.data.config,
              usingMockData: true
            });
            setUsingMockData(true);
          }
        } else {
          // MySQL server is not running, set using mock data
          setUsingMockData(true);
        }
      } catch (mysqlErr) {
        console.error('Error checking MySQL server status:', mysqlErr);
        setMysqlStatus({
          success: false,
          message: 'Failed to connect to MySQL server',
          error: mysqlErr.message || 'Unknown error',
          usingMockData: true
        });
        
        // Set overall error but indicate we're using mock data
        setError('MySQL server is not running. The application will use mock data instead.');
        setErrorDetails(mysqlErr.message || 'Unknown error');
        setUsingMockData(true);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Unexpected error during status checks:', err);
      setError('Failed to check database status. The application will use mock data instead.');
      setErrorDetails(err.message || 'Unknown error');
      setUsingMockData(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4">Database Connection Status</Typography>
          {usingMockData && (
            <Chip 
              label="Using Mock Data" 
              color="primary" 
              variant="outlined" 
              sx={{ ml: 2 }}
            />
          )}
        </Box>
        
        {usingMockData && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="subtitle1">
              The application is currently using mock data since MySQL is not available. 
              All features will work with pre-defined sample data.
            </Typography>
          </Alert>
        )}
        
        {loading ? (
          <Box display="flex" alignItems="center" my={3}>
            <CircularProgress size={24} sx={{ mr: 2 }} />
            <Typography>Checking database connection...</Typography>
          </Box>
        ) : error ? (
          <Box my={3}>
            <Typography color={usingMockData ? "text.secondary" : "error"}>{error}</Typography>
            {errorDetails && !usingMockData && (
              <Box sx={{ mt: 2, p: 2, bgcolor: '#fff4f4', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="error">Error Details:</Typography>
                <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {errorDetails}
                </Typography>
              </Box>
            )}
            <Button 
              variant="contained" 
              color="primary" 
              onClick={checkDatabaseStatus}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Box>
        ) : (
          <Box>
            {/* MySQL Server Status */}
            <Typography variant="h6" gutterBottom>MySQL Server Status:</Typography>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: mysqlStatus?.success ? 'success.light' : (usingMockData ? 'info.light' : 'error.light'),
                borderRadius: 1,
                mb: 3
              }}
            >
              <Typography variant="h6" color={mysqlStatus?.success ? 'success.dark' : (usingMockData ? 'info.dark' : 'error.dark')}>
                {mysqlStatus?.success ? 'MySQL Server Running' : (usingMockData ? 'Using Mock Data' : 'MySQL Server Not Available')}
              </Typography>
              <Typography variant="body1">
                {mysqlStatus?.message}
              </Typography>
              {mysqlStatus?.error && !usingMockData && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#fff4f4', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="error">Error Details:</Typography>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {mysqlStatus.error}
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Database Connection Status */}
            <Typography variant="h6" gutterBottom>Database Connection Status:</Typography>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: dbStatus?.success ? 'success.light' : (usingMockData ? 'info.light' : 'error.light'),
                borderRadius: 1,
                mb: 3
              }}
            >
              <Typography variant="h6" color={dbStatus?.success ? 'success.dark' : (usingMockData ? 'info.dark' : 'error.dark')}>
                {dbStatus?.success ? 'Connected to Database' : (usingMockData ? 'Using Mock Data' : 'Database Connection Failed')}
              </Typography>
              <Typography variant="body1">
                {dbStatus?.message}
              </Typography>
              {dbStatus?.error && !usingMockData && (
                <Box sx={{ mt: 2, p: 2, bgcolor: '#fff4f4', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="error">Error Details:</Typography>
                  <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {dbStatus.error}
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Connection Details */}
            <Typography variant="h6" gutterBottom>Connection Details:</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography><strong>Host:</strong> {dbStatus?.config?.host || mysqlStatus?.config?.host}</Typography>
              <Typography><strong>Port:</strong> {dbStatus?.config?.port || mysqlStatus?.config?.port}</Typography>
              <Typography><strong>Database:</strong> {dbStatus?.config?.database || 'N/A'}</Typography>
              <Typography><strong>User:</strong> {dbStatus?.config?.user || mysqlStatus?.config?.user}</Typography>
            </Box>
            
            {/* Mock Data Information */}
            {usingMockData && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Mock Data Information:</Typography>
                <Typography variant="body2">
                  The application is using pre-defined cricket match data for the Zimbabwe A vs Durham match.
                  All features including match details, scorecard, and statistics are available with this mock data.
                </Typography>
              </Alert>
            )}
            
            {/* Common MySQL Issues */}
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Common MySQL Connection Issues:</Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="MySQL Service Not Running" 
                    secondary="Make sure the MySQL service is running on your system" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Incorrect Credentials" 
                    secondary="Verify the username and password in your configuration" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Database Does Not Exist" 
                    secondary="Check if the database has been created" 
                  />
                </ListItem>
              </List>
            </Alert>
            
            <Button 
              variant="contained" 
              color="primary" 
              onClick={checkDatabaseStatus}
            >
              Refresh Status
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default DatabaseStatus;
