const Cors = require('cors');
const initMiddleware = require('./init-middleware.js');
const pool = require('../models/db.js');

// Initialize CORS middleware
const cors = initMiddleware(
  Cors({
    origin: 'https://brown-course-catalog.vercel.app', // your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

module.exports = async function handler(req, res) {
  // Run CORS
  await cors(req, res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    console.log(`[API] ${req.method} /api/courses`);
    const result = await pool.query('SELECT * FROM courses ORDER BY code');
    console.log(`[DB] Retrieved ${result.rowCount} courses`);
    res.status(200).json({ courses: result.rows });
  } catch (err) {
    console.error('[ERROR] /api/courses', err);
    res.status(500).json({ error: err.message });
  }
} 