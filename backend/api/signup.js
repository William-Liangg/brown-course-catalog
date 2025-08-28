const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../models/db.cjs');

module.exports = async (req, res) => {
  console.log('🔐 API: /api/signup - Request received', {
    method: req.method,
    body: req.body,
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      console.log('❌ Signup validation failed: Missing required fields');
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Check if user already exists
    console.log('🔍 Checking if user exists:', { email });
    const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (existingUser.length > 0) {
      console.log('❌ Signup failed: User already exists');
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    console.log('🔐 Hashing password');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log('📝 Creating new user');
    const result = await query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );

    const user = result[0];
    console.log('✅ User created successfully:', { userId: user.id, email: user.email });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('🎫 JWT token generated for user:', { userId: user.id });

    // Set cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`);

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user.id, email: user.email, name: user.name },
      token
    });

  } catch (error) {
    console.error('❌ Signup failed:', error);
    res.status(500).json({ 
      error: 'Failed to create user',
      message: 'An unexpected error occurred during signup',
      code: 'INTERNAL_ERROR'
    });
  }
}; 