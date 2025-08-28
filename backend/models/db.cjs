const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL || 'postgres://localhost:5432/brown_course_catalog',
  ssl: process.env.NODE_ENV === 'production' ? { 
    rejectUnauthorized: false,
    sslmode: 'require'
  } : false,
  // Optimized for serverless - shorter timeouts and smaller pool
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  max: 5, // Smaller pool for serverless functions
  min: 0, // Allow pool to shrink to 0 connections
});

// Log database connection status
console.log('🔌 Database connection initialized:', {
  nodeEnv: process.env.NODE_ENV,
  hasDatabaseUrl: !!process.env.DATABASE_URL,
  sslEnabled: process.env.NODE_ENV === 'production',
  poolSize: { max: 5, min: 0 },
  timeouts: { connection: 5000, idle: 10000 }
});

// Test database connection on startup
pool.on('connect', (client) => {
  console.log('✅ Database client connected');
});

pool.on('error', (err, client) => {
  console.error('❌ Database pool error:', {
    error: err.message,
    code: err.code,
    timestamp: new Date().toISOString()
  });
});

// Enhanced query function with logging
async function query(text, params = []) {
  const start = Date.now();
  const queryId = Math.random().toString(36).substring(7);
  
  console.log(`📊 Query [${queryId}] starting:`, {
    text,
    params,
    timestamp: new Date().toISOString()
  });

  try {
    const client = await pool.connect();
    console.log(`🔗 Database client acquired from pool`);
    
    try {
      const result = await client.query(text, params);
      const duration = Date.now() - start;
      
      console.log(`✅ Query [${queryId}] successful:`, {
        duration: `${duration}ms`,
        rowCount: result.rowCount,
        rows: result.rows.length,
        sampleData: result.rows.length > 0 ? Object.keys(result.rows[0]) : []
      });
      
      return result;
    } finally {
      client.release();
      console.log(`🔗 Database client released to pool`);
    }
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ Query [${queryId}] failed:`, {
      duration: `${duration}ms`,
      error: error.message,
      code: error.code,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}

// Test database connection
async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    console.log('✅ Database connection test successful:', {
      currentTime: result.rows[0].current_time,
      version: result.rows[0].db_version.split(' ')[0]
    });
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    return false;
  }
}

// Get database statistics
async function getStats() {
  try {
    const stats = {
      isConnected: true,
      connectionErrors: 0,
      poolSize: pool.totalCount,
      idleCount: pool.idleCount,
      waitingCount: pool.waitingCount
    };
    
    console.log('📊 Database pool status:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Failed to get database stats:', error.message);
    return { isConnected: false, error: error.message };
  }
}

module.exports = {
  query,
  testConnection,
  getStats,
  pool
};
