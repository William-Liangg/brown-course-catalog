const { query } = require('../models/db.cjs');

module.exports = async (req, res) => {
  console.log('📚 API: /api/courses - Request received', {
    method: req.method,
    query: req.query,
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin
  });

  // Set CORS headers - handle credentials mode properly
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174');
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('🔍 Executing courses query:', { query: 'SELECT * FROM courses ORDER BY code', params: [] });
    
    const result = await query('SELECT * FROM courses ORDER BY code');
    
    console.log('✅ Courses query successful:', { 
      rowCount: result.rows.length, 
      firstCourse: result.rows[0]?.code || 'none' 
    });

    // Return just the rows array, not the full PostgreSQL result object
    res.status(200).json({ courses: result.rows });
  } catch (error) {
    console.error('❌ Courses query failed:', error);
    res.status(500).json({ 
      error: 'Failed to fetch courses',
      message: 'An unexpected error occurred while fetching courses',
      code: 'INTERNAL_ERROR'
    });
  }
}; 