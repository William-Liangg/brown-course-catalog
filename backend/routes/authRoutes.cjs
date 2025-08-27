const express = require('express');
const router = express.Router();
const { signup, login, logout, getMe, changePassword, updateNames, deleteAccount } = require('../controllers/authController.cjs');
const authMiddleware = require('../middleware/authMiddleware.cjs');

// Basic validation middleware
const validateSignup = (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long' });
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }
  
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  next();
};

// Public routes with basic validation
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/logout', logout);

// Protected routes
router.get('/me', authMiddleware, getMe);
router.post('/change-password', authMiddleware, changePassword);
router.post('/update-names', authMiddleware, updateNames);
router.delete('/delete-account', authMiddleware, deleteAccount);

module.exports = router;
