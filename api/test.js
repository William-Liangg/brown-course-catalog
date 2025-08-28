const { cors } = require('./lib/cors');
const { testConnection } = require('./lib/db');

module.exports = async function handler(req, res) {
  // Log request details
  console.log('🧪 API: /api/test - Request received', {
    method: req.method,
    url: req.url,
    headers: {
      'user-agent': req.headers['user-agent'],
      'origin': req.headers.origin,
      'content-type': req.headers['content-type']
    },
    timestamp: new Date().toISOString()
  });

  // Run CORS
  await cors(req, res);

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    res.status(200).end();
    return;
  }

  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    const response = {
      message: 'Test API is working!',
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      environment: process.env.NODE_ENV,
      database: {
        connected: dbConnected,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      cors: {
        origin: req.headers.origin,
        allowed: true
      }
    };

    console.log('✅ Test API response:', response);

    res.status(200).json(response);
  } catch (error) {
    console.error('❌ Test API failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      error: 'Test API failed',
      details: error.message 
    });
  }
}; 