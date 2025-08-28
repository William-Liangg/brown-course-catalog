# 🛠️ Troubleshooting Guide

This guide helps resolve common issues when setting up the Brown Course Catalog locally.

## 🚨 Common Installation Errors

### 1. Node.js Version Issues

**Error**: `npm ERR! code ENOENT` or version-related errors

**Solution**:
```bash
# Check your Node.js version
node --version

# Should be 18.0.0 or higher
# If not, update Node.js from https://nodejs.org/
```

### 2. Permission Errors

**Error**: `npm ERR! EACCES: permission denied`

**Solution**:
```bash
# On macOS/Linux, use sudo (not recommended for npm)
sudo npm install

# Better solution - fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc

# Then install without sudo
npm install
```

### 3. Network/Proxy Issues

**Error**: `npm ERR! network timeout` or `ECONNREFUSED`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Try with a different registry
npm config set registry https://registry.npmjs.org/

# If behind a proxy, configure npm
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

### 4. Port Already in Use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
```bash
# Find what's using the port
lsof -i :3000
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use different ports
# Backend: PORT=3001 npm run backend
# Frontend: npm run dev -- --port 5174
```

## 🔧 Step-by-Step Clean Installation

If you're still having issues, try this clean installation:

### 1. Clear Everything
```bash
# Remove all node_modules and lock files
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf api/node_modules api/package-lock.json

# Clear npm cache
npm cache clean --force
```

### 2. Install Dependencies One by One
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..

# Install backend dependencies
cd backend
npm install
cd ..

# Install API dependencies
cd api
npm install
cd ..
```

### 3. Alternative: Use Yarn
If npm continues to fail, try using Yarn:

```bash
# Install Yarn
npm install -g yarn

# Install dependencies with Yarn
yarn install
cd frontend && yarn install && cd ..
cd backend && yarn install && cd ..
cd api && yarn install && cd ..
```

## 🐛 Specific Error Solutions

### React Version Conflicts
**Error**: `peer dependency` warnings for React

**Solution**:
```bash
# Force install specific versions
npm install react@^19.1.0 react-dom@^19.1.0 --force
```

### TypeScript Errors
**Error**: TypeScript compilation errors

**Solution**:
```bash
# Reinstall TypeScript
cd frontend
npm uninstall typescript
npm install typescript@~5.8.3
cd ..
```

### Database Connection Issues
**Error**: `ECONNREFUSED` when connecting to database

**Solution**:
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql  # macOS
sudo systemctl status postgresql      # Linux

# Start PostgreSQL if needed
brew services start postgresql        # macOS
sudo systemctl start postgresql       # Linux
```

### Environment Variables
**Error**: `DATABASE_URL is not defined`

**Solution**:
```bash
# Make sure .env file exists
cp env.example .env

# Check if variables are loaded
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

## 📋 Pre-Installation Checklist

Before running `npm run install-all`, ensure:

- [ ] Node.js v18+ is installed
- [ ] npm is up to date (`npm install -g npm@latest`)
- [ ] PostgreSQL is installed and running
- [ ] You have a stable internet connection
- [ ] No antivirus is blocking npm
- [ ] You have sufficient disk space

## 🔍 Debug Commands

```bash
# Check Node.js and npm versions
node --version
npm --version

# Check npm configuration
npm config list

# Check for global packages that might conflict
npm list -g --depth=0

# Test npm installation
npm doctor

# Check disk space
df -h

# Check memory usage
free -h  # Linux
vm_stat  # macOS
```

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the error message carefully** - copy the exact error
2. **Try the clean installation** steps above
3. **Check your Node.js version** - must be 18+
4. **Try using Yarn** instead of npm
5. **Check your internet connection** and firewall settings

## 🎯 Quick Fix Commands

```bash
# Most common fix - clean install
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# If that doesn't work, try yarn
npm install -g yarn
yarn install

# If still having issues, check Node.js version
node --version  # Should be 18+
``` 