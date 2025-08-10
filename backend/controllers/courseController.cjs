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