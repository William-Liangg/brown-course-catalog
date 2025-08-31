const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Production environment detection
const isProduction = process.env.NODE_ENV === 'production';

// Load environment variables
if (isProduction) {
  console.log('🗄️ Production database setup starting...');
} else {
  require('dotenv').config({ path: '../env.local' });
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

async function setupProductionDatabase() {
  try {
    console.log('🗄️ Setting up production database...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Create courses table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) NOT NULL,
        name VARCHAR(500) NOT NULL,
        description TEXT,
        professor VARCHAR(200),
        days VARCHAR(50),
        start_time TIME,
        end_time TIME,
        location VARCHAR(200),
        credits INTEGER,
        department VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Courses table created');

    // Create schedules table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        schedule_term VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_id, schedule_term)
      );
    `);
    console.log('✅ Schedules table created');
    
    // Check if courses exist
    const courseCount = await pool.query('SELECT COUNT(*) FROM courses');
    console.log(`📊 Current course count: ${courseCount.rows[0].count}`);
    
    if (courseCount.rows[0].count === '0') {
      console.log('🌱 Seeding courses from SQL file...');
      
      // Try to load courses from SQL file
      const sqlFilePath = path.join(__dirname, '../sql/brown_university_courses.sql');
      
      if (fs.existsSync(sqlFilePath)) {
        const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
        
        // Split SQL into individual statements
        const statements = sqlContent
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`📝 Found ${statements.length} SQL statements to execute`);
        
        for (let i = 0; i < statements.length; i++) {
          try {
            await pool.query(statements[i]);
            if (i % 100 === 0) {
              console.log(`✅ Processed ${i + 1}/${statements.length} statements`);
            }
          } catch (error) {
            console.error(`❌ Error executing statement ${i + 1}:`, error.message);
          }
        }
        
        // Verify courses were loaded
        const finalCount = await pool.query('SELECT COUNT(*) FROM courses');
        console.log(`✅ Final course count: ${finalCount.rows[0].count}`);
      } else {
        console.log('⚠️ SQL file not found, skipping course seeding');
      }
    } else {
      console.log('✅ Courses already exist in database');
    }
    
    // Create demo user if it doesn't exist
    const demoUserCheck = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['demo@local.test']
    );
    
    if (demoUserCheck.rows.length === 0) {
      console.log('👤 Creating demo user...');
      const bcrypt = require('bcrypt');
      const passwordHash = await bcrypt.hash('password123', 10);
      
      await pool.query(
        'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4)',
        ['demo@local.test', passwordHash, 'Demo', 'User']
      );
      console.log('✅ Demo user created: demo@local.test / password123');
    } else {
      console.log('✅ Demo user already exists');
    }
    
    console.log('🎉 Production database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

setupProductionDatabase(); 