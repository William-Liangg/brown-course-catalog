const jwt = require('jsonwebtoken');
const { cors } = require('./lib/cors');
const { query } = require('./lib/db');

module.exports = async function handler(req, res) {
  // Log request details
  console.log('👤 API: /api/me - Request received', {
    method: req.method,
    url: req.url,
    cookies: req.cookies,
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

  // Only allow GET requests
  if (req.method !== 'GET') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      details: 'Only GET requests are allowed for /api/me'
    });
  }

  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      console.log('❌ No token found in cookies');
      return res.status(401).json({ 
        error: 'Authentication required',
        details: 'No authentication token found'
      });
    }

    console.log('🔍 Verifying JWT token');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ Token verified for user:', { userId: decoded.userId });

    // Get user data
    const result = await query('SELECT id, email, name FROM users WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      console.log('❌ User not found:', { userId: decoded.userId });
      return res.status(404).json({ 
        error: 'User not found',
        details: 'User account no longer exists'
      });
    }

    const user = result.rows[0];

    console.log('✅ User data retrieved:', { userId: user.id, email: user.email });

    // Log response details
    console.log('📤 Sending user data response:', {
      status: 200,
      userId: user.id,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('❌ /api/me failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        details: 'Authentication token is invalid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        details: 'Authentication token has expired'
      });
    }

    res.status(500).json({ 
      error: 'Failed to get user data',
      details: error.message 
    });
  }
}; 