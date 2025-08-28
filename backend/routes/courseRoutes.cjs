const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseMajors } = require('../controllers/courseController.cjs');

// Get all courses with optional search
router.get('/courses', getAllCourses);

// Get course majors
router.get('/courses/majors', getCourseMajors);

module.exports = router; 