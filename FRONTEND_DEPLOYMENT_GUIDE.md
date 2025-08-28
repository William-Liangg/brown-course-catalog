# Frontend Deployment Guide - Render Static Site

This guide will help you deploy the React frontend as a separate static site on Render, connecting to your deployed backend at `https://brown-course-catalog.onrender.com`.

## Prerequisites

- ✅ Backend already deployed at `https://brown-course-catalog.onrender.com`
- ✅ GitHub repository with frontend code
- ✅ Render account

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your frontend code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare frontend for Render deployment"
git push
```

### 2. Create New Static Site on Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Click "New +"** → **"Static Site"**
3. **Connect your GitHub repository**
4. **Configure the deployment**:

   **Basic Settings:**
   - **Name**: `brown-course-catalog-frontend` (or your preferred name)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `frontend` (important!)

   **Build Settings:**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

   **Environment Variables:**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://brown-course-catalog.onrender.com`

### 3. Deploy

1. **Click "Create Static Site"**
2. **Wait for the build to complete** (usually 2-3 minutes)
3. **Your site will be available at**: `https://your-site-name.onrender.com`

## Verification Steps

### 1. Check Build Success

After deployment, verify in Render logs:
- ✅ Build completed successfully
- ✅ No TypeScript errors
- ✅ Build output in `build/` directory

### 2. Test Frontend-Backend Connection

1. **Open your deployed frontend URL**
2. **Open browser Developer Tools** (F12)
3. **Go to Network tab**
4. **Try to load the page or make an API call**
5. **Verify API requests go to**: `https://brown-course-catalog.onrender.com/api/*`

### 3. Test API Endpoints

Visit these URLs to verify backend connectivity:

- **API Info**: `https://brown-course-catalog.onrender.com/`
- **Courses**: `https://brown-course-catalog.onrender.com/api/courses`
- **Health Check**: `https://brown-course-catalog.onrender.com/api/health` (if available)

### 4. Check Environment Variables

In your frontend code, verify the API URL is correct:

```javascript
// This should log the production URL
console.log('API URL:', import.meta.env.VITE_API_URL);
```

## Troubleshooting

### Build Fails

**Error**: `Cannot find module 'react'`
**Solution**: Ensure `npm install` runs before `npm run build`

**Error**: TypeScript compilation errors
**Solution**: Check that all dependencies are properly installed

### API Connection Fails

**Error**: CORS errors
**Solution**: Backend should already have CORS configured for Render domains

**Error**: 404 on API calls
**Solution**: Verify the backend URL is correct in environment variables

### Environment Variables Not Working

**Issue**: Frontend still uses localhost
**Solution**: 
1. Check Render environment variables are set
2. Rebuild the site after changing environment variables
3. Clear browser cache

## Expected Results

After successful deployment:

✅ **Frontend loads** at your Render URL  
✅ **API calls work** and connect to backend  
✅ **No console errors** in browser  
✅ **All features function** as expected  

## Next Steps

1. **Set up custom domain** (optional)
2. **Configure automatic deployments** from GitHub
3. **Set up monitoring** and error tracking
4. **Test all features** thoroughly

## Support

If you encounter issues:
1. Check Render build logs
2. Verify environment variables
3. Test backend connectivity directly
4. Check browser console for errors

---

**Your full-stack app should now be fully deployed!** 🚀 