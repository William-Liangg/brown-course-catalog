const express = require('express');
const router = express.Router();
const { signup, login, getMe, changePassword, updateNames, deleteAccount } = require('../controllers/authController.cjs');
const authMiddleware = require('../middleware/authMiddleware.cjs');

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/change-password', authMiddleware, changePassword);
router.post('/update-names', authMiddleware, updateNames);
router.delete('/delete-account', authMiddleware, deleteAccount);

module.exports = router;
