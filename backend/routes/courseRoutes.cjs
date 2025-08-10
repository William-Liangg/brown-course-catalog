const express = require('express');
const router = express.Router();
const { getAllCourses } = require('../controllers/courseController.cjs');

router.get('/courses', getAllCourses);

module.exports = router; 