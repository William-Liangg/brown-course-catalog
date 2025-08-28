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
  if (!value || value === 'NULL' || value === '') return null;
  
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

// Helper function to extract department from course code
function extractDepartment(code) {
  if (!code) return null;
  const match = code.match(/^([A-Z]+)/);
  return match ? match[1] : null;
}

async function populateCourses() {
  console.log('🚀 Starting course population...');
  
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to database');

    // Clear existing courses
    await pool.query('DELETE FROM courses');
    console.log('✅ Cleared existing courses');

    // Read the Brown University courses SQL file
    const sqlFilePath = path.join(__dirname, 'backend', 'sql', 'brown_university_courses.sql');
    
    if (!fs.existsSync(sqlFilePath)) {
      console.log('❌ Brown University courses SQL file not found at:', sqlFilePath);
      return;
    }

    console.log('📚 Reading Brown University courses from SQL file...');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Extract the INSERT statement
    const insertMatch = sqlContent.match(/INSERT INTO courses \(([^)]+)\) VALUES\s*([\s\S]+)/);
    
    if (!insertMatch) {
      console.log('❌ Could not parse INSERT statement from SQL file');
      return;
    }

    const columns = insertMatch[1].split(',').map(col => col.trim());
    const valuesSection = insertMatch[2];
    
    console.log('📋 Found columns:', columns);
    
    // Parse the values section
    const valueRows = valuesSection
      .split('),')
      .map(row => row.trim())
      .filter(row => row.length > 0)
      .map(row => {
        // Remove the opening and closing parentheses
        row = row.replace(/^\(/, '').replace(/\);?$/, '');
        
        // Split by comma, but be careful with commas inside quotes
        const values = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = null;
        
        for (let i = 0; i < row.length; i++) {
          const char = row[i];
          
          if ((char === "'" || char === '"') && !inQuotes) {
            inQuotes = true;
            quoteChar = char;
            current += char;
          } else if (char === quoteChar && inQuotes) {
            inQuotes = false;
            quoteChar = null;
            current += char;
          } else if (char === ',' && !inQuotes) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        
        if (current.trim()) {
          values.push(current.trim());
        }
        
        return values;
      });

    console.log(`📝 Found ${valueRows.length} course records to process`);
    
    // Insert each course with proper mapping
    let courseCount = 0;
    let errorCount = 0;
    
    for (const valueRow of valueRows) {
      try {
        // Map values to our schema
        const code = cleanSqlValue(valueRow[columns.indexOf('code')]);
        const name = cleanSqlValue(valueRow[columns.indexOf('name')]);
        const description = cleanSqlValue(valueRow[columns.indexOf('description')]);
        const days = cleanSqlValue(valueRow[columns.indexOf('days')]);
        const startTime = cleanSqlValue(valueRow[columns.indexOf('start_time')]);
        const endTime = cleanSqlValue(valueRow[columns.indexOf('end_time')]);
        const location = cleanSqlValue(valueRow[columns.indexOf('location')]);
        const professor = cleanSqlValue(valueRow[columns.indexOf('professor')]);
        
        // Skip if essential fields are missing
        if (!code || !name) {
          continue;
        }
        
        // Extract department from course code
        const department = extractDepartment(code);
        
        // Insert the course
        await pool.query(`
          INSERT INTO courses (code, name, description, department, professor, days, start_time, end_time, location)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [code, name, description, department, professor, days, startTime, endTime, location]);
        
        courseCount++;
        
        if (courseCount % 100 === 0) {
          console.log(`📚 Inserted ${courseCount} courses...`);
        }
      } catch (error) {
        errorCount++;
        if (errorCount <= 10) { // Only show first 10 errors to avoid spam
          console.log(`⚠️  Error inserting course: ${error.message}`);
        }
      }
    }
    
    console.log(`✅ Successfully loaded ${courseCount} courses from Brown University database`);
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} courses had errors and were skipped`);
    }

    // Get final course count
    const courseCountResult = await pool.query('SELECT COUNT(*) as count FROM courses');
    const totalCourses = courseCountResult.rows[0].count;

    console.log('🎉 Course population complete!');
    console.log(`📚 Total courses in database: ${totalCourses}`);
    
    // Show some sample courses with professors
    const sampleCourses = await pool.query(`
      SELECT code, name, professor, department 
      FROM courses 
      WHERE professor IS NOT NULL 
      ORDER BY code 
      LIMIT 5
    `);
    
    console.log('\n📋 Sample courses with professors:');
    sampleCourses.rows.forEach(course => {
      console.log(`  ${course.code}: ${course.name} - ${course.professor} (${course.department})`);
    });
    
  } catch (error) {
    console.error('❌ Course population failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the population
populateCourses(); 