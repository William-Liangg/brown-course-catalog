const express = require('express');
const router = express.Router();
const { signup, login, logout, getMe, changePassword, updateNames, deleteAccount } = require('../controllers/authController.cjs');
const authMiddleware = require('../middleware/authMiddleware.cjs');
const { validationRules, handleValidationErrors, sanitizeInput } = require('../middleware/validationMiddleware.cjs');

// Apply input sanitization to all routes
router.use(sanitizeInput);

// Public routes with validation
router.post('/signup', validationRules.signup, handleValidationErrors, signup);
router.post('/login', validationRules.login, handleValidationErrors, login);
router.post('/logout', logout);

// Protected routes with validation
router.get('/me', authMiddleware, getMe);
router.post('/change-password', authMiddleware, validationRules.changePassword, handleValidationErrors, changePassword);
router.post('/update-names', authMiddleware, validationRules.updateNames, handleValidationErrors, updateNames);
router.delete('/delete-account', authMiddleware, validationRules.deleteAccount, handleValidationErrors, deleteAccount);

module.exports = router;
