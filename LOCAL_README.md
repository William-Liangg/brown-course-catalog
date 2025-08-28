# Brown Course Catalog - Local Development

A fully local, self-contained version of the Brown Course Catalog app that runs entirely on your computer.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### 1. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 2. Set Up Local Database
```bash
# Start PostgreSQL (if not already running)
brew services start postgresql@14

# Create local database
createdb brown_course_catalog_local

# Set up database tables and sample data
npm run setup
```

### 3. Start the Application
```bash
# Start both frontend and backend servers
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173 (or 5174 if 5173 is busy)
- **Backend API**: http://localhost:3001

## 📊 Database

### Local PostgreSQL Setup
- **Database**: `brown_course_catalog_local`
- **Host**: `localhost`
- **Port**: `5432`
- **SSL**: Disabled (local development)

### Sample Data
The setup script creates:
- **5 sample courses** with professor information
- **1 test user**: `test@brown.edu` / `password123`

### Tables
- `users` - User accounts with password hashing
- `courses` - Course information including professors
- `schedules` - User course schedules

## 🔧 Features

### ✅ Working Features
- **User Authentication**: Sign up, login, logout with password hashing
- **Course Display**: View courses with professor information
- **Course Search**: Search by name, code, description, or professor
- **Schedule Management**: Add/remove courses from schedule
- **Time Conflict Detection**: Prevents adding conflicting courses
- **User Profile**: Update names, change password, delete account
- **Local Data Persistence**: All data saved to local PostgreSQL

### 🔒 Security
- **Password Hashing**: Uses bcrypt for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries

## 🛠️ Development

### Project Structure
```
brown-course-catalog/
├── frontend/           # React + Vite frontend
├── backend/           # Express.js backend
├── env.local          # Local environment variables
├── setup-local-database.js  # Database setup script
└── package.json       # Root package.json with dev scripts
```

### Available Scripts
```bash
npm run dev           # Start both frontend and backend
npm run dev:frontend  # Start only frontend
npm run dev:backend   # Start only backend
npm run setup         # Set up local database
```

### Environment Variables
Create `env.local` with:
```env
DATABASE_URL=postgresql://localhost:5432/brown_course_catalog_local
JWT_SECRET=local-development-secret-key-change-in-production
NODE_ENV=development
VITE_API_URL=http://localhost:3001
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Restart PostgreSQL if needed
brew services restart postgresql@14

# Test database connection
psql -d brown_course_catalog_local -c "SELECT NOW();"
```

### Port Conflicts
- Frontend: If port 5173 is busy, it will automatically try 5174
- Backend: Change port in `backend/simple-server.cjs` if 3001 is busy

### Reset Database
```bash
# Drop and recreate database
dropdb brown_course_catalog_local
createdb brown_course_catalog_local
npm run setup
```

## 📝 API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user info

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/majors` - Get course majors

### Schedule
- `GET /api/schedule` - Get user's schedule
- `POST /api/schedule` - Add course to schedule
- `DELETE /api/schedule/:id` - Remove course from schedule

### User Profile
- `POST /api/update-names` - Update user names
- `POST /api/change-password` - Change password
- `DELETE /api/delete-account` - Delete account

## 🎯 What's Fixed

### ✅ Issues Resolved
1. **Professors showing up**: Course cards now display professor information from database
2. **User registration**: Signup creates real accounts in local database
3. **Password verification**: Proper bcrypt hashing and verification
4. **Data persistence**: All data saved to local PostgreSQL database
5. **Local development**: No external dependencies or deployment services

### 🔄 Changes Made
- **Database**: Switched from remote to local PostgreSQL
- **Authentication**: Implemented proper password hashing with bcrypt
- **API**: All endpoints now use real database operations
- **Environment**: Local-only configuration
- **Development**: Single command to start both servers

## 🚀 Deployment Ready

This local setup can be easily adapted for deployment by:
1. Changing `DATABASE_URL` to production database
2. Setting `NODE_ENV=production`
3. Configuring SSL for database connections
4. Setting secure JWT secret

## 📞 Support

For local development issues:
1. Check PostgreSQL is running
2. Verify database connection
3. Check environment variables
4. Restart servers if needed

The app is now fully self-contained and ready for local development! 🎉 