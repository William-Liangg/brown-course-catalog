const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : 
       process.env.DATABASE_URL && process.env.DATABASE_URL.includes('render.com') ? { rejectUnauthorized: false } : false
});

async function debugBackend() {
  console.log('🔍 Brown Course Catalog Backend Debug Script');
  console.log('=' .repeat(50));
  
  try {
    // 1. Environment Variables Check
    console.log('\n📋 1. Environment Variables Check');
    console.log('-'.repeat(30));
    
    const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET', 'NODE_ENV'];
    const missingVars = [];
    
    requiredEnvVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`✅ ${varName}: Set`);
      } else {
        console.log(`❌ ${varName}: Missing`);
        missingVars.push(varName);
      }
    });
    
    if (missingVars.length > 0) {
      console.error(`\n❌ Missing required environment variables: ${missingVars.join(', ')}`);
      console.log('💡 Create a .env.local file with these variables');
    }
    
    // 2. Database Connection Test
    console.log('\n🔌 2. Database Connection Test');
    console.log('-'.repeat(30));
    
    try {
      const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
      console.log('✅ Database connection successful');
      console.log(`   Current time: ${result.rows[0].current_time}`);
      console.log(`   Database: ${result.rows[0].db_version?.split(' ')[0] || 'Unknown'}`);
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('💡 Check your DATABASE_URL and ensure PostgreSQL is running');
      return;
    }
    
    // 3. Table Structure Check
    console.log('\n📊 3. Table Structure Check');
    console.log('-'.repeat(30));
    
    const tables = ['users', 'courses', 'schedules'];
    const tableStatus = {};
    
    for (const table of tables) {
      try {
        const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
        const count = parseInt(result.rows[0].count);
        tableStatus[table] = { exists: true, count };
        console.log(`✅ ${table} table: ${count} rows`);
      } catch (error) {
        tableStatus[table] = { exists: false, error: error.message };
        console.log(`❌ ${table} table: ${error.message}`);
      }
    }
    
    // 4. Users Table Schema Check
    console.log('\n👥 4. Users Table Schema Check');
    console.log('-'.repeat(30));
    
    try {
      const schemaResult = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        ORDER BY ordinal_position
      `);
      
      console.log('Users table columns:');
      schemaResult.rows.forEach(col => {
        console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'}`);
      });
    } catch (error) {
      console.log(`❌ Could not check users table schema: ${error.message}`);
    }
    
    // 5. Test User Creation
    console.log('\n🔐 5. Test User Creation');
    console.log('-'.repeat(30));
    
    if (tableStatus.users?.exists) {
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'testpassword123';
      const testFirstName = 'Test';
      const testLastName = 'User';
      
      try {
        // Check if test user exists
        const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [testEmail]);
        if (existingUser.rows.length > 0) {
          console.log('⚠️  Test user already exists, skipping creation');
        } else {
          // Create test user
          const hashedPassword = await bcrypt.hash(testPassword, 10);
          const insertResult = await pool.query(
            'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
            [testEmail, hashedPassword, testFirstName, testLastName]
          );
          
          console.log('✅ Test user created successfully:');
          console.log(`   ID: ${insertResult.rows[0].id}`);
          console.log(`   Email: ${insertResult.rows[0].email}`);
          console.log(`   Name: ${insertResult.rows[0].first_name} ${insertResult.rows[0].last_name}`);
          
          // Test user login
          const loginResult = await pool.query(
            'SELECT id, email, password, first_name, last_name FROM users WHERE email = $1',
            [testEmail]
          );
          
          if (loginResult.rows.length > 0) {
            const user = loginResult.rows[0];
            const validPassword = await bcrypt.compare(testPassword, user.password);
            console.log(`✅ Password verification: ${validPassword ? 'SUCCESS' : 'FAILED'}`);
          }
          
          // Clean up test user
          await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
          console.log('🧹 Test user cleaned up');
        }
      } catch (error) {
        console.error('❌ Test user creation failed:', error.message);
      }
    } else {
      console.log('⚠️  Users table does not exist, skipping user creation test');
    }
    
    // 6. Courses Data Check
    console.log('\n📚 6. Courses Data Check');
    console.log('-'.repeat(30));
    
    if (tableStatus.courses?.exists) {
      try {
        // Get sample courses
        const sampleCourses = await pool.query('SELECT code, name, instructor FROM courses LIMIT 5');
        console.log('Sample courses:');
        sampleCourses.rows.forEach((course, index) => {
          console.log(`   ${index + 1}. ${course.code}: ${course.name}`);
          console.log(`      Instructor: ${course.instructor || 'TBD'}`);
        });
        
        // Check for courses with missing data
        const missingData = await pool.query(`
          SELECT COUNT(*) as count 
          FROM courses 
          WHERE name IS NULL OR name = '' OR code IS NULL OR code = ''
        `);
        
        if (parseInt(missingData.rows[0].count) > 0) {
          console.log(`⚠️  ${missingData.rows[0].count} courses have missing data`);
        } else {
          console.log('✅ All courses have required data');
        }
        
      } catch (error) {
        console.error('❌ Courses data check failed:', error.message);
      }
    } else {
      console.log('⚠️  Courses table does not exist');
    }
    
    // 7. Database Performance Check
    console.log('\n⚡ 7. Database Performance Check');
    console.log('-'.repeat(30));
    
    try {
      const startTime = Date.now();
      const perfResult = await pool.query('SELECT COUNT(*) FROM courses');
      const duration = Date.now() - startTime;
      
      console.log(`✅ Courses count query: ${duration}ms`);
      console.log(`   Total courses: ${perfResult.rows[0].count}`);
      
      if (duration > 1000) {
        console.log('⚠️  Query is slow, consider adding indexes');
      }
    } catch (error) {
      console.error('❌ Performance check failed:', error.message);
    }
    
    // 8. Summary
    console.log('\n📋 8. Summary');
    console.log('-'.repeat(30));
    
    const issues = [];
    
    if (missingVars.length > 0) {
      issues.push(`Missing environment variables: ${missingVars.join(', ')}`);
    }
    
    Object.entries(tableStatus).forEach(([table, status]) => {
      if (!status.exists) {
        issues.push(`${table} table missing`);
      }
    });
    
    if (issues.length === 0) {
      console.log('✅ All checks passed! Your backend should be working correctly.');
    } else {
      console.log('❌ Issues found:');
      issues.forEach(issue => console.log(`   - ${issue}`));
      console.log('\n💡 Recommendations:');
      console.log('   1. Run: npm run setup-db');
      console.log('   2. Run: npm run populate-courses');
      console.log('   3. Check your .env.local file');
    }
    
  } catch (error) {
    console.error('❌ Debug script failed:', error.message);
  } finally {
    await pool.end();
  }
}

debugBackend(); 