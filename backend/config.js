require('dotenv').config({ path: '.env.local' });

const config = {
  // Server configuration
  server: {
    port: process.env.PORT || 3001,
    trustProxy: 1, // For rate limiting behind load balancers
  },
  
  // Database configuration
  database: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  },
  
  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? "https://brown-course-catalog-frontend.onrender.com"
      : ["http://localhost:3000", "http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:3000", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
    maxAge: 86400 // 24 hours
  },
  
  // Rate limiting configuration
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
      error: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // Authentication rate limiting
  authRateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: {
      error: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  },
  
  // Cookie configuration
  cookies: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/'
  },
  
  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o-mini',
    embeddingModel: 'text-embedding-3-small'
  },
  
  // Environment
  env: process.env.NODE_ENV || 'development',
  
  // Validation
  validate() {
    const required = [
      'DATABASE_URL',
      'JWT_SECRET', 
      'OPENAI_API_KEY'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    return true;
  }
};

module.exports = config; 