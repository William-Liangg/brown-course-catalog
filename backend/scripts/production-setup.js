const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Production environment detection
const isProduction = process.env.NODE_ENV === 'production';

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting production database setup...');
    
    // Create tables
    console.log('📋 Creating tables...');
    
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');
    
    // Courses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        days TEXT,
        start_time TIME,
        end_time TIME,
        location TEXT,
        professor TEXT,
        department TEXT
      );
    `);
    console.log('✅ Courses table created');
    
    // Schedules table
    await client.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        term VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        UNIQUE(user_id, course_id, term)
      );
    `);
    console.log('✅ Schedules table created');
    
    // Check if courses table is empty
    const courseCount = await client.query('SELECT COUNT(*) FROM courses');
    
    if (courseCount.rows[0].count === '0') {
      console.log('📚 Loading course data...');
      
      // Read and execute the course data SQL file
      const courseDataPath = path.join(__dirname, '../sql/brown_university_courses.sql');
      const courseData = fs.readFileSync(courseDataPath, 'utf8');
      
      // Split the SQL file into individual statements
      const statements = courseData
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
      
      // Execute each statement
      for (const statement of statements) {
        if (statement.trim()) {
          await client.query(statement);
        }
      }
      
      console.log('✅ Course data loaded successfully');
    } else {
      console.log('ℹ️  Courses table already contains data, skipping...');
    }
    
    // Create demo user
    console.log('👤 Creating demo user...');
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['demo@local.test', hashedPassword, 'Demo', 'User']);
    
    console.log('✅ Demo user created (demo@local.test / password123)');
    
    // Verify setup
    const finalCourseCount = await client.query('SELECT COUNT(*) FROM courses');
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    
    console.log('\n🎉 Database setup complete!');
    console.log(`📊 Courses: ${finalCourseCount.rows[0].count}`);
    console.log(`👥 Users: ${userCount.rows[0].count}`);
    console.log('🔗 Your backend is ready to serve!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Production setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Production setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase }; 