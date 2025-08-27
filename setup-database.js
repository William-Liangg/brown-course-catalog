#!/usr/bin/env node

const { Client } = require('pg');
require('dotenv').config();

async function setupDatabase() {
  console.log('🔧 Setting up BrunoTrack database...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Create users table if it doesn't exist
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createUsersTable);
    console.log('✅ Users table created/verified');

    // Create schedules table if it doesn't exist
    const createSchedulesTable = `
      CREATE TABLE IF NOT EXISTS schedules (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_code VARCHAR(20) NOT NULL,
        course_name VARCHAR(255) NOT NULL,
        semester VARCHAR(20) NOT NULL,
        year INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, course_code, semester, year)
      );
    `;

    await client.query(createSchedulesTable);
    console.log('✅ Schedules table created/verified');

    // Create courses table if it doesn't exist
    const createCoursesTable = `
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        code VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        credits DECIMAL(3,1),
        department VARCHAR(100),
        semester VARCHAR(20),
        year INTEGER,
        instructor VARCHAR(255),
        location VARCHAR(255),
        time_slot VARCHAR(100),
        days VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await client.query(createCoursesTable);
    console.log('✅ Courses table created/verified');

    console.log('🎉 Database setup complete!');
    console.log('📊 Tables created: users, schedules, courses');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupDatabase(); 