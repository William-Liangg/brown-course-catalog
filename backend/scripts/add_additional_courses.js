const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/brown_course_catalog',
});

async function addAdditionalCourses() {
  try {
    console.log('Adding additional Brown University courses...');
    
    // Read the additional courses SQL file
    const sqlPath = path.join(__dirname, '../sql/additional_courses.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Additional courses SQL file loaded successfully');
    
    // Execute the SQL
    const client = await pool.connect();
    try {
      console.log('Executing additional courses SQL commands...');
      await client.query(sqlContent);
      console.log('✅ Additional courses added successfully!');
      console.log('📚 Added 30+ additional Brown University courses');
      console.log('🏫 Expanded course offerings across all departments');
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error adding additional courses:', error);
  } finally {
    await pool.end();
  }
}

// Run the update
addAdditionalCourses(); 