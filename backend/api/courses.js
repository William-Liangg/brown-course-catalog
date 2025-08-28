const { query } = require('../models/db.cjs');

module.exports = async (req, res) => {
  console.log('📚 API: /api/courses - Request received', {
    method: req.method,
    query: req.query,
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin
  });

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('🔍 Executing courses query:', { query: 'SELECT * FROM courses ORDER BY code', params: [] });
    
    const courses = await query('SELECT * FROM courses ORDER BY code');
    
    console.log('✅ Courses query successful:', { 
      rowCount: courses.length, 
      firstCourse: courses[0]?.code || 'none' 
    });

    res.status(200).json({ courses });
  } catch (error) {
    console.error('❌ Courses query failed:', error);
    res.status(500).json({ 
      error: 'Failed to fetch courses',
      message: 'An unexpected error occurred while fetching courses',
      code: 'INTERNAL_ERROR'
    });
  }
}; 