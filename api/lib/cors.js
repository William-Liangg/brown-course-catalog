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

// CORS configuration for Vercel deployment
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      // Production frontend URL
      'https://brown-course-catalog.vercel.app',
      // Local development URLs
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      // Vercel preview URLs (fallback)
      'https://brown-course-catalog-*.vercel.app'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS: Origin allowed: undefined');
      return callback(null, true);
    }
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        // Handle wildcard patterns
        const pattern = allowedOrigin.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowedOrigin === origin;
    });
    
    if (isAllowed) {
      console.log('✅ CORS: Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin not allowed:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

// Initialize CORS middleware
const cors = initMiddleware(Cors(corsOptions));

module.exports = { cors, corsOptions }; 