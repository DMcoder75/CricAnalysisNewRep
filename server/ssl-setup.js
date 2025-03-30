/**
 * SSL Configuration for Crichattric
 * This module adds HTTPS support to the Express server
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

/**
 * Configure SSL for the Express application
 * @param {Object} app - Express application instance
 * @returns {Object} HTTPS server instance
 */
function setupSSL(app, port) {
  try {
    // Check if SSL certificates exist
    const sslPath = path.join(__dirname, '../ssl');
    const privateKeyPath = path.join(sslPath, 'privkey.pem');
    const certificatePath = path.join(sslPath, 'fullchain.pem');
    
    if (fs.existsSync(privateKeyPath) && fs.existsSync(certificatePath)) {
      // SSL certificates exist, create HTTPS server
      const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
      const certificate = fs.readFileSync(certificatePath, 'utf8');
      
      const credentials = { key: privateKey, cert: certificate };
      const httpsServer = https.createServer(credentials, app);
      
      httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
        console.log('Access your application securely at:');
        console.log('- https://www.crichattric.com');
      });
      
      return httpsServer;
    } else {
      console.log('SSL certificates not found. HTTPS server not started.');
      console.log('To enable HTTPS, place your SSL certificates in the ssl directory:');
      console.log(`- Private key: ${privateKeyPath}`);
      console.log(`- Certificate: ${certificatePath}`);
      return null;
    }
  } catch (error) {
    console.error('Error setting up SSL:', error.message);
    return null;
  }
}

module.exports = { setupSSL };
