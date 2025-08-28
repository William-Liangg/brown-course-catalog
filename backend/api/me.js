const jwt = require('jsonwebtoken');
const Cors = require('cors');
const { initMiddleware } = require('./init-middleware.js');
const pool = require('../models/db.js');

// Initialize CORS middleware
const cors = initMiddleware(
  Cors({
    origin: 'https://brown-course-catalog.vercel.app', // your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

module.exports = async function handler(req, res) {
  // Run CORS
  await cors(req, res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Get token from cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required',
        details: 'No authentication token found'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user data
    const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [decoded.userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'User not found',
        details: 'User account no longer exists'
      });
    }

    const user = result.rows[0];

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.error('[ERROR] /api/me', err);
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        details: 'Authentication token is invalid'
      });
    }
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        details: 'Authentication token has expired'
      });
    }

    res.status(500).json({ error: err.message });
  }
} 