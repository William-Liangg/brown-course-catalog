# Brown Course Catalog

A modern web application for browsing Brown University courses with AI-powered recommendations.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Local Development

**For other users (recommended):**
See [SETUP_FOR_OTHERS.md](SETUP_FOR_OTHERS.md) for a complete setup guide.

**Quick setup:**
```bash
git clone <your-repo-url>
cd brown-course-catalog
./universal-setup.sh
```

**Manual setup:**
1. **Clone and setup environment:**
   ```bash
   git clone <your-repo-url>
   cd brown-course-catalog
   cp env.example .env
   # Edit .env with your database and API keys
   ```

2. **Install dependencies:**
   ```bash
   npm run install-all
   node setup-database.js
   ```

4. **Start development servers:**

   **Terminal 1 - Backend:**
   ```bash
   npm run backend
   ```

   **Terminal 2 - Frontend:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:5173
   - API: http://localhost:3000/api

## ☁️ Deployment

This application is configured for deployment on **Vercel**.

### Deploy to Vercel

1. **Push to GitHub**
2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
3. **Set Environment Variables**
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `JWT_SECRET` - Secret key for JWT authentication
   - `OPENAI_API_KEY` - OpenAI API key (optional)
4. **Deploy** - Vercel will automatically build and deploy

## 📚 Documentation

- [Local Development Guide](LOCAL_DEVELOPMENT.md) - Detailed local setup instructions
- [Backend Documentation](backend/README.md) - API documentation

## 🛠️ Available Scripts

- `npm run dev` - Start frontend development server
- `npm run backend` - Start backend development server
- `npm run build` - Build frontend for production
- `npm run install-all` - Install dependencies for both frontend and backend
- `npm run start` - Start backend in production mode

## 🔧 Environment Variables

Required environment variables (see `env.example`):
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT authentication
- `OPENAI_API_KEY` - OpenAI API key (optional, for AI features)
- `NODE_ENV` - Environment mode (development/production)
- `VITE_API_URL` - Backend API URL for frontend

## 🏗️ Project Structure

```
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend (local dev)
├── api/              # Vercel serverless functions
├── setup-database.js # Database initialization script
└── vercel.json       # Vercel deployment configuration
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## 📄 License

ISC License
