const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { cors } = require('./lib/cors');
const { query } = require('./lib/db');

module.exports = async function handler(req, res) {
  // Log request details
  console.log('📝 API: /api/signup - Request received', {
    method: req.method,
    url: req.url,
    body: req.body,
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      details: 'Only POST requests are allowed for /api/signup'
    });
  }

  try {
    const { email, password, name } = req.body;

    // Validate required fields
    if (!email || !password || !name) {
      console.log('❌ Missing required fields:', { 
        hasEmail: !!email, 
        hasPassword: !!password, 
        hasName: !!name 
      });
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

    // Log response details
    console.log('📤 Sending signup response:', {
      status: 201,
      userId: user.id,
      timestamp: new Date().toISOString()
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
    console.error('❌ Signup failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      error: 'Failed to create user',
      details: error.message 
    });
  }
}; 