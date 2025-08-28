# 🚀 Setup Guide for Other Users

This guide will help anyone set up and run the Brown Course Catalog locally on their own device.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **A PostgreSQL database** (local or cloud)

## 🔧 Quick Setup (Recommended)

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd brown-course-catalog
```

### Step 2: Run the Universal Setup Script
```bash
./universal-setup.sh
```

This script will:
- ✅ Check your Node.js version
- ✅ Guide you through environment configuration
- ✅ Install all dependencies
- ✅ Set up the database
- ✅ Provide next steps

### Step 3: Start the Application

**Terminal 1 - Backend:**
```bash
npm run backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 4: Access the Application
- **Frontend**: http://localhost:5173 (or next available port)
- **Backend API**: http://localhost:3001/api

## 🗄️ Database Options

You have several options for the database:

### Option 1: Local PostgreSQL
```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql
createdb brown_course_catalog

# Then use this DATABASE_URL:
DATABASE_URL=postgres://your_username@localhost:5432/brown_course_catalog
```

### Option 2: Cloud Databases (Free Tiers)
- **Neon**: https://neon.tech (PostgreSQL)
- **Supabase**: https://supabase.com (PostgreSQL)
- **Railway**: https://railway.app (PostgreSQL)

## 🔑 Environment Variables

The setup script will prompt you for these values:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Your PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret key for authentication (auto-generated if empty) |
| `OPENAI_API_KEY` | No | OpenAI API key for AI features |
| `PORT` | No | Backend port (default: 3001) |

## 🐛 Troubleshooting

### Common Issues

**"Node.js version too old"**
- Update Node.js to version 18 or higher

**"Database connection failed"**
- Check your DATABASE_URL is correct
- Ensure your database is running and accessible

**"Port already in use"**
- The application will automatically find the next available port
- Or manually specify a different port in the setup

**"Dependencies failed to install"**
- Try running `npm cache clean --force` first
- Check your internet connection
- Try using Yarn instead: `npm install -g yarn`

### Getting Help

If you encounter issues:

1. **Check the error message** carefully
2. **Try the troubleshooting steps** above
3. **Check your Node.js version**: `node --version`
4. **Verify your database connection**
5. **Look at TROUBLESHOOTING.md** for more detailed help

## 🎯 What You'll Get

After successful setup, you'll have:
- ✅ A working Brown Course Catalog application
- ✅ Frontend running on localhost
- ✅ Backend API with authentication
- ✅ Database with course data
- ✅ AI-powered course recommendations (if OpenAI key provided)

## 💡 Tips

- **Use the universal setup script** - it handles most issues automatically
- **Start with a cloud database** if you're not familiar with PostgreSQL
- **The application works on any device** with Node.js 18+
- **No need to be logged in as any specific user** - it works for anyone!

## 🚀 Ready to Start?

Just run:
```bash
./universal-setup.sh
```

And follow the prompts! 🎉 