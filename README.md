# Brown University Course Catalog

A local course catalog application for Brown University students to browse courses, view professor information, and manage their schedules.

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (running locally)
- npm or yarn

### Setup Steps

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd brown-course-catalog
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

2. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp env.local .env.local
   ```
   
   Edit `.env.local` with your local database settings:
   ```
   DATABASE_URL=postgresql://localhost:5432/brown_course_catalog_local
   JWT_SECRET=your-local-secret-key
   NODE_ENV=development
   ```

3. **Set up the database**
   ```bash
   # Create the database (if not exists)
   createdb brown_course_catalog_local
   
   # Run database setup and populate courses
   npm run setup
   npm run populate
   ```

4. **Start the application**
   ```bash
   # Start both backend and frontend
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Test user: `test@brown.edu` / `password123`

### Available Scripts

- `npm run dev` - Start both backend and frontend
- `npm run dev:backend` - Start only the backend server
- `npm run dev:frontend` - Start only the frontend
- `npm run setup` - Set up database schema and test user
- `npm run populate` - Populate courses from Brown University data
- `npm run build` - Build the frontend for production

## 🧪 Testing the Setup

### API Endpoints Test
```bash
# Test backend health
curl http://localhost:3001/health

# Test login with demo user
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@brown.edu","password":"password123"}'

# Test courses endpoint
curl http://localhost:3001/api/courses | jq '.courses | length'
```

### Frontend Test
1. Open http://localhost:5173
2. Login with `test@brown.edu` / `password123`
3. Browse courses and verify professor names are displayed
4. Add courses to schedule

## 🏗️ Architecture

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + PostgreSQL
- **Authentication**: JWT tokens with bcrypt password hashing
- **Database**: PostgreSQL with local persistence

## 📊 Features

- ✅ User registration and authentication
- ✅ Course browsing with professor information
- ✅ Schedule management with conflict detection
- ✅ Search and filtering by department
- ✅ Responsive design with Tailwind CSS
- ✅ Local development with hot reload

## 🔧 Troubleshooting

### Common Issues

**Database connection failed**
- Ensure PostgreSQL is running: `brew services start postgresql`
- Check DATABASE_URL in `.env.local`
- Verify database exists: `createdb brown_course_catalog_local`

**Port already in use**
- Kill existing processes: `lsof -ti:3001 | xargs kill -9`
- Or use different ports in `.env.local`

**Missing dependencies**
- Run `npm install` in root, backend, and frontend directories
- Clear node_modules and reinstall if needed

**Courses not showing**
- Run `npm run populate` to load course data
- Check database connection and schema

### Getting Help

If you encounter issues:
1. Check the console logs for error messages
2. Verify all prerequisites are installed
3. Ensure database is running and accessible
4. Check environment variables are set correctly

## 📝 Development

This is a local-only application designed for development and testing. All data is stored locally in PostgreSQL and no external services are required.
