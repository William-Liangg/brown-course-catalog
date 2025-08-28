# 🚀 Brown Course Catalog Quick Start Guide

## ⚡ Local Development Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (local or cloud)

### 2. Setup Environment
```bash
# Copy environment template
cp env.example .env

# Edit with your values
nano .env
```

**Required in .env:**
- `DATABASE_URL` (PostgreSQL connection string)
- `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- `OPENAI_API_KEY` (from OpenAI dashboard, optional for AI features)
- `NODE_ENV=development`
- `VITE_API_URL=http://localhost:3000`

### 3. Install Dependencies & Setup Database
```bash
# Run the setup script (recommended)
./setup.sh
```

**Or manually:**
```bash
# Install all dependencies (frontend + backend)
npm run install-all

# Setup database
node setup-database.js
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
# Start backend server
npm run backend
# or
cd backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
# Start frontend development server
npm run dev
# or
cd frontend && npm run dev
```

### 6. Access Your App
- 🌐 Frontend: http://localhost:5173 (or the port shown in terminal)
- 🔧 API: http://localhost:3000/api
- 📊 Health: http://localhost:3000/health

## ☁️ Deploy to Vercel

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Vercel Setup
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repo
3. Set environment variables from your .env file
4. Deploy automatically

### 3. Your app will be live at:
`https://your-app-name.vercel.app`

## 🔧 Useful Commands

```bash
# View backend logs
cd backend && npm run dev

# View frontend logs
cd frontend && npm run dev

# Build for production
npm run build

# Install dependencies
npm run install-all
```

## 🚨 Troubleshooting

**Database connection failed?**
```bash
# Check if PostgreSQL is running
psql -h localhost -U your_username -d your_database

# Verify DATABASE_URL in .env
echo $DATABASE_URL
```

**Backend not starting?**
```bash
# Check backend logs
cd backend && npm run dev

# Verify environment variables
cd backend && node -e "console.log(process.env.DATABASE_URL)"
```

**Frontend not connecting to backend?**
```bash
# Check VITE_API_URL in .env
echo $VITE_API_URL

# Verify backend is running on port 3000
curl http://localhost:3000/health
```

**Port already in use?**
```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 5173
lsof -i :5173

# Kill process if needed
kill -9 <PID>
```

## 📚 Full Documentation

See [LOCAL_DEVELOPMENT.md](LOCAL_DEVELOPMENT.md) for detailed instructions.

---

**Need help?** Check the troubleshooting section above or the backend README 