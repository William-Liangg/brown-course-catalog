const express = require('express');
const router = express.Router();
const { getAllCourses, getCourseMajors } = require('../controllers/courseController.cjs');

router.get('/courses', getAllCourses);
router.get('/courses/majors', getCourseMajors);

module.exports = router; 