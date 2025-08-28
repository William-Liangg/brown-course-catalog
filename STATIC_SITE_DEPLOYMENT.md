# 🚀 Static Site Deployment Guide

## 📋 Prerequisites
- Backend already deployed at: `https://brown-course-catalog.onrender.com`
- GitHub repository with your code
- Render account

## 🔧 Step 1: Verify Frontend Configuration

### Environment Variables
Your frontend `.env` file should contain:
```bash
VITE_API_URL=https://brown-course-catalog.onrender.com
```

### API Configuration
The frontend uses `import.meta.env.VITE_API_URL` for all API calls:
- ✅ `frontend/src/config/api.js` - Uses environment variable
- ✅ `frontend/src/utils/api.ts` - Imports from config
- ✅ TypeScript types defined in `frontend/src/vite-env.d.ts`

## 🌐 Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)
1. **Push your code to GitHub** (already done)
2. **Go to [Render Dashboard](https://dashboard.render.com)**
3. **Click "New" → "Blueprint"**
4. **Connect your GitHub repository**
5. **Render will automatically detect and deploy both services**

### Option B: Manual Deployment
1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New" → "Static Site"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `brown-course-catalog-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Environment Variable**: 
     - **Key**: `VITE_API_URL`
     - **Value**: `https://brown-course-catalog.onrender.com`

## ✅ Step 3: Verify Deployment

### Check Frontend URL
Your frontend will be available at:
`https://brown-course-catalog-frontend.onrender.com`

### Test API Connection
1. **Open browser developer tools**
2. **Go to Network tab**
3. **Try to login or search for courses**
4. **Verify API calls go to**: `https://brown-course-catalog.onrender.com/api/*`

## 🔍 Step 4: Troubleshooting

### Common Issues

#### 1. Environment Variable Not Loading
**Symptoms**: API calls go to localhost instead of backend
**Solution**: 
- Check Render environment variables
- Ensure `VITE_API_URL` is set correctly
- Rebuild the site

#### 2. CORS Errors
**Symptoms**: Browser console shows CORS errors
**Solution**: 
- Backend CORS is already configured for `https://brown-course-catalog-frontend.onrender.com`
- If issues persist, check backend logs

#### 3. Build Failures
**Symptoms**: Render build fails
**Solution**:
- Check `frontend/package.json` for correct dependencies
- Ensure all imports are correct
- Check TypeScript compilation

### Debug Steps
1. **Check Render Logs**: Go to service → "Logs" tab
2. **Test Backend**: `curl https://brown-course-catalog.onrender.com`
3. **Test Frontend**: Visit the frontend URL
4. **Check Environment**: Look for `VITE_API_URL` in browser console

## 🎯 Expected Result

After successful deployment:
- ✅ Frontend loads at `https://brown-course-catalog-frontend.onrender.com`
- ✅ Login/signup forms work
- ✅ Course search connects to backend
- ✅ Schedule management works
- ✅ AI recommendations work
- ✅ All API calls go to `https://brown-course-catalog.onrender.com`

## 📝 Configuration Summary

| Setting | Value |
|---------|-------|
| **Service Type** | Static Site |
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Publish Directory** | `frontend/build` |
| **Environment Variable** | `VITE_API_URL=https://brown-course-catalog.onrender.com` |
| **Frontend URL** | `https://brown-course-catalog-frontend.onrender.com` |
| **Backend URL** | `https://brown-course-catalog.onrender.com` |

---

**🎉 Your Brown Course Catalog will be fully deployed as a static site!** 