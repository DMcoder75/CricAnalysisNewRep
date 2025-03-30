/**
 * Simple Express Server on Port 5001
 * This server provides a basic API endpoint to check database connectivity
 * and serves the React app
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mysql = require('mysql2/promise');
const dbConfig = require('../src/config/db.config');
const apiRoutes = require('./routes/api');
const { testConnection } = require('./db/mysql');
const pool = mysql.createPool(dbConfig);
const axios = require('axios');
const { setupVirtualHosts } = require('./vhost');
const { setupSSL } = require('./ssl-setup');
const http = require('http');
const fs = require('fs');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3002; // Default to 3002, but can be changed via environment variable
const DOMAIN = 'www.crichattric.com'; // Production domain
const DYNAMIC_DOMAINS = ['crichattric.ddns.net', 'crichattric.hopto.org', 'crichattric.no-ip.org']; // No-IP domains
const AWS_DOMAIN = 'ec2-34-224-237-254.compute-1.amazonaws.com'; // AWS EC2 instance

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002', 
    'http://www.crichattric.com', 
    'https://www.crichattric.com', 
    'http://crichattric.com', 
    'https://crichattric.com',
    // No-IP domains
    'http://crichattric.ddns.net',
    'https://crichattric.ddns.net',
    'http://crichattric.hopto.org',
    'https://crichattric.hopto.org',
    'http://crichattric.no-ip.org',
    'https://crichattric.no-ip.org',
    // AWS domain
    `http://${AWS_DOMAIN}`,
    `https://${AWS_DOMAIN}`,
    `http://${AWS_DOMAIN}:3002`,
    `https://${AWS_DOMAIN}:3002`
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add CORS headers to all responses
app.use((req, res, next) => {
  const allowedOrigins = [
    'http://localhost:3000', 
    'http://localhost:3001', 
    'http://localhost:3002', 
    'http://www.crichattric.com', 
    'https://www.crichattric.com', 
    'http://crichattric.com', 
    'https://crichattric.com',
    // No-IP domains
    'http://crichattric.ddns.net',
    'https://crichattric.ddns.net',
    'http://crichattric.hopto.org',
    'https://crichattric.hopto.org',
    'http://crichattric.no-ip.org',
    'https://crichattric.no-ip.org',
    // AWS domain
    `http://${AWS_DOMAIN}`,
    `https://${AWS_DOMAIN}`,
    `http://${AWS_DOMAIN}:3002`,
    `https://${AWS_DOMAIN}:3002`
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup virtual hosts for domain-based routing
setupVirtualHosts(app);

// Register API routes
app.use('/api', apiRoutes);

// Serve static files from the React build folder
app.use(express.static(path.join(__dirname, '../build')));

// Also serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Log all API requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Add a specific route for the live match page
app.get('/live-match', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'live-match.html'));
});

// Catch-all route to serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start the server
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`HTTP Server running on port ${PORT}`);
  console.log(`Access your application at:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Production: http://www.crichattric.com`);
  console.log(`Note: For the outside world to access your site, you need to:`);
  console.log(`1. Configure port forwarding on your router (port 80/443 → ${PORT})`);
  console.log(`2. Set up DNS records for www.crichattric.com pointing to your public IP`);
});

// Set up HTTPS server if SSL certificates are available
const sslPath = path.join(__dirname, '../ssl');
if (!fs.existsSync(sslPath)) {
  fs.mkdirSync(sslPath, { recursive: true });
  console.log(`Created SSL directory at ${sslPath}`);
  console.log(`Place your SSL certificates here to enable HTTPS`);
}

// Try to set up SSL
setupSSL(app);
