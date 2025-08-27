# 🚀 BrunoTrack Deployment Guide

This guide provides step-by-step instructions for deploying BrunoTrack to various cloud platforms.

## 📋 Prerequisites

- Docker and Docker Compose installed
- Git repository access
- Environment variables configured
- Domain name (optional but recommended)

## 🐳 Local Docker Deployment

### 1. Environment Setup

```bash
# Copy environment template
cp env.example .env

# Edit .env with your actual values
nano .env
```

**Required Environment Variables:**
- `JWT_SECRET`: Long, random string for JWT token signing
- `OPENAI_API_KEY`: Your OpenAI API key
- `POSTGRES_PASSWORD`: Secure database password

### 2. Build and Deploy

```bash
# Make deployment script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 3. Verify Deployment

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f

# Test endpoints
curl http://localhost/health
curl http://localhost/api
```

## ☁️ Cloud Platform Deployments

### Option 1: Render (Recommended)

Render provides free PostgreSQL databases and easy deployment.

#### 1. Create Render Account
- Sign up at [render.com](https://render.com)
- Connect your GitHub repository

#### 2. Create PostgreSQL Database
1. Go to Dashboard → New → PostgreSQL
2. Name: `bruno-track-db`
3. Database: `bruno_track`
4. User: `bruno_user`
5. Copy the **Internal Database URL**

#### 3. Deploy Web Service
1. Go to Dashboard → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Name**: `bruno-track`
   - **Environment**: `Docker`
   - **Branch**: `main`
   - **Build Command**: `docker build -t bruno-track .`
   - **Start Command**: `docker run -p $PORT:3001 bruno-track`

#### 4. Environment Variables
Add these in Render dashboard:
```
NODE_ENV=production
PORT=3001
DATABASE_URL=<your_postgres_internal_url>
JWT_SECRET=<your_jwt_secret>
OPENAI_API_KEY=<your_openai_key>
```

#### 5. Deploy
- Click "Create Web Service"
- Wait for build and deployment
- Your app will be available at: `https://your-app-name.onrender.com`

### Option 2: Railway

Railway provides simple deployment with automatic HTTPS.

#### 1. Setup
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login
```

#### 2. Deploy
```bash
# Initialize Railway project
railway init

# Add environment variables
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=<your_jwt_secret>
railway variables set OPENAI_API_KEY=<your_openai_key>

# Deploy
railway up
```

#### 3. Add PostgreSQL
1. Go to Railway dashboard
2. Add PostgreSQL service
3. Copy connection string to `DATABASE_URL`

### Option 3: Fly.io

Fly.io provides global deployment with edge locations.

#### 1. Setup
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login
```

#### 2. Create App
```bash
# Create fly.toml
fly launch

# Add PostgreSQL
fly postgres create
fly postgres attach <your-postgres-app>
```

#### 3. Deploy
```bash
# Set secrets
fly secrets set JWT_SECRET=<your_jwt_secret>
fly secrets set OPENAI_API_KEY=<your_openai_key>

# Deploy
fly deploy
```

### Option 4: DigitalOcean App Platform

#### 1. Create App
1. Go to DigitalOcean App Platform
2. Connect your GitHub repository
3. Choose "Docker" as source type

#### 2. Configure
- **Build Command**: `docker build -t bruno-track .`
- **Run Command**: `docker run -p $PORT:3001 bruno-track`

#### 3. Environment Variables
Add in App Platform dashboard:
- `NODE_ENV=production`
- `JWT_SECRET=<your_secret>`
- `OPENAI_API_KEY=<your_key>`

#### 4. Add Database
1. Create managed PostgreSQL database
2. Add `DATABASE_URL` environment variable

## 🔧 Production Optimizations

### 1. Custom Domain Setup

#### Render
1. Go to your web service
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Update DNS records

#### Railway
```bash
# Add custom domain
railway domain add yourdomain.com
```

#### Fly.io
```bash
# Add custom domain
fly certs add yourdomain.com
```

### 2. Environment Variables for Production

Update your `.env` file:
```bash
# Production settings
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Security
JWT_SECRET=<very_long_random_string>
OPENAI_API_KEY=<your_openai_key>

# Database
DATABASE_URL=<your_production_db_url>
```

### 3. Database Migration

```bash
# Run database migrations
docker-compose exec app node backend/scripts/embedCourses.js
```

## 🔍 Verification Steps

### 1. Health Check
```bash
curl https://yourdomain.com/health
# Should return: healthy
```

### 2. API Test
```bash
curl https://yourdomain.com/api
# Should return: {"message":"API running"}
```

### 3. Frontend Test
- Visit your domain in browser
- Should load the React app
- Test login/signup functionality

### 4. Database Connection
```bash
# Check database logs
docker-compose logs postgres
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Failed
```bash
# Check database URL
echo $DATABASE_URL

# Test connection
docker-compose exec app node -e "
const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL);
client.connect().then(() => console.log('DB connected')).catch(console.error);
"
```

#### 2. JWT Secret Issues
```bash
# Generate new JWT secret
openssl rand -base64 32
```

#### 3. OpenAI API Issues
```bash
# Test OpenAI connection
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
  https://api.openai.com/v1/models
```

#### 4. Port Conflicts
```bash
# Check what's using port 3001
lsof -i :3001

# Change port in docker-compose.yml
```

### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f postgres

# Access container shell
docker-compose exec app sh
```

## 📊 Monitoring

### 1. Health Checks
- `/health` endpoint for basic health
- Docker health checks configured
- Database connection monitoring

### 2. Logs
- Application logs via Docker
- Nginx access/error logs
- Database logs

### 3. Performance
- Monitor container resource usage
- Database query performance
- API response times

## 🔒 Security Checklist

- [ ] JWT_SECRET is long and random
- [ ] OPENAI_API_KEY is secure
- [ ] Database password is strong
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Rate limiting is active
- [ ] Security headers are set
- [ ] Environment variables are not in code

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section
2. Review logs with `docker-compose logs`
3. Verify environment variables
4. Test database connectivity
5. Check platform-specific documentation

---

**Happy Deploying! 🎉** 