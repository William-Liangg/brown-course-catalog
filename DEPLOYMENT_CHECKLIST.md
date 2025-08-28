# 🚀 Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. **Production Database Setup**
- [ ] Create a PostgreSQL database on Render
- [ ] Get the production DATABASE_URL
- [ ] Test connection to production database

### 2. **Environment Variables**
You need to set these in Render dashboard:

**Backend Service Environment Variables:**
```
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=your-secret-key-here
OPENAI_API_KEY=sk-your-openai-key
NODE_ENV=production
```

**Frontend Service Environment Variables:**
```
VITE_API_URL=https://your-backend-name.onrender.com
```

### 3. **Code Changes Made**
- [x] Fixed render.yaml API URL
- [x] Removed database setup from build command
- [x] Enhanced logging for debugging

## 🚀 Deployment Steps

### Step 1: Create Production Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Name it: `brown-course-catalog-db`
4. Copy the DATABASE_URL

### Step 2: Deploy Backend
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `brown-course-catalog-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

### Step 3: Set Backend Environment Variables
In your backend service settings, add:
```
DATABASE_URL=your-production-database-url
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-key
NODE_ENV=production
```

### Step 4: Deploy Frontend
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "Static Site"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `brown-course-catalog-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

### Step 5: Set Frontend Environment Variables
In your frontend service settings, add:
```
VITE_API_URL=https://brown-course-catalog-backend.onrender.com
```

## 🔍 Testing Deployment

### Test Backend
```bash
curl https://brown-course-catalog-backend.onrender.com/health
```

### Test Frontend
Visit: `https://brown-course-catalog-frontend.onrender.com`

## 🐛 Common Issues

### Issue 1: "Database connection failed"
**Solution**: Check DATABASE_URL in Render environment variables

### Issue 2: "JWT_SECRET not set"
**Solution**: Add JWT_SECRET to Render environment variables

### Issue 3: "CORS errors"
**Solution**: Backend CORS is already configured for production

### Issue 4: "Build fails"
**Solution**: Check build logs in Render dashboard

## 📊 Monitoring

After deployment, monitor:
- [ ] Backend health endpoint
- [ ] Database connections
- [ ] API response times
- [ ] Frontend loading

## 🆘 Debugging Commands

If you need to debug locally with production settings:
```bash
# Test with production database
DATABASE_URL="your-production-url" npm start

# Test API endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/courses
``` 