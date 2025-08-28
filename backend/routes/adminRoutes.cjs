const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const db = require('../models/db.cjs');

// Admin route to populate courses (for development/production setup)
router.post('/populate-courses', async (req, res) => {
  try {
    console.log('🔄 Starting course population via API...');
    
    // Check if courses table exists
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'courses'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      return res.status(500).json({ error: 'Courses table does not exist' });
    }
    
    // Check current course count
    const countResult = await db.query('SELECT COUNT(*) FROM courses');
    const currentCount = parseInt(countResult.rows[0].count);
    console.log(`📊 Current courses in database: ${currentCount}`);
    
    if (currentCount > 0) {
      console.log('⚠️  Database already has courses. Clearing existing data...');
      await db.query('DELETE FROM courses');
      console.log('✅ Cleared existing courses');
    }
    
    // Read the SQL file
    const sqlFilePath = path.join(__dirname, '..', 'sql', 'brown_university_courses.sql');
    console.log(`📖 Reading SQL file: ${sqlFilePath}`);
    
    if (!fs.existsSync(sqlFilePath)) {
      return res.status(500).json({ error: 'SQL file not found' });
    }
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    console.log('✅ SQL file read successfully');
    
    // Execute the SQL
    console.log('🔄 Executing SQL to populate courses...');
    await db.query(sqlContent);
    
    // Verify the population
    const verifyResult = await db.query('SELECT COUNT(*) FROM courses');
    const finalCount = parseInt(verifyResult.rows[0].count);
    
    console.log(`🎉 Successfully populated ${finalCount} courses!`);
    
    res.json({ 
      success: true, 
      message: `Successfully populated ${finalCount} courses`,
      count: finalCount
    });
    
  } catch (error) {
    console.error('❌ Course population failed:', error);
    res.status(500).json({ 
      error: 'Course population failed',
      message: error.message
    });
  }
});

module.exports = router; 