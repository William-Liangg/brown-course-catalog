// hashes passwords, generates JWT tokens, and interacts with the database for user authentication.
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db.cjs');

// store API keys

const JWT_SECRET = process.env.JWT_SECRET || 'securesecuresecurekey';

exports.signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
  }
  try {
    // Check if user exists
    const userExists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) return res.status(409).json({ error: 'User already exists' });
    // Hash password
    const hash = await bcrypt.hash(password, 10);
    // Insert user
    const result = await db.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name', 
      [email, hash, firstName, lastName]
    );
    const user = result.rows[0];
    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user: { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// error handling for login and getMe functions

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  try {
    const result = await db.query('SELECT id, email, password, first_name, last_name FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      user: { 
        id: user.id, 
        email: user.email, 
        firstName: user.first_name, 
        lastName: user.last_name 
      }, 
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await db.query('SELECT id, email, first_name, last_name FROM users WHERE id = $1', [req.user.id]);
    if (user.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const userData = user.rows[0];
    res.json({ 
      user: { 
        id: userData.id, 
        email: userData.email, 
        firstName: userData.first_name, 
        lastName: userData.last_name 
      } 
    });
  } catch (err) {
    console.error(err);
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
