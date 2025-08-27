# 🚀 BrunoTrack Quick Start Guide

## ⚡ Deploy in 5 Minutes

### 1. Setup Environment
```bash
# Copy environment template
cp env.example .env

# Edit with your values
nano .env
```

**Required in .env:**
- `JWT_SECRET` (generate with: `openssl rand -base64 32`)
- `OPENAI_API_KEY` (from OpenAI dashboard)
- `POSTGRES_PASSWORD` (any secure password)

### 2. Deploy Locally
```bash
# Run deployment script
./deploy.sh
```

### 3. Access Your App
- 🌐 Frontend: http://localhost
- 🔧 API: http://localhost/api
- 📊 Health: http://localhost/health

## ☁️ Deploy to Cloud (Render - Free)

### 1. Push to GitHub
```bash
git push origin main
```

### 2. Render Setup
1. Go to [render.com](https://render.com)
2. Connect your GitHub repo
3. Create PostgreSQL database
4. Create Web Service with Docker
5. Add environment variables from your .env file

### 3. Your app will be live at:
`https://your-app-name.onrender.com`

## 🔧 Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# Check status
docker-compose ps

# Access container
docker-compose exec app sh
```

## 🚨 Troubleshooting

**Database connection failed?**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View database logs
docker-compose logs postgres
```

**App not starting?**
```bash
# Check app logs
docker-compose logs app

# Verify environment variables
docker-compose exec app env | grep -E "(JWT|OPENAI|DATABASE)"
```

**Port already in use?**
```bash
# Check what's using port 3001
lsof -i :3001

# Change port in docker-compose.yml
```

## 📚 Full Documentation

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions for all cloud platforms.

---

**Need help?** Check the troubleshooting section in DEPLOYMENT.md 