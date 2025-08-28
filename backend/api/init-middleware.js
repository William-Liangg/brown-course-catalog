const Cors = require('cors');

// Helper to wrap middleware for async/await usage
function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) return reject(result);
        return resolve(result);
      });
    });
}

// Initialize CORS middleware
const cors = initMiddleware(
  Cors({
    origin: 'https://brown-course-catalog.vercel.app', // your frontend URL
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);

module.exports = { initMiddleware, cors }; 