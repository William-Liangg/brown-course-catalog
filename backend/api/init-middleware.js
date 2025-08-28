const cors = require('cors');

// Helper function to initialize CORS middleware
function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      // Production frontend URL
      'https://brown-course-catalog.vercel.app',
      // Vercel deployment domains (fallback)
      'https://brown-course-catalog-5id04tszq-wills-projects-5cfc44e3.vercel.app',
      'https://brown-course-catalog-ggs2cd5o1-wills-projects-5cfc44e3.vercel.app',
      'https://brown-course-catalog-odp1z3ttw-wills-projects-5cfc44e3.vercel.app',
      'https://brown-course-catalog-86hn437hj-wills-projects-5cfc44e3.vercel.app'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS: Origin allowed: undefined');
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
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
const initCors = initMiddleware(cors(corsOptions));

module.exports = { initCors, corsOptions }; 