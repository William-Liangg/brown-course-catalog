const jwt = require('jsonwebtoken');
const { query } = require('../models/db.cjs');

module.exports = async (req, res) => {
  console.log('👤 API: /api/me - Request received', {
    method: req.method,
    cookies: req.cookies,
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin
  });

  // Set CORS headers - handle credentials mode properly
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    // Vercel deployment domains
    'https://brown-course-catalog-5id04tszq-wills-projects-5cfc44e3.vercel.app',
    'https://brown-course-catalog-ggs2cd5o1-wills-projects-5cfc44e3.vercel.app',
    'https://brown-course-catalog-odp1z3ttw-wills-projects-5cfc44e3.vercel.app'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Default to the main Vercel domain
    res.setHeader('Access-Control-Allow-Origin', 'https://brown-course-catalog-5id04tszq-wills-projects-5cfc44e3.vercel.app');
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('❌ /api/me failed:', error);
    
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