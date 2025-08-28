#!/usr/bin/env node

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

console.log('🚀 Brown Course Catalog - Deployment Script');
console.log('==========================================\n');

// Configuration
const config = {
  database: {
    tables: {
      users: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
      courses: `
        CREATE TABLE IF NOT EXISTS courses (
          id SERIAL PRIMARY KEY,
          code VARCHAR(20) NOT NULL,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          credits INTEGER,
          department VARCHAR(100),
          level VARCHAR(20),
          term VARCHAR(20),
          days VARCHAR(50),
          start_time TIME,
          end_time TIME,
          location VARCHAR(100),
          instructor VARCHAR(255),
          capacity INTEGER,
          enrolled INTEGER DEFAULT 0,
          embedding VECTOR(1536),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `,
      schedules: `
        CREATE TABLE IF NOT EXISTS schedules (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
          term VARCHAR(20) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(user_id, course_id, term)
        )
      `
    },
    indexes: [
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code)',
      'CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_schedules_course_id ON schedules(course_id)'
    ]
  },
  server: {
    port: process.env.PORT || 3001,
    corsOrigins: [
      'https://bruno-track.onrender.com',
      'https://brown-course-catalog-frontend.onrender.com',
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173'
    ]
  }
};

// Database connection
let pool;

async function connectDatabase() {
  try {
    console.log('📡 Connecting to database...');
    
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function setupDatabase() {
  try {
    console.log('\n🗄️  Setting up database tables...');
    
    // Create tables
    for (const [tableName, createSQL] of Object.entries(config.database.tables)) {
      console.log(`Creating ${tableName} table...`);
      await pool.query(createSQL);
      console.log(`✅ ${tableName} table created`);
    }
    
    // Create indexes
    console.log('\n📊 Creating database indexes...');
    for (const indexSQL of config.database.indexes) {
      await pool.query(indexSQL);
    }
    console.log('✅ Database indexes created');
    
    return true;
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    return false;
  }
}

async function validateEnvironment() {
  console.log('\n🔧 Validating environment configuration...');
  
  const requiredVars = [
    'DATABASE_URL',
    'JWT_SECRET',
    'OPENAI_API_KEY'
  ];
  
  const missing = [];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.log('\n💡 Please set these environment variables:');
    missing.forEach(varName => {
      console.log(`   ${varName}=your_value_here`);
    });
    return false;
  }
  
  console.log('✅ Environment variables validated');
  return true;
}

async function testServer() {
  try {
    console.log('\n🧪 Testing server configuration...');
    
    // Test server startup
    const server = require('./server.cjs');
    console.log('✅ Server configuration valid');
    
    return true;
  } catch (error) {
    console.error('❌ Server test failed:', error.message);
    return false;
  }
}

async function generateConfig() {
  console.log('\n⚙️  Generating configuration files...');
  
  // Generate .env.example
  const envExample = `# Database Configuration
DATABASE_URL=postgres://username:password@host:port/database

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Environment
NODE_ENV=production
PORT=3001

# CORS Origins (comma-separated)
CORS_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
`;
  
  fs.writeFileSync(path.join(__dirname, '.env.example'), envExample);
  console.log('✅ Generated .env.example');
  
  // Generate deployment checklist
  const checklist = `# Deployment Checklist

## ✅ Environment Variables
- [ ] DATABASE_URL set
- [ ] JWT_SECRET set
- [ ] OPENAI_API_KEY set
- [ ] NODE_ENV=production

## ✅ Database
- [ ] PostgreSQL database created
- [ ] Tables created (users, courses, schedules)
- [ ] Indexes created
- [ ] Connection tested

## ✅ Backend Service
- [ ] Root Directory: backend
- [ ] Build Command: npm install && npm run setup-db
- [ ] Start Command: npm start
- [ ] Environment: Node

## ✅ Frontend Service
- [ ] Root Directory: frontend
- [ ] Build Command: npm install && npm run build
- [ ] Publish Directory: build
- [ ] Environment Variable: VITE_API_URL=https://your-backend-url.onrender.com

## ✅ Testing
- [ ] Backend health check: /health
- [ ] API endpoints working
- [ ] Frontend connecting to backend
- [ ] Authentication working
- [ ] AI features working
`;
  
  fs.writeFileSync(path.join(__dirname, 'DEPLOYMENT_CHECKLIST.md'), checklist);
  console.log('✅ Generated DEPLOYMENT_CHECKLIST.md');
}

async function main() {
  console.log('Starting deployment process...\n');
  
  // Step 1: Validate environment
  if (!await validateEnvironment()) {
    process.exit(1);
  }
  
  // Step 2: Connect to database
  if (!await connectDatabase()) {
    process.exit(1);
  }
  
  // Step 3: Setup database
  if (!await setupDatabase()) {
    process.exit(1);
  }
  
  // Step 4: Test server
  if (!await testServer()) {
    process.exit(1);
  }
  
  // Step 5: Generate configuration files
  await generateConfig();
  
  console.log('\n🎉 Deployment setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Start the server: npm start');
  console.log('2. Test endpoints: curl http://localhost:3001/health');
  console.log('3. Deploy to Render using the generated configuration');
  
  // Close database connection
  if (pool) {
    await pool.end();
  }
}

// Run the deployment script
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
}

module.exports = { config, connectDatabase, setupDatabase, validateEnvironment }; 