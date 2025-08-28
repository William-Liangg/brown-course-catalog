# 🚀 Vercel Deployment Guide

## ✅ Migration Complete!

Your app has been successfully migrated from Render to Vercel with serverless functions.

## 📁 New Structure

```
brown-course-catalog/
├── backend/
│   ├── api/                    # Vercel serverless functions
│   │   ├── courses.js         # GET /api/courses
│   │   ├── signup.js          # POST /api/signup
│   │   ├── login.js           # POST /api/login
│   │   ├── me.js              # GET /api/me
│   │   └── logout.js          # POST /api/logout
│   ├── models/
│   │   └── db.cjs             # Database connection (optimized for serverless)
│   └── package.json           # API dependencies
├── frontend/                   # Vite React app
├── vercel.json                # Vercel configuration
└── VERCEL_DEPLOYMENT.md       # This file
```

## 🔧 Environment Variables

### Production (Vercel Dashboard)
```
DATABASE_URL=postgresql://your-db-url-with-ssl
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-key
NODE_ENV=production
```

### Local Development (.env.local)
```
DATABASE_URL=postgresql://synonymrolls@localhost:5432/brown_course_catalog
JWT_SECRET=your-local-jwt-secret
OPENAI_API_KEY=sk-dummy-key-for-local-development
NODE_ENV=development
```

## 🚀 Deploy to Vercel

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. Set Environment Variables
- Go to Vercel Dashboard
- Navigate to your project
- Go to Settings → Environment Variables
- Add all production environment variables

### 5. Redeploy with Environment Variables
```bash
vercel --prod
```

## 🔍 API Endpoints

All endpoints are now available at `/api/`:

- `GET /api/courses` - Get all courses
- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `GET /api/me` - Get current user
- `POST /api/logout` - User logout

## 🧪 Local Development

### Backend (API Routes)
```bash
cd backend
npm install
vercel dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📊 Logging

All API routes include comprehensive logging:
- Request details (method, headers, body)
- Database queries with timing
- Success/error responses
- JWT token operations

Logs are available in:
- **Local**: Terminal output
- **Production**: Vercel Function Logs

## 🔒 Security Features

- ✅ CORS configured for all origins
- ✅ JWT authentication with secure cookies
- ✅ Password hashing with bcrypt
- ✅ SSL database connections
- ✅ Input validation and sanitization

## 🎯 Next Steps

1. **Deploy to Vercel** using the steps above
2. **Set environment variables** in Vercel dashboard
3. **Test all endpoints** to ensure functionality
4. **Update frontend** to use new API URLs
5. **Monitor logs** for any issues

## 🆘 Troubleshooting

### Common Issues:
- **Database Connection**: Ensure `DATABASE_URL` includes SSL parameters
- **CORS Errors**: Check that frontend URL is allowed
- **JWT Issues**: Verify `JWT_SECRET` is set correctly
- **Function Timeouts**: Check database query performance

### Debug Commands:
```bash
# Test database connection
curl -X GET "https://your-vercel-url.vercel.app/api/courses"

# Test authentication
curl -X POST "https://your-vercel-url.vercel.app/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

Your app is now ready for Vercel deployment! 🎉 