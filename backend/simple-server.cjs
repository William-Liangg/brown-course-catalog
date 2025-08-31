const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

// Production environment detection
const isProduction = process.env.NODE_ENV === 'production';

// Load environment variables
if (isProduction) {
  // In production, environment variables are set by Render
  console.log('🚀 Production server starting...');
} else {
  // In development, load from env.local
  require('dotenv').config({ path: '../env.local' });
}

// Import database connection
const { Pool } = require('pg');

// Import AI routes
const aiRoutes = require('./routes/aiRoutes.cjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cookieParser());

// CORS middleware to allow cross-origin requests
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // allow all origins
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Add AI routes
app.use('/api/ai', aiRoutes);

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies?.authToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Get all courses
app.get('/api/courses', async (req, res) => {
  try {
    const { search } = req.query;
    console.log('🔍 Fetching courses from local database...');
    
    let query = 'SELECT * FROM courses';
    let params = [];
    
    if (search && search.trim()) {
      const searchTerm = search.trim();
      console.log(`🔍 Searching for: "${searchTerm}"`);
      
      // Check if search term is a course number (digits only)
      const isCourseNumber = /^\d+$/.test(searchTerm);
      
      // Check if search term is a major code (letters only)
      const isMajorCode = /^[A-Za-z]+$/.test(searchTerm);
      
      if (isCourseNumber) {
        // Search for course number in the code field
        query = 'SELECT * FROM courses WHERE code ILIKE $1 ORDER BY code';
        params = [`%${searchTerm}%`];
      } else if (isMajorCode) {
        // Search for major code at the beginning of course codes
        query = 'SELECT * FROM courses WHERE UPPER(code) LIKE UPPER($1) ORDER BY code';
        params = [`${searchTerm.toUpperCase()}%`];
      } else {
        // General search across multiple fields
        query = 'SELECT * FROM courses WHERE (name ILIKE $1 OR code ILIKE $1 OR description ILIKE $1 OR professor ILIKE $1) ORDER BY code';
        params = [`%${searchTerm}%`];
      }
    } else {
      query = 'SELECT * FROM courses ORDER BY code';
    }
    
    const result = await pool.query(query, params);
    console.log(`✅ Found ${result.rows.length} courses`);
    res.json({ courses: result.rows });
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get course majors
app.get('/api/courses/majors', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DISTINCT department 
      FROM courses 
      WHERE department IS NOT NULL AND department != ''
      ORDER BY department
    `);
    res.json({ majors: result.rows.map(row => row.department) });
  } catch (error) {
    console.error('❌ Error fetching majors:', error);
    res.status(500).json({ error: 'Failed to fetch majors' });
  }
});

// User registration - /api/signup (original route)
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Email, password, first name, and last name are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
      [email, hashedPassword, firstName, lastName]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // false for local development
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token: token
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// User registration - /api/auth/register (alias for frontend compatibility)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Split name into first and last name
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Check if user already exists
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING id, email, first_name, last_name',
      [email, hashedPassword, firstName, lastName]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim()
      },
      token: token
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User login - /api/login (original route)
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: false, // false for local development
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      token: token
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// User login - /api/auth/login (alias for frontend compatibility)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim()
      },
      token: token
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get current user - /api/me (original route)
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      name: `${user.first_name} ${user.last_name}`.trim()
    });
  } catch (error) {
    console.error('❌ Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Get current user - /api/auth/me (alias for frontend compatibility)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, first_name, last_name FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`.trim()
      }
    });
  } catch (error) {
    console.error('❌ Error getting user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Logout
app.post('/api/logout', (req, res) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logout successful' });
});

// Get user schedule
app.get('/api/schedule', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.id, s.term as schedule_term, c.* 
      FROM schedules s 
      JOIN courses c ON s.course_id = c.id 
      WHERE s.user_id = $1
      ORDER BY c.days, c.start_time
    `, [req.user.id]);
    
    res.json({ schedule: result.rows });
  } catch (error) {
    console.error('❌ Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Add course to schedule
app.post('/api/schedule', authenticateToken, async (req, res) => {
  try {
    const { courseId, term } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const courseResult = await pool.query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseResult.rows[0];

    // Check if already in schedule
    const existingResult = await pool.query(
      'SELECT * FROM schedules WHERE user_id = $1 AND course_id = $2 AND term = $3',
      [userId, courseId, term]
    );
    
    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Course already in schedule for this term' });
    }

    // Check for time conflicts
    const conflictsResult = await pool.query(`
      SELECT c.* FROM schedules s 
      JOIN courses c ON s.course_id = c.id 
      WHERE s.user_id = $1 AND s.term = $2 AND c.days = $3 
      AND (
        (c.start_time <= $4 AND c.end_time > $4) OR
        (c.start_time < $5 AND c.end_time >= $5) OR
        (c.start_time >= $4 AND c.end_time <= $5)
      )
    `, [userId, term, course.days, course.start_time, course.end_time]);

    if (conflictsResult.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Time conflict detected', 
        conflicts: conflictsResult.rows.map(c => ({ 
          code: c.code, 
          name: c.name, 
          days: c.days, 
          start_time: c.start_time, 
          end_time: c.end_time 
        }))
      });
    }

    // Add to schedule
    const result = await pool.query(
      'INSERT INTO schedules (user_id, course_id, term) VALUES ($1, $2, $3) RETURNING id',
      [userId, courseId, term]
    );

    res.json({ 
      message: 'Course added to schedule',
      scheduleId: result.rows[0].id 
    });
  } catch (error) {
    console.error('❌ Error adding course to schedule:', error);
    res.status(500).json({ error: 'Failed to add course to schedule' });
  }
});

// Remove course from schedule
app.delete('/api/schedule/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM schedules WHERE user_id = $1 AND course_id = $2 RETURNING id',
      [userId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found in schedule' });
    }

    res.json({ message: 'Course removed from schedule' });
  } catch (error) {
    console.error('❌ Error removing course from schedule:', error);
    res.status(500).json({ error: 'Failed to remove course from schedule' });
  }
});

// Update user names
app.post('/api/update-names', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const userId = req.user.id;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First name and last name are required' });
    }

    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING id, first_name, last_name',
      [firstName, lastName, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ 
      message: 'Names updated successfully',
      user: {
        id: result.rows[0].id,
        firstName: result.rows[0].first_name,
        lastName: result.rows[0].last_name
      }
    });
  } catch (error) {
    console.error('❌ Error updating names:', error);
    res.status(500).json({ error: 'Failed to update names' });
  }
});

// Change password
app.post('/api/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    // Get current password hash
    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentPasswordHash = userResult.rows[0].password_hash;

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentPasswordHash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [newPasswordHash, userId]);

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('❌ Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Delete account
app.delete('/api/delete-account', authenticateToken, async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;

    if (!password) {
      return res.status(400).json({ error: 'Password is required to delete account' });
    }

    // Get current password hash
    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const currentPasswordHash = userResult.rows[0].password_hash;

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, currentPasswordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Password is incorrect' });
    }

    // Delete user (schedules will be deleted automatically due to CASCADE)
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);

    // Clear the session cookie
    res.clearCookie('authToken');

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Production error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Production error:', err);
  res.status(500).json({ 
    error: isProduction ? 'Internal server error' : err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API routes available at /api/`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  if (!isProduction) {
    console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`);
  }
}); 