const bcrypt = require('bcrypt');
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
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Email, password, and name are required'
      });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        error: 'User already exists',
        details: 'A user with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (err) {
    console.error('[ERROR] /api/signup', err);
    res.status(500).json({ error: err.message });
  }
} 