const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
// signs JWT tokens and verifies them for user authentication

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization']; // get token from Authorization header
  const token = authHeader && authHeader.split(' ')[1]; // extract token from "Bearer <token>" format
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // proceed to the next middleware or route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
