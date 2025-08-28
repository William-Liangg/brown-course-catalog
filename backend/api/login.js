const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { query } = require('../models/db.cjs');

module.exports = async (req, res) => {
  console.log('🔑 API: /api/login - Request received', {
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
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('❌ Login validation failed: Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    console.log('🔍 Finding user by email:', { email });
    const users = await query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (users.length === 0) {
      console.log('❌ Login failed: User not found');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    console.log('🔐 Verifying password for user:', { userId: user.id });
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      console.log('❌ Login failed: Invalid password');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful:', { userId: user.id, email: user.email });
    console.log('🎫 JWT token generated for user:', { userId: user.id });

    // Set cookie
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`);

    res.status(200).json({
      message: 'Login successful',
      user: { id: user.id, email: user.email, name: user.name },
      token
    });

  } catch (error) {
    console.error('❌ Login failed:', error);
    res.status(500).json({ 
      error: 'Failed to login',
      message: 'An unexpected error occurred during login',
      code: 'INTERNAL_ERROR'
    });
  }
}; 