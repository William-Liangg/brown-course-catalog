# Brown Course Catalog API - Vercel Serverless Functions

This backend has been refactored to work as Vercel serverless functions with proper CORS handling, database connections, and comprehensive logging.

## 🚀 Features

- **Vercel Serverless Functions**: All API endpoints run as serverless functions under `/api/`
- **CORS Support**: Proper CORS handling for frontend integration
- **PostgreSQL Database**: SSL-enabled database connections
- **Comprehensive Logging**: Detailed request/response logging
- **Authentication**: JWT-based authentication with HTTP-only cookies
- **Local Development**: Compatible with local development using Express wrapper

## 📁 File Structure

```
backend/
├── api/
│   ├── init-middleware.js     # CORS middleware helper
│   ├── courses.js            # GET /api/courses
│   ├── signup.js             # POST /api/signup
│   ├── login.js              # POST /api/login
│   ├── me.js                 # GET /api/me
│   └── logout.js             # POST /api/logout
├── models/
│   └── db.cjs               # Database connection and queries
├── server-local.cjs         # Local development Express wrapper
└── package.json
```

## 🔧 API Endpoints

### GET /api/courses
- **Purpose**: Fetch all courses from the database
- **Method**: GET
- **Response**: `{ courses: [...] }`
- **CORS**: ✅ Supported

### POST /api/signup
- **Purpose**: Create a new user account
- **Method**: POST
- **Body**: `{ email, password, name }`
- **Response**: `{ message, user: { id, email, name } }`
- **CORS**: ✅ Supported

### POST /api/login
- **Purpose**: Authenticate user and create session
- **Method**: POST
- **Body**: `{ email, password }`
- **Response**: `{ message, user: { id, email, name } }`
- **CORS**: ✅ Supported

### GET /api/me
- **Purpose**: Get current user information
- **Method**: GET
- **Auth**: Requires JWT token in cookie
- **Response**: `{ user: { id, email, name } }`
- **CORS**: ✅ Supported

### POST /api/logout
- **Purpose**: Clear user session
- **Method**: POST
- **Response**: `{ message }`
- **CORS**: ✅ Supported

## 🌐 CORS Configuration

The API supports the following origins:
- **Local Development**: `http://localhost:3000`, `http://localhost:5173`, `http://localhost:5174`
- **Production**: `https://brown-course-catalog.vercel.app`
- **Vercel Deployments**: All Vercel deployment URLs

CORS features:
- ✅ Preflight OPTIONS requests handled
- ✅ Credentials mode supported
- ✅ Content-Type headers allowed
- ✅ GET, POST, OPTIONS methods allowed

## 🗄️ Database Configuration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `JWT_SECRET`: Secret key for JWT tokens (required)
- `NODE_ENV`: Environment mode (`development` or `production`)

### SSL Configuration
- **Development**: SSL disabled
- **Production**: SSL required with `sslmode=require`

### Connection Pool
- **Max Connections**: 5 (optimized for serverless)
- **Connection Timeout**: 5 seconds
- **Idle Timeout**: 10 seconds

## 📊 Logging

Each API endpoint includes comprehensive logging:

### Request Logging
- HTTP method and URL
- Request headers (user-agent, origin, content-type)
- Request body (for POST requests)
- Timestamp

### Database Logging
- Query text and parameters
- Query duration
- Row count and sample data
- Error details with stack traces

### Response Logging
- Response status code
- Response data summary
- Timestamp

## 🚀 Deployment

### Vercel Deployment
1. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `NODE_ENV`: `production`

2. Deploy using Vercel CLI:
   ```bash
   vercel --prod
   ```

### Local Development
1. Create `.env.local` file with your local database URL
2. Run the local development server:
   ```bash
   cd backend && npm start
   ```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **CORS Protection**: Restricts cross-origin requests
- **Input Validation**: Validates all request data
- **Error Handling**: Secure error responses without sensitive data

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure your frontend URL is in the allowed origins list
2. **Database Connection**: Verify `DATABASE_URL` is set correctly
3. **SSL Issues**: Ensure `sslmode=require` is in your production database URL
4. **Authentication**: Check that JWT_SECRET is set in production

### Debug Mode
Enable detailed logging by setting `NODE_ENV=development` in your environment variables.

## 📝 Environment Variables Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | Yes | PostgreSQL connection string | `postgresql://user:pass@host:port/db?sslmode=require` |
| `JWT_SECRET` | Yes | Secret key for JWT tokens | `your-secret-key-here` |
| `NODE_ENV` | No | Environment mode | `production` or `development` |

## 🔄 Migration from Express

This refactored version maintains the same API interface as the original Express backend, so no frontend changes are required. The main differences are:

- Serverless function architecture
- Enhanced CORS handling
- Improved logging
- Better error handling
- Optimized database connections for serverless
