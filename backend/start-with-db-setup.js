#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Starting Brown Course Catalog with database setup...');

try {
  // Run database setup first
  console.log('🗄️  Running database setup...');
  execSync('node setup-database.js', { 
    stdio: 'inherit',
    cwd: __dirname 
  });
  console.log('✅ Database setup completed successfully');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  console.log('⚠️  Continuing with server startup anyway...');
}

// Start the server
console.log('🌐 Starting Express server...');
require('./server.cjs'); 