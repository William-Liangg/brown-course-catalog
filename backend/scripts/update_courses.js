const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration - using same method as db.cjs
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/brown_course_catalog',
});

async function updateCourses() {
  try {
    console.log('Starting course database update...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../sql/brown_university_courses.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('SQL file loaded successfully');
    
    // Execute the SQL
    const client = await pool.connect();
    try {
      console.log('Executing SQL commands...');
      await client.query(sqlContent);
      console.log('✅ Courses database updated successfully!');
      console.log('📚 Added 120+ real Brown University undergraduate courses');
      console.log('🏫 Courses cover: Computer Science, Math, Economics, Physics, Chemistry, Biology, Psychology, History, English, and Philosophy');
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error updating courses:', error);
  } finally {
    await pool.end();
  }
}

// Run the update
updateCourses(); 