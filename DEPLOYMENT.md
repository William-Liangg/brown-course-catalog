# 🚀 **Brown Course Catalog - Render Deployment Guide**

## **Overview**
This guide provides step-by-step instructions for deploying the Brown Course Catalog to Render, including backend, frontend, and database setup.

## **Prerequisites**
- GitHub repository with the code
- Render account
- OpenAI API key
- PostgreSQL database (will be created on Render)

## **Architecture**
- **Backend**: Node.js/Express service on Render
- **Frontend**: React static site on Render
- **Database**: PostgreSQL on Render
- **Domain**: Same domain for frontend/backend (no CORS issues)

---

## **Phase 1: Database Setup**

### **1.1 Create PostgreSQL Database**
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `brown-course-catalog-db`
   - **Database**: `brown_course_catalog`
   - **User**: `brown_course_catalog_user`
   - **Plan**: Starter (Free tier)
   - **Region**: Choose closest to users
4. Click "Create Database"
5. **Save the External Database URL** for later use

### **1.2 Database Connection String**
The connection string will be in this format:
```
postgresql://brown_course_catalog_user:password@host:port/brown_course_catalog
```

---

## **Phase 2: Backend Deployment**

### **2.1 Create Web Service**
1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure the service:

**Basic Settings:**
- **Name**: `brown-course-catalog-backend`
- **Environment**: Node
- **Region**: Same as database
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && node simple-server.cjs`

### **2.2 Environment Variables**
Add these environment variables in the Render dashboard:

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | `production` | Production environment flag |
| `PORT` | `10000` | Port for the service |
| `DATABASE_URL` | `[From PostgreSQL]` | Database connection string |
| `JWT_SECRET` | `[Generate]` | JWT signing secret |
| `OPENAI_API_KEY` | `[Your Key]` | OpenAI API key |

**Generate JWT Secret:**
```bash
openssl rand -hex 32
```

### **2.3 Deploy Backend**
1. Click "Create Web Service"
2. Wait for build and deployment
3. Note the service URL: `https://your-backend.onrender.com`

---

## **Phase 3: Database Migration**

### **3.1 Run Migration Script**
After backend is deployed, run the database setup:

```bash
# Set environment variables locally
export DATABASE_URL="your-postgresql-connection-string"
export NODE_ENV="production"

# Run migration script
cd backend
node scripts/production-setup.js
```

### **3.2 Verify Database**
1. Check Render PostgreSQL dashboard
2. Verify tables created:
   - `users`
   - `courses` (should have 1200+ courses)
   - `schedules`
3. Verify demo user created: `demo@local.test`

---

## **Phase 4: Frontend Deployment**

### **4.1 Create Static Site**
1. Go to Render Dashboard → "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:

**Basic Settings:**
- **Name**: `brown-course-catalog-frontend`
- **Branch**: `main`

**Build & Deploy:**
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

### **4.2 Environment Variables**
Add this environment variable:

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_API_URL` | `https://your-backend.onrender.com` | Backend API URL |

### **4.3 Deploy Frontend**
1. Click "Create Static Site"
2. Wait for build and deployment
3. Note the site URL: `https://your-frontend.onrender.com`

---

## **Phase 5: Integration Testing**

### **5.1 Backend Health Check**
Visit: `https://your-backend.onrender.com/health`
Expected response:
```json
{
  "status": "OK",
  "timestamp": "2025-01-XX...",
  "environment": "production"
}
```

### **5.2 Frontend-Backend Connection**
1. Open frontend URL
2. Test login with demo credentials:
   - **Email**: `demo@local.test`
   - **Password**: `password123`
3. Test course search functionality
4. Test AI recommendations
5. Test schedule management

### **5.3 Database Connectivity**
- Verify courses load in frontend
- Test user registration/login
- Test schedule functionality

---

## **Phase 6: Production Optimization**

### **6.1 Auto-Scaling**
- **Min Instances**: 1 (always running)
- **Max Instances**: 3 (auto-scale on load)
- **Health Check**: `/health` endpoint

### **6.2 Monitoring**
- Check Render dashboard for:
  - Response times
  - Error rates
  - Resource usage
  - Logs

### **6.3 Security**
- ✅ HTTPS enabled automatically
- ✅ Environment variables secured
- ✅ No hardcoded secrets
- ✅ JWT tokens secure

---

## **Troubleshooting**

### **Common Issues**

**Backend Won't Start:**
- Check environment variables
- Verify DATABASE_URL format
- Check logs in Render dashboard

**Database Connection Failed:**
- Verify DATABASE_URL is correct
- Check PostgreSQL is running
- Ensure SSL settings are correct

**Frontend Can't Connect to Backend:**
- Verify VITE_API_URL is correct
- Check CORS settings (should be none needed)
- Test backend health endpoint

**Courses Not Loading:**
- Run database migration script
- Check courses table has data
- Verify API endpoints working

### **Useful Commands**

**Check Backend Logs:**
```bash
# In Render dashboard → Logs tab
```

**Test Database Connection:**
```bash
psql "your-database-url"
```

**Re-run Migration:**
```bash
cd backend
node scripts/production-setup.js
```

---

## **Final Checklist**

### **Pre-Deployment**
- [ ] All environment variables secured
- [ ] Database migration script ready
- [ ] Frontend builds successfully
- [ ] Backend health check working
- [ ] No hardcoded secrets in code

### **Post-Deployment**
- [ ] Backend service responding
- [ ] Database connected and seeded
- [ ] Frontend loading correctly
- [ ] User authentication working
- [ ] Course search functional
- [ ] AI recommendations working
- [ ] Schedule management operational

### **Security Verification**
- [ ] HTTPS enabled
- [ ] JWT tokens secure
- [ ] API keys protected
- [ ] No CORS issues
- [ ] Database connection encrypted

---

## **Support**

If you encounter issues:
1. Check Render dashboard logs
2. Verify environment variables
3. Test endpoints individually
4. Check database connectivity
5. Review this deployment guide

**Happy Deploying! 🎉** 