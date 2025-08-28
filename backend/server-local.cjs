const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      console.log('✅ CORS: Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('❌ CORS: Origin blocked:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Import Vercel functions
const coursesHandler = require('./api/courses');
const signupHandler = require('./api/signup');
const loginHandler = require('./api/login');
const meHandler = require('./api/me');
const logoutHandler = require('./api/logout');

// Route handlers that wrap Vercel functions
app.get('/api/courses', async (req, res) => {
  await coursesHandler(req, res);
});

app.post('/api/signup', async (req, res) => {
  await signupHandler(req, res);
});

app.post('/api/login', async (req, res) => {
  await loginHandler(req, res);
});

app.get('/api/me', async (req, res) => {
  await meHandler(req, res);
});

app.post('/api/logout', async (req, res) => {
  await logoutHandler(req, res);
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local development server running on port ${PORT}`);
  console.log(`📚 API routes available at /api/`);
  console.log(`🔒 Security features enabled: Helmet, CORS, Rate Limiting, Cookie Parser`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app; 