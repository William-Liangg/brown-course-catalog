const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../models/db.cjs');

module.exports = async (req, res) => {
  console.log('📝 API: /api/signup - Request received', {
    method: req.method,
    body: req.body,
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: 'Email, password, and name are required'
      });
    }

    console.log('🔍 Checking if user already exists:', { email });

    // Check if user already exists
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      console.log('❌ User already exists:', { email });
      return res.status(400).json({ 
        error: 'User already exists',
        details: 'A user with this email already exists'
      });
    }

    console.log('🔐 Hashing password for new user:', { email });

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    console.log('💾 Inserting new user into database:', { email, name });

    // Insert new user
    const result = await query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    const user = result.rows[0];

    console.log('✅ User created successfully:', { userId: user.id, email: user.email });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('🎫 JWT token generated for user:', { userId: user.id });

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

  } catch (error) {
    console.error('❌ Signup failed:', error);
    res.status(500).json({ 
      error: 'Failed to create user',
      details: error.message 
    });
  }
}; 