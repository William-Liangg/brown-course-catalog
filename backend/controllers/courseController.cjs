const db = require('../models/db.cjs');

// Get all courses with optional search
exports.getAllCourses = async (req, res) => {
  console.log('📚 GET /api/courses - Request received', { 
    query: req.query, 
    userAgent: req.get('User-Agent'),
    origin: req.get('Origin')
  });

  try {
    const { search } = req.query;
    let query = 'SELECT * FROM courses';
    let params = [];

    if (search) {
      query += ' WHERE (name ILIKE $1 OR code ILIKE $1 OR description ILIKE $1 OR instructor ILIKE $1)';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY code';
    
    console.log('🔍 Executing courses query:', { query, params });
    
    const result = await db.query(query, params);
    
    console.log('✅ Courses query successful:', { 
      rowCount: result.rows.length,
      firstCourse: result.rows[0] ? result.rows[0].code : 'none'
    });
    
    res.json({ 
      courses: result.rows,
      count: result.rows.length,
      search: search || null
    });
    
  } catch (err) {
    console.error('❌ getAllCourses error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      stack: err.stack
    });
    
    // Handle specific database errors
    if (err.code === '42P01') {
      // Table doesn't exist
      console.error('❌ Courses table does not exist - database setup may have failed');
      return res.status(500).json({ 
        error: 'Database not properly initialized',
        message: 'Courses table not found. Please check database setup.',
        code: 'TABLE_NOT_FOUND'
      });
    }
    
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      // Connection error
      console.error('❌ Database connection failed');
      return res.status(500).json({ 
        error: 'Database connection failed',
        message: 'Unable to connect to database',
        code: 'DB_CONNECTION_ERROR'
      });
    }
    
    // Generic error response
    res.status(500).json({ 
      error: 'Failed to fetch courses',
      message: 'An unexpected error occurred while fetching courses',
      code: 'INTERNAL_ERROR'
    });
  }
};

// Get distinct course majors/prefixes
exports.getCourseMajors = async (req, res) => {
  console.log('🎓 GET /api/courses/majors - Request received');
  
  try {
    const query = `
      SELECT DISTINCT 
        CASE 
          WHEN code ~ '^[A-Z]+' THEN regexp_replace(code, '^([A-Z]+).*', '\\1')
          ELSE 'OTHER'
        END as major
      FROM courses 
      WHERE code IS NOT NULL AND code != ''
      ORDER BY major
    `;
    
    console.log('🔍 Executing majors query');
    
    const result = await db.query(query);
    const majors = result.rows.map(row => row.major);
    
    console.log('✅ Majors query successful:', { 
      majorCount: majors.length,
      majors: majors.slice(0, 5) // Log first 5 majors
    });
    
    res.json({ 
      majors,
      count: majors.length
    });
    
  } catch (err) {
    console.error('❌ getCourseMajors error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      stack: err.stack
    });
    
    // Handle specific database errors
    if (err.code === '42P01') {
      return res.status(500).json({ 
        error: 'Database not properly initialized',
        message: 'Courses table not found. Please check database setup.',
        code: 'TABLE_NOT_FOUND'
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to fetch course majors',
      message: 'An unexpected error occurred while fetching course majors',
      code: 'INTERNAL_ERROR'
    });
  }
}; 