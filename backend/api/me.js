const jwt = require('jsonwebtoken');
const { query } = require('../models/db.cjs');

module.exports = async (req, res) => {
  console.log('👤 API: /api/me - Request received', {
    method: req.method,
    headers: req.headers,
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from Authorization header or cookie
    let token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      const cookies = req.headers.cookie?.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      token = cookies?.token;
    }

    if (!token) {
      console.log('❌ GetMe failed: No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    console.log('🔍 Verifying JWT token');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for user:', { userId: decoded.userId, email: decoded.email });

    // Get user data
    console.log('📝 Fetching user data');
    const users = await query('SELECT id, email, name FROM users WHERE id = $1', [decoded.userId]);
    
    if (users.length === 0) {
      console.log('❌ GetMe failed: User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    const user = users[0];
    console.log('✅ User data retrieved:', { userId: user.id, email: user.email });

    res.status(200).json({
      user: { id: user.id, email: user.email, name: user.name }
    });

  } catch (error) {
    console.error('❌ GetMe failed:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    res.status(500).json({ 
      error: 'Failed to get user data',
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR'
    });
  }
}; 