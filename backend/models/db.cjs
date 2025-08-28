const { Pool } = require('pg');

// Create pool with proper SSL configuration for production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL || 'postgres://localhost:5432/brown_course_catalog',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Add connection timeout and retry settings
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20, // Maximum number of clients in the pool
});

// Test the connection on startup
pool.on('connect', () => {
  console.log('✅ Database pool connected');
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', err);
});

// Enhanced query function with better error handling
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    const duration = Date.now() - start;
    console.error('❌ Query error:', { text, duration, error: err.message });
    throw err;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Database connection test successful:', result.rows[0]);
    return true;
  } catch (err) {
    console.error('❌ Database connection test failed:', err.message);
    return false;
  }
};

module.exports = {
  query,
  testConnection,
  pool
};
