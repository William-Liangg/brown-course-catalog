// hashes passwords, generates JWT tokens, and interacts with the database for user authentication.
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db.cjs');

// Helper function to get JWT secret with validation
const getJWTSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error('❌ JWT_SECRET environment variable is missing');
    throw new Error('JWT_SECRET environment variable is required');
  }
  return JWT_SECRET;
};

// Helper function to set httpOnly cookie
const setAuthCookie = (res, token) => {
  res.cookie('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  });
};

// Helper function to clear auth cookie
const clearAuthCookie = (res) => {
  res.clearCookie('authToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  });
};

exports.signup = async (req, res) => {
  console.log('🔐 POST /api/signup - Request received', {
    body: { ...req.body, password: '[REDACTED]' },
    userAgent: req.get('User-Agent'),
    origin: req.get('Origin'),
    ip: req.ip
  });

  const { email, password, firstName, lastName } = req.body;
  
  // Validation logging
  if (!email || !password || !firstName || !lastName) {
    console.log('❌ Signup validation failed:', { 
      hasEmail: !!email, 
      hasPassword: !!password, 
      hasFirstName: !!firstName, 
      hasLastName: !!lastName 
    });
    return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
  }

  try {
    console.log('🔍 Checking if user exists:', { email });
    
    // Check if user exists
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    console.log('📊 User exists query result:', { 
      rowCount: userExists.rows.length,
      exists: userExists.rows.length > 0 
    });
    
    if (userExists.rows.length > 0) {
      console.log('❌ User already exists:', { email });
      return res.status(409).json({ error: 'User already exists' });
    }

    console.log('🔐 Hashing password...');
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed successfully');

    console.log('💾 Inserting new user into database...');
    // Insert user
    const result = await db.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name', 
      [email, hash, firstName, lastName]
    );
    
    console.log('✅ User inserted successfully:', { 
      userId: result.rows[0].id,
      email: result.rows[0].email,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name
    });

    const user = result.rows[0];
    
    console.log('🎫 Generating JWT token...');
    // Generate token
    const JWT_SECRET = getJWTSecret();
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ JWT token generated');
    
    // Set httpOnly cookie instead of returning token in response
    setAuthCookie(res, token);
    console.log('🍪 Auth cookie set');
    
    console.log('🎉 Signup successful:', { userId: user.id, email: user.email });
    
    res.status(201).json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.first_name, 
        lastName: user.last_name 
      },
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error('❌ Signup error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      stack: err.stack,
      email,
      firstName,
      lastName
    });
    
    // Handle specific database errors
    if (err.code === '23505') {
      console.error('❌ Duplicate email constraint violation');
      return res.status(409).json({ error: 'User already exists' });
    }
    
    if (err.code === '42P01') {
      console.error('❌ Users table does not exist - database setup may have failed');
      return res.status(500).json({ 
        error: 'Database not properly initialized',
        message: 'Users table not found. Please check database setup.'
      });
    }
    
    res.status(500).json({ error: 'Registration failed' });
  }
};

// error handling for login and getMe functions

exports.login = async (req, res) => {
  console.log('🔐 POST /api/login - Request received', {
    body: { ...req.body, password: '[REDACTED]' },
    userAgent: req.get('User-Agent'),
    origin: req.get('Origin'),
    ip: req.ip
  });

  const { email, password } = req.body;
  
  if (!email || !password) {
    console.log('❌ Login validation failed:', { hasEmail: !!email, hasPassword: !!password });
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    console.log('🔍 Fetching user from database:', { email });
    
    const result = await db.query('SELECT id, email, password, first_name, last_name FROM users WHERE email = $1', [email]);
    console.log('📊 User query result:', { 
      rowCount: result.rows.length,
      found: result.rows.length > 0 
    });
    
    if (result.rows.length === 0) {
      console.log('❌ User not found:', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    console.log('✅ User found:', { userId: user.id, email: user.email });
    
    console.log('🔐 Comparing password...');
    const valid = await bcrypt.compare(password, user.password);
    console.log('📊 Password comparison result:', { valid });
    
    if (!valid) {
      console.log('❌ Invalid password for user:', { email });
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    console.log('🎫 Generating JWT token...');
    const JWT_SECRET = getJWTSecret();
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ JWT token generated');
    
    // Set httpOnly cookie instead of returning token in response
    setAuthCookie(res, token);
    console.log('🍪 Auth cookie set');
    
    console.log('🎉 Login successful:', { userId: user.id, email: user.email });
    
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.first_name, 
        lastName: user.last_name 
      },
      message: 'Login successful'
    });
  } catch (err) {
    console.error('❌ Login error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      stack: err.stack,
      email
    });
    
    // Handle specific database errors
    if (err.code === '42P01') {
      console.error('❌ Users table does not exist - database setup may have failed');
      return res.status(500).json({ 
        error: 'Database not properly initialized',
        message: 'Users table not found. Please check database setup.'
      });
    }
    
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.logout = async (req, res) => {
  console.log('🔐 POST /api/logout - Request received', {
    userAgent: req.get('User-Agent'),
    origin: req.get('Origin'),
    ip: req.ip
  });

  try {
    clearAuthCookie(res);
    console.log('🍪 Auth cookie cleared');
    console.log('✅ Logout successful');
    
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('❌ Logout error:', {
      message: err.message,
      stack: err.stack
    });
    res.status(500).json({ error: 'Logout failed' });
  }
};

exports.getMe = async (req, res) => {
  console.log('🔐 GET /api/me - Request received', {
    userId: req.user?.id,
    userAgent: req.get('User-Agent'),
    origin: req.get('Origin'),
    ip: req.ip
  });

  try {
    console.log('🔍 Fetching user data:', { userId: req.user.id });
    
    const user = await db.query('SELECT id, email, first_name, last_name FROM users WHERE id = $1', [req.user.id]);
    console.log('📊 User query result:', { 
      rowCount: user.rows.length,
      found: user.rows.length > 0 
    });
    
    if (user.rows.length === 0) {
      console.log('❌ User not found in database:', { userId: req.user.id });
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = user.rows[0];
    console.log('✅ User data retrieved:', { 
      userId: userData.id,
      email: userData.email 
    });
    
    res.json({ 
      user: { 
        id: userData.id, 
        email: userData.email, 
        firstName: userData.first_name, 
        lastName: userData.last_name 
      } 
    });
  } catch (err) {
    console.error('❌ getMe error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      stack: err.stack,
      userId: req.user?.id
    });
    
    // Handle specific database errors
    if (err.code === '42P01') {
      console.error('❌ Users table does not exist - database setup may have failed');
      return res.status(500).json({ 
        error: 'Database not properly initialized',
        message: 'Users table not found. Please check database setup.'
      });
    }
    
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.updateNames = async (req, res) => {
  const { firstName, lastName } = req.body;
  const userId = req.user.id;

  if (!firstName || !lastName) {
    return res.status(400).json({ error: 'First name and last name are required' });
  }

  try {
    const result = await db.query(
      'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING id, email, first_name, last_name',
      [firstName, lastName, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = result.rows[0];
    res.json({ 
      message: 'Names updated successfully',
      user: { 
        id: userData.id, 
        email: userData.email, 
        firstName: userData.first_name, 
        lastName: userData.last_name 
      } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update names' });
  }
};

exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long' });
  }

  try {
    // Get current user with password
    const userResult = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Verify current password
    const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidCurrentPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password in database
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [newPasswordHash, userId]);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

exports.deleteAccount = async (req, res) => {
  const { password } = req.body;
  const userId = req.user.id;

  if (!password) {
    return res.status(400).json({ error: 'Password is required to delete account' });
  }

  try {
    // Get current user with password
    const userResult = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Password is incorrect' });
    }

    // Delete user's schedule entries first (due to foreign key constraint)
    await db.query('DELETE FROM schedules WHERE user_id = $1', [userId]);

    // Delete the user account
    await db.query('DELETE FROM users WHERE id = $1', [userId]);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete account' });
  }
};
