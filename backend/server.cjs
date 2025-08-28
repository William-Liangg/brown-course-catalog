const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const path = require('path');
const config = require('./config.js');

// Import routes
const authRoutes = require('./routes/authRoutes.cjs');
const courseRoutes = require('./routes/courseRoutes.cjs');
const scheduleRoutes = require('./routes/scheduleRoutes.cjs');
const aiRoutes = require('./routes/aiRoutes');
const courseRecommendationRoutes = require('./routes/courseRecommendationRoutes');

// Validate configuration
try {
  config.validate();
} catch (error) {
  console.error('❌ Configuration error:', error.message);
  process.exit(1);
}

// Initialize Express app
const app = express();

// Trust proxy for rate limiting behind load balancers (Render)
app.set('trust proxy', config.server.trustProxy);

// HTTPS Enforcement for Production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

// Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
app.use(cors(config.cors));

// Rate Limiting
const limiter = rateLimit(config.rateLimit);
app.use(limiter);

// Stricter rate limiting for authentication routes
const authLimiter = rateLimit(config.authRateLimit);

// Parse cookies for JWT tokens
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply stricter rate limiting to auth routes
app.use('/api/signup', authLimiter);
app.use('/api/login', authLimiter);

// Routes
app.use('/api', authRoutes);
app.use('/api', courseRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/recommendations', courseRecommendationRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'API running' });
});

// Test route to verify schedule routes are loaded
app.get('/test-schedule', (req, res) => {
  res.json({ message: 'Schedule routes should be available at /api/schedule' });
});

// Direct test route for schedule
app.get('/api/schedule-test', (req, res) => {
  res.json({ message: 'Direct schedule test route works' });
});

// API-only server - no static file serving needed
app.get('/', (req, res) => {
  res.json({ 
    message: 'Brown Course Catalog API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/signup, /api/login, /api/logout, /api/me',
      courses: '/api/courses, /api/courses/majors',
      schedule: '/api/schedule/*',
      ai: '/api/ai/ai-recommend',
      recommendations: '/api/recommendations/*'
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Global error handler:', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    userAgent: req.get('User-Agent')
  });
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR'
  });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  console.log('❌ 404 - Route not found:', req.originalUrl);
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    code: 'NOT_FOUND'
  });
});

const PORT = config.server.port;

// Test database connection on startup
const testDatabaseConnection = async () => {
  try {
    const db = require('./models/db.cjs');
    const isConnected = await db.testConnection();
    if (isConnected) {
      console.log('✅ Database connection successful');
      
      // Test if courses table exists
      try {
        const result = await db.query('SELECT COUNT(*) FROM courses');
        console.log(`📊 Courses table exists with ${result.rows[0].count} courses`);
      } catch (tableError) {
        if (tableError.code === '42P01') {
          console.warn('⚠️  Courses table does not exist - database setup may be needed');
        } else {
          console.error('❌ Error checking courses table:', tableError.message);
        }
      }
    } else {
      console.error('❌ Database connection test failed');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.log('💡 Make sure to run: npm run setup-db');
  }
};

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('📚 Schedule routes available at /api/schedule');
  console.log('🔒 Security features enabled: Helmet, CORS, Rate Limiting, Cookie Parser');
  console.log(`🌍 Environment: ${config.env}`);
  
  // Test database connection
  await testDatabaseConnection();
});
