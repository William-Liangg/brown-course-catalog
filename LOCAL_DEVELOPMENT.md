# 🚀 Local Development Guide

This guide will help you set up and run the Brown Course Catalog application locally.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** database (local or cloud)

## 🔧 Step-by-Step Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd brown-course-catalog
```

### 2. Setup Environment Variables
```bash
# Copy the environment template
cp env.example .env

# Edit the .env file with your values
nano .env  # or use your preferred editor
```

**Required values in `.env`:**
```bash
# Database connection (replace with your actual PostgreSQL URL)
DATABASE_URL=postgres://username:password@localhost:5432/brown_course_catalog

# JWT secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API key (optional - only needed for AI features)
OPENAI_API_KEY=your-openai-api-key-here

# Environment
NODE_ENV=development

# Frontend API URL
VITE_API_URL=http://localhost:3000
```

**To generate a JWT secret:**
```bash
openssl rand -base64 32
```

### 3. Install Dependencies
```bash
# Install all dependencies (frontend + backend)
npm run install-all
```

### 4. Setup Database
```bash
# Run the database setup script
node setup-database.js
```

### 5. Start Development Servers

You'll need to run two terminal windows/tabs:

**Terminal 1 - Backend Server:**
```bash
npm run backend
```
This will start the backend API server on port 3000.

**Terminal 2 - Frontend Server:**
```bash
npm run dev
```
This will start the frontend development server (usually on port 5173).

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test your database connection
psql "your-database-url-here"

# Check if DATABASE_URL is set correctly
echo $DATABASE_URL
```

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 5173
lsof -i :5173

# Kill the process if needed
kill -9 <PID>
```

### Backend Won't Start
```bash
# Check backend logs
cd backend && npm run dev

# Verify environment variables
cd backend && node -e "console.log('DATABASE_URL:', process.env.DATABASE_URL)"
```

### Frontend Can't Connect to Backend
```bash
# Check if backend is running
curl http://localhost:3000/health

# Verify VITE_API_URL in .env
echo $VITE_API_URL
```

### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json
npm run install-all
```

**If that doesn't work:**
```bash
# Try using Yarn instead
npm install -g yarn
yarn install
cd frontend && yarn install && cd ..
cd backend && yarn install && cd ..
```

**Check Node.js version:**
```bash
node --version  # Should be 18.0.0 or higher
```

**For more detailed troubleshooting, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md)**

## 📚 Available Scripts

- `npm run dev` - Start frontend development server
- `npm run backend` - Start backend development server
- `npm run build` - Build frontend for production
- `npm run install-all` - Install all dependencies
- `npm run start` - Start backend in production mode

## 🔄 Development Workflow

1. Make changes to your code
2. Frontend will automatically reload (hot reload)
3. Backend will restart automatically (if using nodemon)
4. Test your changes in the browser

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgres://user:pass@host:port/db` |
| `JWT_SECRET` | Yes | Secret key for JWT tokens | `your-secret-key-here` |
| `OPENAI_API_KEY` | No | OpenAI API key for AI features | `sk-...` |
| `NODE_ENV` | No | Environment mode | `development` |
| `VITE_API_URL` | Yes | Backend API URL for frontend | `http://localhost:3000` |

## 🆘 Getting Help

If you're still having issues:

1. Check the [troubleshooting section](#-troubleshooting) above
2. Look at the [QUICK_START.md](QUICK_START.md) for additional details
3. Check the [backend README](backend/README.md) for API documentation
4. Verify all prerequisites are installed correctly

## 🎉 Success!

Once everything is running, you should see:
- Backend server running on port 3000
- Frontend server running on port 5173
- Database tables created successfully
- No error messages in either terminal

You can now start developing! 🚀 