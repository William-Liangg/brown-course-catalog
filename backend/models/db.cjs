const { Pool } = require('pg');

// Create pool with proper SSL configuration for production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL || 'postgres://localhost:5432/brown_course_catalog',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Optimized for serverless - shorter timeouts and smaller pool
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  max: 5, // Smaller pool for serverless functions
});

// Track connection status
let isConnected = false;
let connectionErrors = 0;

// Test the connection on startup
pool.on('connect', (client) => {
  console.log('✅ Database pool connected');
  isConnected = true;
  connectionErrors = 0;
});

pool.on('error', (err) => {
  console.error('❌ Database pool error:', {
    message: err.message,
    code: err.code,
    detail: err.detail,
    hint: err.hint
  });
  isConnected = false;
  connectionErrors++;
});

pool.on('acquire', (client) => {
  console.log('🔗 Database client acquired from pool');
});

pool.on('release', (client) => {
  console.log('🔗 Database client released to pool');
});

// Enhanced query function with better error handling
const query = async (text, params) => {
  const start = Date.now();
  const queryId = Math.random().toString(36).substr(2, 9);
  
  console.log(`📊 Query [${queryId}] starting:`, { 
    text: text.length > 100 ? text.substring(0, 100) + '...' : text,
    params: params ? params.map(p => typeof p === 'string' && p.length > 50 ? p.substring(0, 50) + '...' : p) : [],
    timestamp: new Date().toISOString()
  });
  
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    
    console.log(`✅ Query [${queryId}] successful:`, { 
      duration: `${duration}ms`,
      rowCount: res.rowCount,
      rows: res.rows.length > 0 ? res.rows.length : 0,
      sampleData: res.rows.length > 0 ? Object.keys(res.rows[0]).slice(0, 3) : []
    });
    
    return res;
  } catch (err) {
    const duration = Date.now() - start;
    console.error(`❌ Query [${queryId}] failed:`, { 
      text: text.length > 100 ? text.substring(0, 100) + '...' : text,
      params: params ? params.map(p => typeof p === 'string' && p.length > 50 ? p.substring(0, 50) + '...' : p) : [],
      duration: `${duration}ms`,
      error: {
        message: err.message,
        code: err.code,
        detail: err.detail,
        hint: err.hint,
        where: err.where,
        schema: err.schema,
        table: err.table,
        column: err.column,
        dataType: err.dataType,
        constraint: err.constraint
      }
    });
    throw err;
  }
};

// Test database connection
const testConnection = async () => {
  try {
    console.log('🔌 Testing database connection...');
    const result = await query('SELECT NOW() as current_time, version() as db_version');
    console.log('✅ Database connection test successful:', {
      currentTime: result.rows[0].current_time,
      version: result.rows[0].db_version?.split(' ')[0] || 'Unknown'
    });
    return true;
  } catch (err) {
    console.error('❌ Database connection test failed:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint
    });
    return false;
  }
};

// Get database status
const getStatus = () => {
  return {
    isConnected,
    connectionErrors,
    poolSize: pool.totalCount,
    idleCount: pool.idleCount,
    waitingCount: pool.waitingCount
  };
};

// Test specific tables
const testTables = async () => {
  const tables = ['users', 'courses', 'schedules'];
  const results = {};
  
  for (const table of tables) {
    try {
      const result = await query(`SELECT COUNT(*) as count FROM ${table}`);
      results[table] = {
        exists: true,
        count: parseInt(result.rows[0].count)
      };
      console.log(`✅ Table ${table} exists with ${result.rows[0].count} rows`);
    } catch (err) {
      results[table] = {
        exists: false,
        error: err.message
      };
      console.log(`❌ Table ${table} does not exist or is not accessible:`, err.message);
    }
  }
  
  return results;
};

module.exports = {
  query,
  testConnection,
  testTables,
  getStatus,
  pool
};
