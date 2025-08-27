# 🚀 Render Deployment Guide - Brown Course Catalog

This guide will help you deploy your full-stack Brown Course Catalog app on Render using two separate services: a backend Web Service and a frontend Static Site.

## 📋 Prerequisites

- GitHub repository with your code
- Render account (free tier available)
- PostgreSQL database (Render provides this)
- OpenAI API key for AI features

## 🏗️ Project Structure

```
brown-course-catalog/
├── backend/           # Express + Node server
│   ├── server.cjs
│   ├── package.json
│   ├── routes/
│   ├── controllers/
│   └── middleware/
├── frontend/          # React + Tailwind
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── package.json       # Root package.json
```

## 🔧 Step 1: Set Up PostgreSQL Database on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"PostgreSQL"**
3. **Configure Database**:
   - **Name**: `brown-course-catalog-db`
   - **Database**: `brown_course_catalog`
   - **User**: `brown_user`
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 15 (latest stable)
4. **Click "Create Database"**
5. **Copy Connection Details**:
   - Note the **Internal Database URL** (you'll need this for backend)
   - Note the **External Database URL** (for local development)

## 🔧 Step 2: Deploy Backend Web Service

### 2.1 Create Backend Service

1. **Go to Render Dashboard** → **"New +"** → **"Web Service"**
2. **Connect Repository**:
   - Connect your GitHub repository
   - Select the repository: `brown-course-catalog`

### 2.2 Configure Backend Service

**Basic Settings:**
- **Name**: `brown-course-catalog-backend`
- **Environment**: `Node`
- **Region**: Same as your database
- **Branch**: `main`

**Build & Deploy Settings:**
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run setup-db`
- **Start Command**: `npm start`

**Environment Variables:**
Add these environment variables (click "Environment" tab):

```
DATABASE_URL=postgres://brown_user:password@host:port/brown_course_catalog
OPENAI_API_KEY=your_openai_api_key_here
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
PORT=3001
```

**Important Notes:**
- Replace `DATABASE_URL` with the **Internal Database URL** from Step 1
- Generate a strong `JWT_SECRET` (you can use: `openssl rand -base64 32`)
- Get your `OPENAI_API_KEY` from: https://platform.openai.com/api-keys

### 2.3 Deploy Backend

1. **Click "Create Web Service"**
2. **Wait for deployment** (usually 2-3 minutes)
3. **Note the URL**: `https://your-backend-name.onrender.com`

## 🔧 Step 3: Deploy Frontend Static Site

### 3.1 Create Frontend Service

1. **Go to Render Dashboard** → **"New +"** → **"Static Site"**
2. **Connect Repository**:
   - Connect your GitHub repository (same as backend)
   - Select the repository: `brown-course-catalog`

### 3.2 Configure Frontend Service

**Basic Settings:**
- **Name**: `brown-course-catalog-frontend`
- **Region**: Same as backend
- **Branch**: `main`

**Build & Deploy Settings:**
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`

**Environment Variables:**
Add this environment variable:

```
VITE_API_URL=https://your-backend-name.onrender.com
```

**Important:** Replace `your-backend-name` with your actual backend service name.

### 3.3 Deploy Frontend

1. **Click "Create Static Site"**
2. **Wait for deployment** (usually 1-2 minutes)
3. **Note the URL**: `https://your-frontend-name.onrender.com`

## 🔧 Step 4: Update Frontend API Configuration

You need to update your frontend to use the backend URL. Create or update your API configuration:

### 4.1 Create API Configuration File

Create `frontend/src/config/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      signup: '/api/signup',
      login: '/api/login',
      logout: '/api/logout',
      me: '/api/me'
    },
    courses: {
      all: '/api/courses',
      majors: '/api/courses/majors'
    },
    schedule: {
      base: '/api/schedule'
    },
    ai: {
      recommend: '/api/ai/ai-recommend'
    },
    recommendations: {
      base: '/api/recommendations'
    }
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    credentials: 'include', // Important for cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};
```

### 4.2 Update Your API Calls

Replace all your API calls to use the new configuration:

```javascript
// Instead of fetch('/api/login', ...)
import { apiRequest, API_CONFIG } from '../config/api.js';

// Use like this:
const loginData = await apiRequest(API_CONFIG.auth.login, {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
```

## 🔧 Step 5: Test Your Deployment

### 5.1 Test Backend API

Test your backend endpoints using curl or Postman:

```bash
# Test health endpoint
curl https://your-backend-name.onrender.com/health

# Test API info
curl https://your-backend-name.onrender.com/

# Test signup (replace with your actual data)
curl -X POST https://your-backend-name.onrender.com/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
```

### 5.2 Test Frontend

1. **Visit your frontend URL**: `https://your-frontend-name.onrender.com`
2. **Test user registration/login**
3. **Test course search and AI recommendations**
4. **Test schedule management**

### 5.3 Common Issues & Solutions

**CORS Errors:**
- Ensure your backend CORS configuration includes your frontend URL
- Update `backend/server.cjs` CORS settings if needed

**Database Connection Issues:**
- Verify `DATABASE_URL` is correct
- Check if database is accessible from your region

**Authentication Issues:**
- Ensure `JWT_SECRET` is set
- Check cookie settings in production

## 🔧 Step 6: Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgres://user:pass@host:port/db` |
| `OPENAI_API_KEY` | OpenAI API key for AI features | `sk-...` |
| `JWT_SECRET` | Secret for JWT token signing | `your-secret-key` |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `3001` |

### Frontend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://backend-name.onrender.com` |

## 🔧 Step 7: Monitoring & Maintenance

### 7.1 Monitor Logs

- **Backend Logs**: Go to your backend service → "Logs" tab
- **Frontend Logs**: Go to your frontend service → "Logs" tab

### 7.2 Health Checks

Your backend includes a health check endpoint:
- **URL**: `https://your-backend-name.onrender.com/health`
- **Expected Response**: `{"message":"API running"}`

### 7.3 Database Management

- **View Database**: Go to your PostgreSQL service → "Connect" tab
- **Backup**: Render automatically backs up your database
- **Scaling**: Upgrade your database plan as needed

## 🎉 Success!

Your Brown Course Catalog app is now deployed on Render with:
- ✅ **Backend API**: Running on `https://your-backend-name.onrender.com`
- ✅ **Frontend**: Running on `https://your-frontend-name.onrender.com`
- ✅ **Database**: PostgreSQL running and connected
- ✅ **Authentication**: JWT + cookies working
- ✅ **AI Features**: OpenAI integration active

## 🔗 Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **Your Backend**: `https://your-backend-name.onrender.com`
- **Your Frontend**: `https://your-frontend-name.onrender.com`
- **Database**: Access via Render dashboard

## 🆘 Troubleshooting

If you encounter issues:

1. **Check Render logs** for error messages
2. **Verify environment variables** are set correctly
3. **Test API endpoints** individually
4. **Check database connection** in backend logs
5. **Verify CORS settings** if frontend can't reach backend

Need help? Check Render's documentation or community forums! 