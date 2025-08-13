const express = require('express');
const router = express.Router();
const { query } = require('../models/db.cjs');

// AI-powered course recommendations
router.post('/recommend', async (req, res) => {
  try {
    const { interests } = req.body;
    
    if (!interests) {
      return res.status(400).json({ error: 'Interests are required' });
    }

    // Get all courses from database
    const coursesResult = await query('SELECT * FROM courses ORDER BY code');
    const allCourses = coursesResult.rows;

    // Simple keyword-based recommendation system
    const interestKeywords = interests.toLowerCase().split(' ');
    const recommendations = allCourses
      .filter(course => 
        interestKeywords.some(keyword => 
          course.name.toLowerCase().includes(keyword) || 
          course.description.toLowerCase().includes(keyword) ||
          course.code.toLowerCase().includes(keyword)
        )
      )
      .slice(0, 3)
      .map(course => ({
        courseCode: course.code,
        courseName: course.name,
        explanation: `This course matches your interests in ${interests}.`,
        confidence: 8
      }));

    // If no keyword matches, return some general courses
    if (recommendations.length === 0) {
      const generalRecommendations = allCourses.slice(0, 3).map(course => ({
        courseCode: course.code,
        courseName: course.name,
        explanation: `Here's a great course that might interest you!`,
        confidence: 6
      }));
      
      return res.json({ recommendations: generalRecommendations });
    }

    res.json({ recommendations });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Failed to generate course recommendations' });
  }
});

module.exports = router; 