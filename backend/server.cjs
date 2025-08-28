// Load environment variables
require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env' : '.env.local' });

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
const adminRoutes = require('./routes/adminRoutes.cjs');

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

// CORS Configuration - Simple and direct
app.use((req, res, next) => {
  const allowedOrigins = process.env.NODE_ENV === 'production' 
    ? ['https://brown-course-catalog-frontend.onrender.com']
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174'];
  
  const origin = req.headers.origin;
  console.log('🌐 CORS Request:', { origin, method: req.method, url: req.url, allowedOrigins });
  
  // Set CORS headers
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // Handle origin - be more permissive in development
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    console.log('✅ CORS: Origin allowed:', origin);
  } else if (!origin) {
    // No origin header (direct API call), allow it
    console.log('🌐 CORS: No origin header (direct API call)');
  } else if (process.env.NODE_ENV !== 'production') {
    // In development, allow any origin for easier testing
    res.header('Access-Control-Allow-Origin', origin);
    console.log('🔧 CORS: Development mode - allowing origin:', origin);
  } else {
    console.log('❌ CORS: Origin not allowed:', origin);
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    console.log('🔄 CORS: Handling OPTIONS preflight');
    res.sendStatus(200);
  } else {
    next();
  }
});

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
app.use('/api/admin', adminRoutes);

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
      
      // Test all tables
      console.log('📊 Testing database tables...');
      const tableStatus = await db.testTables();
      
      // Log table status
      Object.entries(tableStatus).forEach(([table, status]) => {
        if (status.exists) {
          console.log(`✅ ${table} table: ${status.count} rows`);
        } else {
          console.warn(`⚠️  ${table} table: ${status.error}`);
        }
      });
      
      // Check for critical issues
      const missingTables = Object.entries(tableStatus)
        .filter(([table, status]) => !status.exists)
        .map(([table]) => table);
      
      if (missingTables.length > 0) {
        console.error('❌ Critical: Missing tables:', missingTables);
        console.log('💡 Run database setup: npm run setup-db');
      }
      
      // Log database status
      const dbStatus = db.getStatus();
      console.log('📊 Database pool status:', dbStatus);
      
    } else {
      console.error('❌ Database connection test failed');
      console.log('💡 Check your DATABASE_URL and ensure the database is running');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
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
