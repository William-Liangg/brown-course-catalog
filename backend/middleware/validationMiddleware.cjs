const { body, param, query, validationResult } = require('express-validator');

// Validation rules
const validationRules = {
  // User registration and login
  signup: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('First name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes'),
    body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('Last name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes')
  ],

  login: [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  changePassword: [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('New password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character')
  ],

  updateNames: [
    body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('First name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes'),
    body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .matches(/^[a-zA-Z\s'-]+$/)
      .withMessage('Last name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes')
  ],

  deleteAccount: [
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],

  // Course and schedule operations
  courseSearch: [
    query('search')
      .optional()
      .trim()
      .isLength({ max: 200 })
      .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
      .withMessage('Search query must be less than 200 characters and contain only letters, numbers, spaces, and basic punctuation')
  ],

  addToSchedule: [
    body('courseId')
      .isInt({ min: 1 })
      .withMessage('Course ID must be a positive integer'),
    body('term')
      .trim()
      .isLength({ min: 1, max: 20 })
      .matches(/^[a-zA-Z0-9\s\-_]+$/)
      .withMessage('Term must be 1-20 characters and contain only letters, numbers, spaces, hyphens, and underscores')
  ],

  removeFromSchedule: [
    param('courseId')
      .isInt({ min: 1 })
      .withMessage('Course ID must be a positive integer')
  ],

  // AI recommendations
  aiRecommendation: [
    body('major')
      .trim()
      .isLength({ min: 1, max: 100 })
      .matches(/^[a-zA-Z0-9\s\-_.,()]+$/)
      .withMessage('Major must be 1-100 characters and contain only letters, numbers, spaces, and basic punctuation'),
    body('interests')
      .trim()
      .isLength({ min: 1, max: 500 })
      .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
      .withMessage('Interests must be 1-500 characters and contain only letters, numbers, spaces, and basic punctuation')
  ]
};

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
        value: err.value
      }))
    });
  }
  next();
};

// Sanitize and validate user input
const sanitizeInput = (req, res, next) => {
  // Sanitize body parameters
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  next();
};

module.exports = {
  validationRules,
  handleValidationErrors,
  sanitizeInput
}; 