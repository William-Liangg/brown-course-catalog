const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseMajors } = require('../controllers/courseController.cjs');
const { validationRules, handleValidationErrors, sanitizeInput } = require('../middleware/validationMiddleware.cjs');

// Apply input sanitization to all routes
router.use(sanitizeInput);

// Get all courses with optional search
router.get('/courses', validationRules.courseSearch, handleValidationErrors, getAllCourses);

// Get course majors
router.get('/courses/majors', getCourseMajors);

module.exports = router; 