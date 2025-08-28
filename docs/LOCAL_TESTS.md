# Local Testing Guide

This document provides comprehensive testing procedures to verify the local setup is working correctly.

## 🚀 Quick Start Test

### 1. Start the Application
```bash
# Start both backend and frontend
npm run dev
```

### 2. Verify Services are Running
```bash
# Check if backend is running
curl http://localhost:3001/health

# Check if frontend is accessible
curl http://localhost:5173/ | head -c 100
```

## 🧪 API Endpoint Tests

### Authentication Tests

#### Register New User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@local.test",
    "password": "password123",
    "name": "Demo User"
  }'
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 2,
    "email": "demo@local.test",
    "name": "Demo User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login with Test User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@brown.edu",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "test@brown.edu",
    "name": "Test User"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Get Current User (Protected Route)
```bash
# First, get a token from login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@brown.edu","password":"password123"}' | jq -r '.token')

# Then use the token to access protected route
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**
```json
{
  "user": {
    "id": 1,
    "email": "test@brown.edu",
    "name": "Test User"
  }
}
```

### Course Data Tests

#### Get All Courses
```bash
curl http://localhost:3001/api/courses | jq '.courses | length'
```

**Expected Response:** Should return a number > 1000 (around 1208 courses)

#### Get Courses with Professors
```bash
curl http://localhost:3001/api/courses | jq '.courses[] | select(.professor != null) | {code, name, professor}' | head -20
```

**Expected Response:** Should show courses with professor names like:
```json
{
  "code": "AFRI 0090",
  "name": "An Introduction to Africana Studies",
  "professor": "Francoise Hamlin"
}
```

#### Get Course Majors
```bash
curl http://localhost:3001/api/courses/majors | jq '.majors | length'
```

**Expected Response:** Should return a number > 50 (departments)

### Schedule Management Tests

#### Add Course to Schedule (Protected)
```bash
# Get token first
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@brown.edu","password":"password123"}' | jq -r '.token')

# Add course to schedule
curl -X POST http://localhost:3001/api/schedule \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "courseId": 1,
    "term": "Fall 2025"
  }'
```

#### Get User Schedule (Protected)
```bash
curl -X GET http://localhost:3001/api/schedule \
  -H "Authorization: Bearer $TOKEN"
```

## 🌐 Frontend Integration Tests

### 1. Manual Frontend Test
1. Open http://localhost:5173 in browser
2. Click "Login" and use credentials:
   - Email: `test@brown.edu`
   - Password: `password123`
3. Verify login success and redirect to courses page
4. Browse courses and verify professor names are displayed
5. Add a course to schedule
6. Navigate to schedule page and verify course appears

### 2. Frontend API Proxy Test
```bash
# Test that frontend proxy works
curl -X POST http://localhost:5173/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@brown.edu","password":"password123"}'
```

**Expected Response:** Same as direct backend call

## 🔍 Database Verification

### Check Database Tables
```bash
# Connect to PostgreSQL
psql postgresql://localhost:5432/brown_course_catalog_local

# Check tables exist
\dt

# Check user count
SELECT COUNT(*) FROM users;

# Check course count
SELECT COUNT(*) FROM courses;

# Check courses with professors
SELECT COUNT(*) FROM courses WHERE professor IS NOT NULL;

# Sample course with professor
SELECT code, name, professor FROM courses WHERE professor IS NOT NULL LIMIT 5;
```

## 🚨 Error Testing

### Test Invalid Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrongpass"}'
```

**Expected Response:** 401 Unauthorized

### Test Protected Route Without Token
```bash
curl http://localhost:3001/api/schedule
```

**Expected Response:** 401 Unauthorized with "No token provided"

### Test Invalid Token
```bash
curl http://localhost:3001/api/schedule \
  -H "Authorization: Bearer invalid-token"
```

**Expected Response:** 401 Unauthorized with "Invalid token"

## 📊 Performance Tests

### Load Testing
```bash
# Test courses endpoint performance
time curl http://localhost:3001/api/courses > /dev/null

# Test with multiple concurrent requests
for i in {1..10}; do
  curl -s http://localhost:3001/api/courses > /dev/null &
done
wait
```

## ✅ Success Criteria

The local setup is working correctly if:

1. ✅ Backend starts without errors on port 3001
2. ✅ Frontend starts without errors on port 5173
3. ✅ Database connection is established
4. ✅ Authentication endpoints work (register, login, me)
5. ✅ Course data is loaded (1200+ courses)
6. ✅ Professor names are displayed in course data
7. ✅ Protected routes require valid JWT tokens
8. ✅ Frontend can login and display courses
9. ✅ Schedule management works (add/remove courses)
10. ✅ No deployment dependencies are present

## 🐛 Troubleshooting

### Common Issues and Solutions

**Backend won't start:**
- Check if port 3001 is in use: `lsof -i :3001`
- Kill existing process: `kill -9 <PID>`
- Check database connection in `.env.local`

**Frontend won't start:**
- Check if port 5173 is in use: `lsof -i :5173`
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

**Database connection failed:**
- Start PostgreSQL: `brew services start postgresql`
- Create database: `createdb brown_course_catalog_local`
- Check DATABASE_URL in `.env.local`

**Courses not showing:**
- Run course population: `npm run populate`
- Check database schema: `npm run setup`

**Authentication failing:**
- Check JWT_SECRET in `.env.local`
- Verify user exists: `SELECT * FROM users;`
- Check password hashing is working 