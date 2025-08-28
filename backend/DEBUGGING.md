# Brown Course Catalog Backend - Debugging Guide

This guide will help you debug and fix issues with your Brown Course Catalog backend.

## 🔍 Quick Debugging Commands

### 1. Run Comprehensive Backend Debug
```bash
npm run debug
```
This will check:
- Environment variables
- Database connection
- Table structure
- User creation/authentication
- Course data integrity
- Database performance

### 2. Test API Endpoints
```bash
npm run test-api
```
This will test:
- Health check endpoint
- User signup/login
- Course retrieval
- Search functionality
- Authentication flow

### 3. Database Setup
```bash
npm run setup-db
```
Creates all necessary tables and indexes.

### 4. Populate Courses
```bash
npm run populate-courses
```
Loads course data from the SQL file.

## 🚨 Common Issues and Solutions

### Issue 1: "Users cannot sign up or sign in"

**Symptoms:**
- Signup/login requests fail
- No users in database
- Authentication errors

**Debugging Steps:**
1. Run `npm run debug` to check database connection and table structure
2. Check if users table exists and has correct schema
3. Verify environment variables (JWT_SECRET, DATABASE_URL)
4. Test user creation manually

**Common Causes:**
- Missing JWT_SECRET environment variable
- Users table doesn't exist
- Database connection issues
- Incorrect table schema

**Solutions:**
```bash
# 1. Check environment variables
echo $JWT_SECRET
echo $DATABASE_URL

# 2. Setup database if needed
npm run setup-db

# 3. Test user creation
npm run debug
```

### Issue 2: "Courses table remains empty"

**Symptoms:**
- No courses returned from API
- Empty courses table
- Population script runs but no data

**Debugging Steps:**
1. Run `npm run debug` to check table status
2. Verify SQL file exists and is readable
3. Check population script logs
4. Test manual course insertion

**Common Causes:**
- SQL file not found or corrupted
- Database permissions issues
- Population script errors
- Table schema mismatch

**Solutions:**
```bash
# 1. Check if SQL file exists
ls -la sql/brown_university_courses.sql

# 2. Run population script with verbose logging
npm run populate-courses

# 3. Check table contents manually
psql $DATABASE_URL -c "SELECT COUNT(*) FROM courses;"
```

### Issue 3: "Database connection fails"

**Symptoms:**
- Connection refused errors
- Timeout errors
- Authentication failures

**Debugging Steps:**
1. Check DATABASE_URL format
2. Verify PostgreSQL is running
3. Test connection manually
4. Check SSL settings

**Common Causes:**
- PostgreSQL not running
- Incorrect DATABASE_URL
- Network connectivity issues
- SSL configuration problems

**Solutions:**
```bash
# 1. Check PostgreSQL status
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql     # Linux

# 2. Test connection manually
psql $DATABASE_URL -c "SELECT NOW();"

# 3. Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://username:password@host:port/database
```

### Issue 4: "API endpoints return 500 errors"

**Symptoms:**
- Internal server errors
- Database query failures
- Unhandled exceptions

**Debugging Steps:**
1. Check server logs for detailed error messages
2. Run `npm run debug` to verify database health
3. Test individual endpoints
4. Check for missing environment variables

**Common Causes:**
- Missing environment variables
- Database connection issues
- Table schema problems
- JWT token issues

**Solutions:**
```bash
# 1. Check all environment variables
npm run debug

# 2. Restart server with verbose logging
npm start

# 3. Test specific endpoint
curl http://localhost:3001/api/courses
```

## 📊 Enhanced Logging

The backend now includes comprehensive logging for:

### Authentication Routes
- Signup requests with validation
- Login attempts and password verification
- JWT token generation
- Cookie setting/clearing

### Database Operations
- Query execution with timing
- Parameter logging (sanitized)
- Error details with PostgreSQL error codes
- Connection pool status

### API Endpoints
- Request details (method, URL, user agent)
- Response status and timing
- CORS handling
- Rate limiting

## 🔧 Manual Testing

### Test User Creation
```bash
# Using curl
curl -X POST http://localhost:3001/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test Course Retrieval
```bash
# Get all courses
curl http://localhost:3001/api/courses

# Search courses
curl "http://localhost:3001/api/courses?search=computer"
```

### Test Authentication
```bash
# Login
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt

# Get profile (using saved cookie)
curl http://localhost:3001/api/me -b cookies.txt
```

## 🛠️ Environment Variables

Required environment variables:

```bash
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
JWT_SECRET=your-secret-key-here

# Environment
NODE_ENV=development

# Optional: API base URL for testing
API_BASE_URL=http://localhost:3001
```

## 📝 Log Analysis

### Understanding Log Messages

**Database Logs:**
- `📊 Query [id] starting:` - Query execution started
- `✅ Query [id] successful:` - Query completed successfully
- `❌ Query [id] failed:` - Query failed with error details

**Authentication Logs:**
- `🔐 POST /api/signup - Request received` - Signup attempt
- `✅ User inserted successfully` - User created
- `❌ Signup error:` - Signup failed with details

**API Logs:**
- `📚 GET /api/courses - Request received` - Course request
- `✅ Courses query successful` - Courses retrieved
- `❌ getAllCourses error:` - Course retrieval failed

### Common Error Codes

**PostgreSQL Error Codes:**
- `42P01` - Table doesn't exist
- `23505` - Unique constraint violation
- `28P01` - Authentication failed
- `ECONNREFUSED` - Connection refused
- `ENOTFOUND` - Host not found

## 🚀 Production Debugging

For production environments:

1. **Check Render logs** (if deployed on Render)
2. **Verify environment variables** in production dashboard
3. **Test database connectivity** from production environment
4. **Monitor rate limiting** and CORS issues

## 📞 Getting Help

If you're still experiencing issues:

1. Run `npm run debug` and share the output
2. Check server logs for error messages
3. Verify environment variables are set correctly
4. Test database connection manually
5. Ensure all tables exist and have correct schema

The enhanced logging will help identify exactly where the issue occurs in the request/response cycle. 