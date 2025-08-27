const express = require('express');
const router = express.Router();
const courseRecommendationService = require('../services/courseRecommendationService');

// Get course recommendations from Brown University database
router.get('/course-recommendations', async (req, res) => {
  try {
    const { major } = req.query;
    
    console.log(`Fetching course recommendations for: ${major}`);
    
    const recommendations = await courseRecommendationService.getCourseRecommendations(major || '');
    
    res.json(recommendations);
    
  } catch (error) {
    console.error('Error in course recommendations route:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course recommendations'
    });
  }
});

module.exports = router; 