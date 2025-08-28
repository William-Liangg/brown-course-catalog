const Cors = require('cors');
const { initMiddleware } = require('./init-middleware.js');

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
    // Clear the authentication cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

    res.status(200).json({
      message: 'Logout successful'
    });

  } catch (err) {
    console.error('[ERROR] /api/logout', err);
    res.status(500).json({ error: err.message });
  }
} 