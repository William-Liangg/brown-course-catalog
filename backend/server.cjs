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

const PORT = config.server.port;

// Test database connection on startup
const testDatabaseConnection = async () => {
  try {
    const db = require('./models/db.cjs');
    await db.query('SELECT NOW()');
    console.log('✅ Database connection successful');
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
