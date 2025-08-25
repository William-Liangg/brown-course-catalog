const db = require('../models/db.cjs');
// interacts with the database to manage courses
exports.getAllCourses = async (req, res) => {
  try {
    const { search } = req.query;
    let query = 'SELECT * FROM courses';
    let params = [];

    if (search) {
      query += ' WHERE name ILIKE $1 OR code ILIKE $1';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY code';
    const result = await db.query(query, params);
    res.json({ courses: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

// Get distinct course majors/prefixes
exports.getCourseMajors = async (req, res) => {
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
    
    const result = await db.query(query);
    const majors = result.rows.map(row => row.major);
    res.json({ majors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch course majors' });
  }
}; 