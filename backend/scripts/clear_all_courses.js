const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/brown_course_catalog',
});

async function clearAllCourses() {
  const client = await pool.connect();
  
  try {
    console.log('🗑️ Clearing all courses from database...');
    
    // First, check how many courses are currently in the database
    const countResult = await client.query('SELECT COUNT(*) FROM courses');
    const currentCount = countResult.rows[0].count;
    
    console.log(`📊 Current courses in database: ${currentCount}`);
    
    if (currentCount > 0) {
      // Delete all courses
      await client.query('DELETE FROM courses');
      console.log(`✅ Successfully deleted ${currentCount} courses from database`);
    } else {
      console.log('ℹ️ No courses to delete - database is already empty');
    }
    
    // Verify the deletion
    const verifyResult = await client.query('SELECT COUNT(*) FROM courses');
    const finalCount = verifyResult.rows[0].count;
    
    console.log(`📊 Final course count: ${finalCount}`);
    
  } catch (error) {
    console.error('❌ Error clearing courses:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

clearAllCourses(); 