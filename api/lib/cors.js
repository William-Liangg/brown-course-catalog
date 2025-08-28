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
      // Production backend URL
      'https://brown-course-catalog-5id04tszq-wills-projects-5cfc44e3.vercel.app/api/courses',
      // Local development URLs
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS: Origin allowed: undefined');
      return callback(null, true);
    }
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowedOrigin => {
      return allowedOrigin === origin;
    });
    
    // Special handling for Vercel deployment URLs
    if (!isAllowed) {
      // Allow any Vercel deployment URL for the frontend
      if (origin.includes('brown-course-catalog') && origin.includes('vercel.app')) {
        console.log('✅ CORS: Vercel deployment origin allowed:', origin);
        return callback(null, true);
      }
      
      // Allow any Vercel preview deployment URLs
      if (origin.includes('vercel.app') && origin.includes('wills-projects')) {
        console.log('✅ CORS: Vercel preview origin allowed:', origin);
        return callback(null, true);
      }
    }
    
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