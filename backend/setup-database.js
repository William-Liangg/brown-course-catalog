const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : 
       process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  try {
    console.log('🔧 Database setup starting...');
    console.log('📡 Environment:', process.env.NODE_ENV || 'development');
    console.log('🔗 Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    
    // Test connection
    console.log('🔌 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Create users table
    console.log('Creating users table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');
    
    // Create courses table
    console.log('Creating courses table...');
    await pool.query(`
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Courses table created');
    
    // Create schedules table
    console.log('Creating schedules table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        term VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id, term)
      )
    `);
    console.log('✅ Schedules table created');
    
    // Create indexes for better performance
    console.log('Creating indexes...');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_courses_code ON courses(code)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_schedules_course_id ON schedules(course_id)');
    console.log('✅ Indexes created');
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint,
      stack: error.stack
    });
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔌 Connection refused - check if database is running and accessible');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🌐 Database host not found - check DATABASE_URL');
    } else if (error.code === '28P01') {
      console.error('🔑 Authentication failed - check database credentials');
    } else if (error.code === '3D000') {
      console.error('🗄️ Database does not exist - create the database first');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase(); 