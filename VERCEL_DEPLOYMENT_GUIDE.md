# 🚀 Vercel Deployment Guide for Brown Course Catalog

## 📋 Prerequisites

- [Vercel CLI](https://vercel.com/docs/cli) installed
- [PostgreSQL database](https://render.com/docs/databases) (Render, Supabase, or Neon)
- [GitHub repository](https://github.com) connected to Vercel

## 🔧 Environment Variables Setup

### **Production Environment Variables (Vercel Dashboard)**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```bash
# Required Variables
DATABASE_URL=postgres://username:password@host:port/database?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=production

# Optional Variables (if using AI features)
OPENAI_API_KEY=your-openai-api-key-here
```

### **Local Development Environment Variables**

1. Copy `env.example` to `.env.local`:
```bash
cp env.example .env.local
```

2. Update `.env.local` with your local values:
```bash
DATABASE_URL=postgres://username:password@localhost:5432/brown_course_catalog
JWT_SECRET=your-local-jwt-secret
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

## 🏗️ Project Structure

```
/
├── api/                    # Vercel serverless functions
│   ├── lib/               # Shared utilities
│   │   ├── cors.js        # CORS middleware
│   │   └── db.js          # Database connection
│   ├── courses.js         # Courses API
│   ├── signup.js          # User signup
│   ├── login.js           # User login
│   ├── me.js              # Get user data
│   ├── logout.js          # User logout
│   ├── test.js            # Test endpoint
│   └── package.json       # API dependencies
├── frontend/              # Vite React frontend
│   ├── src/
│   │   └── config/
│   │       └── api.ts     # API configuration
│   └── package.json
├── vercel.json            # Vercel configuration
└── package.json           # Root package.json
```

## 🚀 Deployment Steps

### **1. Initial Deployment**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### **2. Set Environment Variables**

After deployment, set your environment variables in the Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all required variables (see above)

### **3. Redeploy with Environment Variables**

```bash
vercel --prod
```

## 🧪 Testing Your Deployment

### **1. Test API Endpoints**

```bash
# Test the test endpoint
curl https://your-domain.vercel.app/api/test

# Test courses endpoint
curl https://your-domain.vercel.app/api/courses

# Test CORS preflight
curl -X OPTIONS https://your-domain.vercel.app/api/courses \
  -H "Origin: https://brown-course-catalog.vercel.app" \
  -H "Access-Control-Request-Method: GET"
```

### **2. Test Frontend**

1. Visit your deployed frontend URL
2. Open browser developer tools
3. Check for any CORS errors in the console
4. Test user registration and login

### **3. Database Connection Test**

The `/api/test` endpoint will show:
- Database connection status
- Environment variables
- CORS configuration

## 🔍 Troubleshooting

### **CORS Issues**

1. Check that your frontend URL is in the allowed origins
2. Verify CORS middleware is running
3. Check browser console for specific error messages

### **Database Connection Issues**

1. Verify `DATABASE_URL` is set correctly
2. Check SSL configuration for cloud databases
3. Test database connection with `/api/test` endpoint

### **Authentication Issues**

1. Verify `JWT_SECRET` is set
2. Check cookie settings for production
3. Ensure HTTPS is used in production

### **API Not Found (404)**

1. Check `vercel.json` configuration
2. Verify API files are in the correct location
3. Check deployment logs for build errors

## 📊 Monitoring

### **Vercel Dashboard**

- **Functions**: Monitor serverless function performance
- **Analytics**: Track frontend usage
- **Logs**: View real-time function logs

### **Database Monitoring**

- Monitor connection pool usage
- Check query performance
- Set up alerts for connection issues

## 🔄 Continuous Deployment

### **Automatic Deployments**

1. Connect your GitHub repository to Vercel
2. Push changes to `main` branch
3. Vercel will automatically deploy

### **Preview Deployments**

- Create pull requests for feature branches
- Vercel creates preview deployments
- Test changes before merging

## 📝 Local Development

### **Running Locally**

```bash
# Install dependencies
npm install

# Start local development
vercel dev

# Or run frontend separately
cd frontend
npm run dev
```

### **Testing Local API**

```bash
# Test local API
curl http://localhost:3000/api/test

# Test with CORS
curl -X OPTIONS http://localhost:3000/api/courses \
  -H "Origin: http://localhost:5173"
```

## 🛡️ Security Considerations

1. **Environment Variables**: Never commit secrets to Git
2. **CORS**: Only allow necessary origins
3. **JWT**: Use strong, unique secrets
4. **Database**: Use SSL connections
5. **Cookies**: Set appropriate security flags

## 📞 Support

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)
- [PostgreSQL on Vercel](https://vercel.com/docs/storage/vercel-postgres) 