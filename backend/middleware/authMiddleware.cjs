const jwt = require('jsonwebtoken');

// Helper function to get JWT secret with validation
const getJWTSecret = () => {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
  }
  return JWT_SECRET;
};

// signs JWT tokens and verifies them for user authentication
module.exports = function (req, res, next) {
  // Get token from httpOnly cookie instead of Authorization header
  const token = req.cookies.authToken;
  
  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided' });
  }
  
  try {
    const JWT_SECRET = getJWTSecret();
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
