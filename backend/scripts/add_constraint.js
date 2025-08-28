const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost:5432/brown_course_catalog',
});

async function addConstraint() {
  try {
    console.log('Adding unique constraint to courses table...');
    
    const client = await pool.connect();
    try {
      await client.query('ALTER TABLE courses ADD CONSTRAINT courses_code_unique UNIQUE (code);');
      console.log('✅ Unique constraint added successfully!');
    } catch (error) {
      if (error.code === '42710') {
        console.log('✅ Constraint already exists');
      } else {
        throw error;
      }
    } finally {
      client.release();
    }
    
  } catch (error) {
    console.error('❌ Error adding constraint:', error);
  } finally {
    await pool.end();
  }
}

addConstraint(); 