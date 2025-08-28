const { query } = require('../models/db.cjs');
const { initCors } = require('./init-middleware.js');

module.exports = async (req, res) => {
  // Initialize CORS
  await initCors(req, res);

  // Log request details
  console.log('📚 API: /api/courses - Request received', {
    method: req.method,
    url: req.url,
    query: req.query,
    headers: {
      'user-agent': req.headers['user-agent'],
      'origin': req.headers.origin,
      'content-type': req.headers['content-type']
    },
    timestamp: new Date().toISOString()
  });

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log('✅ CORS preflight request handled');
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      details: 'Only GET requests are allowed for /api/courses'
    });
  }

  try {
    console.log('🔍 Executing courses query:', { 
      query: 'SELECT * FROM courses ORDER BY code', 
      params: [],
      timestamp: new Date().toISOString()
    });
    
    const result = await query('SELECT * FROM courses ORDER BY code');
    
    console.log('✅ Courses query successful:', {
      rowCount: result.rows.length,
      firstCourse: result.rows[0]?.code || 'none',
      duration: 'completed',
      timestamp: new Date().toISOString()
    });
    
    // Log response details
    console.log('📤 Sending response:', {
      status: 200,
      rowCount: result.rows.length,
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json({ courses: result.rows });
  } catch (error) {
    console.error('❌ Courses query failed:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      error: 'Failed to fetch courses',
      details: error.message 
    });
  }
}; 