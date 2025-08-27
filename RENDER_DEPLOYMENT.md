# 🚀 Render Deployment Checklist for BrunoTrack

## ✅ **Pre-Deployment Checklist**

- [x] Code pushed to GitHub
- [x] Server error fixed (authRoutes import)
- [x] Database setup script created
- [x] Environment variables prepared

## 📋 **Step-by-Step Render Deployment**

### **Step 1: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub account
3. Authorize Render to access your repositories

### **Step 2: Create PostgreSQL Database**

1. **Click "New" → "PostgreSQL"**
2. **Configure:**
   - **Name**: `bruno-track-db`
   - **Database**: `bruno_track`
   - **User**: `bruno_user`
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 15
   - **Plan**: Free (for testing)

3. **Click "Create Database"**
4. **Copy the Internal Database URL** (looks like: `postgresql://bruno_user:password@dpg-xxx-xxx-xxx/bruno_track`)

### **Step 3: Create Web Service**

1. **Click "New" → "Web Service"**
2. **Connect Repository**: `brown-course-catalog`
3. **Configure:**

   **Basic Settings:**
   - **Name**: `bruno-track`
   - **Environment**: `Docker`
   - **Branch**: `main`
   - **Region**: Same as database

   **Build & Deploy:**
   - **Build Command**: `docker build -t bruno-track .`
   - **Start Command**: `docker run -p $PORT:3001 bruno-track`

### **Step 4: Environment Variables**

Add these in Render dashboard:

```bash
NODE_ENV=production
PORT=3001
DATABASE_URL=<your_postgres_internal_url>
JWT_SECRET=8lDgr8mLx3FlpcvHZNvg+EyMTuSF+760NDNqn3HmRyo=
OPENAI_API_KEY=<your_openai_api_key>
```

### **Step 5: Deploy**

1. **Click "Create Web Service"**
2. **Wait for build** (5-10 minutes)
3. **Monitor build logs** for any errors

### **Step 6: Database Setup**

After successful deployment, run the database setup:

1. **Go to your web service dashboard**
2. **Click "Shell" tab**
3. **Run these commands:**

```bash
# Install dependencies
npm install pg dotenv

# Run database setup
node setup-database.js
```

### **Step 7: Verify Deployment**

Test these endpoints:

```bash
# Health check
curl https://your-app-name.onrender.com/health

# API endpoint
curl https://your-app-name.onrender.com/api

# Frontend
# Visit: https://your-app-name.onrender.com
```

## 🔧 **Troubleshooting**

### **Build Fails**
- Check build logs in Render dashboard
- Verify Dockerfile syntax
- Ensure all files are committed to GitHub

### **Database Connection Issues**
- Verify DATABASE_URL is correct
- Check if database is in same region
- Ensure SSL settings are correct

### **App Not Starting**
- Check environment variables
- Verify JWT_SECRET is set
- Check OpenAI API key

### **Common Error Solutions**

**"Cannot find module" errors:**
- Ensure all dependencies are in package.json
- Check if node_modules is in .dockerignore

**"Connection refused" errors:**
- Verify DATABASE_URL format
- Check if database is running

**"JWT_SECRET not set" errors:**
- Add JWT_SECRET to environment variables
- Restart the service after adding variables

## 📊 **Monitoring**

### **Health Checks**
- `/health` endpoint should return "healthy"
- Monitor uptime in Render dashboard

### **Logs**
- View logs in Render dashboard
- Check for errors in real-time

### **Performance**
- Monitor response times
- Check database connection pool

## 🔒 **Security Checklist**

- [ ] JWT_SECRET is long and random
- [ ] OPENAI_API_KEY is secure
- [ ] DATABASE_URL is internal (not public)
- [ ] HTTPS is enabled (automatic on Render)
- [ ] Environment variables are not in code

## 🎉 **Success Indicators**

Your deployment is successful when:

1. ✅ Build completes without errors
2. ✅ Health check returns "healthy"
3. ✅ API endpoint responds
4. ✅ Frontend loads in browser
5. ✅ Database tables are created
6. ✅ User registration/login works

## 📞 **Support**

If you encounter issues:

1. Check Render documentation
2. Review build logs
3. Verify environment variables
4. Test database connectivity
5. Check application logs

---

**Your BrunoTrack app will be live at:**
`https://bruno-track.onrender.com` (or your chosen name)

**Happy Deploying! 🚀** 