const express = require('express');
const router = express.Router();
const { query } = require('../models/db.cjs');
const authMiddleware = require('../middleware/authMiddleware.cjs');

// Apply authentication middleware to all schedule routes
router.use(authMiddleware);

// Get current user's schedule
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await query(`
      SELECT s.id, s.term, c.* 
      FROM schedules s 
      JOIN courses c ON s.course_id = c.id 
      WHERE s.user_id = $1
      ORDER BY c.days, c.start_time
    `, [userId]);
    
    res.json({ schedule: result.rows });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ error: 'Failed to fetch schedule' });
  }
});

// Add course to schedule
router.post('/', async (req, res) => {
  try {
    const { courseId, term } = req.body;
    const userId = req.user.id;

    // Check if course exists
    const courseResult = await query('SELECT * FROM courses WHERE id = $1', [courseId]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const course = courseResult.rows[0];

    // Check if already in schedule for this user
    const existingResult = await query(
      'SELECT * FROM schedules WHERE user_id = $1 AND course_id = $2 AND term = $3',
      [userId, courseId, term]
    );
    
    if (existingResult.rows.length > 0) {
      return res.status(400).json({ error: 'Course already in schedule for this term' });
    }

    // Check for time conflicts for this user
    const conflictsResult = await query(`
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
        conflicts: conflictsResult.rows.map(c => ({ code: c.code, name: c.name, days: c.days, start_time: c.start_time, end_time: c.end_time }))
      });
    }

    // Add to schedule for this user
    const result = await query(
      'INSERT INTO schedules (user_id, course_id, term) VALUES ($1, $2, $3) RETURNING id',
      [userId, courseId, term]
    );

    res.json({ 
      message: 'Course added to schedule',
      scheduleId: result.rows[0].id 
    });
  } catch (error) {
    console.error('Error adding course to schedule:', error);
    res.status(500).json({ error: 'Failed to add course to schedule' });
  }
});

// Remove course from schedule
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await query(
      'DELETE FROM schedules WHERE user_id = $1 AND course_id = $2 RETURNING id',
      [userId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Course not found in schedule' });
    }

    res.json({ message: 'Course removed from schedule' });
  } catch (error) {
    console.error('Error removing course from schedule:', error);
    res.status(500).json({ error: 'Failed to remove course from schedule' });
  }
});

module.exports = router; 