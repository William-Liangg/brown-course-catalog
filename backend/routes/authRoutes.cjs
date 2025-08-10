const express = require('express');
const router = express.Router();
const { signup, login, getMe, changePassword } = require('../controllers/authController.cjs');
const authMiddleware = require('../middleware/authMiddleware.cjs');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/change-password', authMiddleware, changePassword);

module.exports = router;
