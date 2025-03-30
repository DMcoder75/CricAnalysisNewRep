/**
 * Virtual Host configuration for Crichattric
 * This module extends the Express server to handle domain-based routing
 */

const vhost = require('vhost');

/**
 * Configure virtual hosts for the Express application
 * @param {Object} app - Express application instance
 */
function setupVirtualHosts(app) {
  // No-IP dynamic DNS domains
  const noIpDomains = ['crichattric.ddns.net', 'crichattric.hopto.org', 'crichattric.no-ip.org'];
  
  // AWS EC2 domain
  const awsDomain = 'ec2-34-224-237-254.compute-1.amazonaws.com';
  
  // Create a virtual host middleware for www.crichattric.com
  app.use(vhost('www.crichattric.com', (req, res, next) => {
    // Set custom headers for the production domain
    res.setHeader('X-Powered-By', 'Crichattric');
    next();
  }));

  // Also handle the non-www version
  app.use(vhost('crichattric.com', (req, res, next) => {
    // Redirect to www version for consistency
    if (req.headers['x-forwarded-proto'] === 'https') {
      res.redirect(301, `https://www.crichattric.com${req.url}`);
    } else {
      res.redirect(301, `http://www.crichattric.com${req.url}`);
    }
  }));

  // Handle No-IP dynamic DNS domains
  noIpDomains.forEach(domain => {
    app.use(vhost(domain, (req, res, next) => {
      // Set custom headers for the dynamic DNS domains
      res.setHeader('X-Powered-By', 'Crichattric');
      next();
    }));
  });
  
  // Handle AWS EC2 domain
  app.use(vhost(awsDomain, (req, res, next) => {
    // Set custom headers for the AWS domain
    res.setHeader('X-Powered-By', 'Crichattric-AWS');
    res.setHeader('X-Deployment', 'AWS-EC2');
    next();
  }));

  console.log('Virtual hosts configured for:');
  console.log('- www.crichattric.com and crichattric.com');
  console.log(`- Dynamic DNS domains: ${noIpDomains.join(', ')}`);
  console.log(`- AWS EC2 domain: ${awsDomain}`);
}

module.exports = { setupVirtualHosts };
