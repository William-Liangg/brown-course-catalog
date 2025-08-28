const bcrypt = require('bcrypt');
const { Pool } = require('pg');
require('dotenv').config({ path: '../env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function seedDemoUser() {
  try {
    console.log('🌱 Seeding demo user...');
    
    // Check if demo user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      ['demo@local.test']
    );
    
    if (existingUser.rows.length > 0) {
      console.log('✅ Demo user already exists');
      return;
    }
    
    // Hash the password
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Insert demo user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
      ['demo@local.test', passwordHash, 'Demo', 'User']
    );
    
    console.log('✅ Demo user created successfully:', {
      id: result.rows[0].id,
      email: result.rows[0].email,
      name: `${result.rows[0].first_name} ${result.rows[0].last_name}`
    });
    
  } catch (error) {
    console.error('❌ Error seeding demo user:', error);
  } finally {
    await pool.end();
  }
}

seedDemoUser(); 