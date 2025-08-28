# Login Flow Fixes Summary

## Issues Fixed

### 1. Database Schema Mismatch
**Problem**: The users table had `password` field but backend expected `password_hash`, `first_name`, and `last_name`.

**Solution**: Updated `backend/sql/create_users_table.sql`:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Frontend API Endpoint Mismatch
**Problem**: Frontend was calling `/api/login` and `/api/signup` but backend expected `/api/auth/login` and `/api/auth/register`.

**Solution**: Updated `frontend/src/utils/api.ts`:
- Changed login endpoint from `/login` to `/auth/login`
- Changed signup endpoint from `/signup` to `/auth/register`
- Updated signup to send `name` field instead of `firstName` and `lastName`

### 3. JWT Token Storage
**Problem**: Frontend wasn't storing JWT tokens for API authentication.

**Solution**: 
- Updated `getAuthHeaders()` to include `Authorization: Bearer <token>` header
- Modified login/signup to store JWT token in localStorage
- Updated logout to clear JWT token

### 4. User Data Structure
**Problem**: Frontend expected `firstName`/`lastName` but backend returned `name`.

**Solution**: Updated frontend to use unified `name` field:
- Modified `App.tsx` user state structure
- Updated login/signup to store `userName` instead of separate first/last names
- Updated localStorage keys accordingly

### 5. Demo User Seeding
**Problem**: No test user available for testing.

**Solution**: Created `backend/scripts/seed_demo_user.js`:
- Seeds demo user: `demo@local.test` / `password123` / `Demo User`
- Checks for existing user to avoid duplicates

## Backend Endpoints

### ✅ `/api/auth/register`
- Accepts: `{ email, password, name }`
- Hashes password with bcrypt
- Stores in database with proper field names
- Returns: `{ token, user: { id, email, name } }`

### ✅ `/api/auth/login`
- Accepts: `{ email, password }`
- Finds user by email
- Compares password with bcrypt.compare
- Returns: `{ token, user: { id, email, name } }` or 401 for invalid credentials

### ✅ `/api/schedule`
- Requires JWT authentication via `Authorization: Bearer <token>` header
- Returns user's schedule or empty array

### ✅ `/api/logout`
- Clears authentication cookies
- Returns success message

## Frontend Changes

### Authentication Flow
1. **Login**: Calls `/api/auth/login`, stores JWT token and user data
2. **Signup**: Calls `/api/auth/register`, stores JWT token and user data  
3. **API Calls**: Automatically includes JWT token in Authorization header
4. **Logout**: Clears JWT token and user data from localStorage

### User State Management
- Uses unified `name` field instead of separate first/last names
- Stores JWT token in localStorage for API authentication
- Properly handles authentication state in App component

## Testing Results

✅ **Demo User Login**: `demo@local.test` / `password123` works correctly
✅ **User Registration**: New users can register successfully
✅ **JWT Authentication**: Schedule endpoint works with JWT token
✅ **Invalid Credentials**: Properly returns 401 with "Invalid credentials"
✅ **Unauthorized Access**: Schedule endpoint rejects requests without token

## Demo User Credentials
- **Email**: `demo@local.test`
- **Password**: `password123`
- **Name**: `Demo User`

## Local Development Setup
1. Database is set up with correct schema
2. Demo user is seeded
3. Backend runs on port 3001
4. Frontend runs on port 5173
5. JWT_SECRET is configured in env.local

The entire login flow now works correctly locally without any deployment dependencies! 