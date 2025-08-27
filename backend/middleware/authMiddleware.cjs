const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
// signs JWT tokens and verifies them for user authentication

module.exports = function (req, res, next) {
  // Check for token in Authorization header first
  let token = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.split(' ')[1]) {
    token = authHeader.split(' ')[1];
  }
  
  // If no token in header, check for httpOnly cookie
  if (!token && req.cookies && req.cookies.authToken) {
    token = req.cookies.authToken;
  }
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
