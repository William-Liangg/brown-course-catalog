require('dotenv').config({ path: './env.local' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false // No SSL for local development
});

// Helper function to clean SQL values
function cleanSqlValue(value) {
  if (!value || value === 'NULL') return null;
  
  // Remove surrounding quotes
  let cleaned = value.trim();
  if ((cleaned.startsWith("'") && cleaned.endsWith("'")) || 
      (cleaned.startsWith('"') && cleaned.endsWith('"'))) {
    cleaned = cleaned.slice(1, -1);
  }
  
  // Unescape single quotes
  cleaned = cleaned.replace(/''/g, "'");
  
  return cleaned;
}

async function setupLocalDatabase() {
  console.log('🔧 Setting up local database...');
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to local database');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created/verified');

    // Create courses table with professor information
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) NOT NULL,
        name VARCHAR(500) NOT NULL,
        description TEXT,
        credits INTEGER,
        department VARCHAR(100),
        professor VARCHAR(500),
        days VARCHAR(100),
        start_time TIME,
        end_time TIME,
        location VARCHAR(500),
        term VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Courses table created/verified');

    // Create schedules table
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
    console.log('✅ Schedules table created/verified');

    // Clear existing courses
    await pool.query('DELETE FROM courses');
    console.log('✅ Cleared existing courses');

    // Read and execute the Brown University courses SQL file
    const sqlFilePath = path.join(__dirname, 'backend', 'sql', 'brown_university_courses.sql');
    
    if (fs.existsSync(sqlFilePath)) {
      console.log('📚 Loading Brown University courses from SQL file...');
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      
      // Execute the SQL file directly
      try {
        await pool.query(sqlContent);
        console.log('✅ Successfully loaded courses from Brown University database');
      } catch (error) {
        console.log(`❌ Error executing SQL file: ${error.message}`);
      }
    } else {
      console.log('⚠️  Brown University courses SQL file not found, using sample data...');
      
      // Fallback to sample courses if SQL file not found
      const sampleCourses = [
        {
          code: 'CSCI 0150',
          name: 'Introduction to Object-Oriented Programming and Computer Science',
          description: 'An introduction to computer science and programming using Java.',
          credits: 1,
          department: 'Computer Science',
          professor: 'Dr. John Smith',
          days: 'MWF',
          start_time: '10:00:00',
          end_time: '11:20:00',
          location: 'CIT 165',
          term: 'Fall 2024'
        },
        {
          code: 'CSCI 0320',
          name: 'Introduction to Software Engineering',
          description: 'Software development methodologies and tools.',
          credits: 1,
          department: 'Computer Science',
          professor: 'Dr. Sarah Johnson',
          days: 'TR',
          start_time: '14:30:00',
          end_time: '15:50:00',
          location: 'CIT 227',
          term: 'Fall 2024'
        }
      ];

      for (const course of sampleCourses) {
        await pool.query(`
          INSERT INTO courses (code, name, description, credits, department, professor, days, start_time, end_time, location, term)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `, [
          course.code, course.name, course.description, course.credits, 
          course.department, course.professor, course.days, course.start_time, 
          course.end_time, course.location, course.term
        ]);
      }
      
      console.log(`✅ Inserted ${sampleCourses.length} sample courses`);
    }

    // Create a test user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await pool.query(`
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO NOTHING
    `, ['test@brown.edu', hashedPassword, 'Test', 'User']);
    
    console.log('✅ Created test user: test@brown.edu / password123');

    // Get final course count
    const courseCountResult = await pool.query('SELECT COUNT(*) as count FROM courses');
    const totalCourses = courseCountResult.rows[0].count;

    console.log('🎉 Local database setup complete!');
    console.log('📊 Tables created: users, courses, schedules');
    console.log(`📚 Total courses loaded: ${totalCourses}`);
    console.log('👤 Test user: test@brown.edu (password: password123)');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupLocalDatabase(); 