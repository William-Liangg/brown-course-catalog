const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : 
       process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false
});

async function populateCourses() {
  try {
    console.log('🚀 Starting course population...');
    console.log('📡 Environment:', process.env.NODE_ENV || 'development');
    
    // Test connection
    console.log('🔌 Testing database connection...');
    await pool.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Check if courses table exists
    console.log('📊 Checking courses table...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'courses'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.error('❌ Courses table does not exist! Run database setup first.');
      process.exit(1);
    }
    
    console.log('✅ Courses table exists');
    
    // Check current course count
    const countResult = await pool.query('SELECT COUNT(*) FROM courses');
    const currentCount = parseInt(countResult.rows[0].count);
    console.log(`📊 Current courses in database: ${currentCount}`);
    
    if (currentCount > 0) {
      console.log('⚠️  Database already has courses. Clearing existing data...');
      await pool.query('DELETE FROM courses');
      console.log('✅ Cleared existing courses');
    }
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'sql', 'brown_university_courses.sql');
    console.log(`📖 Reading SQL file: ${sqlFilePath}`);
    
    if (!fs.existsSync(sqlFilePath)) {
      console.error('❌ SQL file not found!');
      process.exit(1);
    }
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ SQL file read successfully');
    
    // Execute the SQL
    console.log('🔄 Executing SQL to populate courses...');
    await pool.query(sqlContent);
    
    // Verify the population
    const verifyResult = await pool.query('SELECT COUNT(*) FROM courses');
    const finalCount = parseInt(verifyResult.rows[0].count);
    
    console.log(`🎉 Successfully populated ${finalCount} courses!`);
    
    // Show some sample courses
    const sampleResult = await pool.query('SELECT code, name FROM courses LIMIT 5');
    console.log('📚 Sample courses:');
    sampleResult.rows.forEach(course => {
      console.log(`  - ${course.code}: ${course.name}`);
    });
    
  } catch (error) {
    console.error('❌ Course population failed:', {
      message: error.message,
      code: error.code,
      detail: error.detail,
      hint: error.hint
    });
    process.exit(1);
  } finally {
    await pool.end();
  }
}

populateCourses(); 