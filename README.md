# Brown Course Catalog

A full-stack web application for exploring and customizing Brown University's course offerings, with AI-powered recommendations and intelligent schedule building.

⸻

## Overview

The Brown Course Catalog is a comprehensive platform that allows students to search, explore, and plan their academic journey at Brown University. Built with modern web technologies, it features an intelligent chatbot assistant that provides personalized course recommendations based on student interests and academic goals.

⸻

## Features

• 🔍 **Advanced Course Search** - Search courses by name, professor, department, or keywords
• 🤖 **AI-Powered Chatbot** - BrunoBot provides intelligent course recommendations and answers questions about courses
• 📅 **Schedule Builder** - Create and manage course schedules with time conflict detection
• 👨‍🏫 **Professor Information** - View detailed professor information and course history
• 🏛️ **Department Filtering** - Browse courses by academic department
• 📱 **Mobile Responsive** - Fully optimized for desktop and mobile devices
• 🔐 **User Authentication** - Secure user accounts with JWT-based authentication
• 💾 **Persistent Schedules** - Save and manage multiple course schedules

⸻

## Tech Stack

**Frontend:**
• React + TypeScript
• Tailwind CSS
• Vite

**Backend:**
• Node.js + Express
• PostgreSQL
• JWT Authentication

**AI Integration:**
• OpenAI API
• Intelligent course recommendations

**Deployment:**
• Render (Production)
• Local development support

⸻

## Quick Start

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/William-Liangg/brown-course-catalog.git
   cd brown-course-catalog
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp env.local .env.local
   ```
   
   Configure your `.env.local`:
   ```
   DATABASE_URL=postgresql://localhost:5432/brown_course_catalog_local
   JWT_SECRET=your-secret-key
   NODE_ENV=development
   OPENAI_API_KEY=your-openai-key
   ```

4. **Initialize database**
   ```bash
   createdb brown_course_catalog_local
   npm run setup
   ```

5. **Start the application**
   ```bash
   npm run dev
   ```

6. **Access the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Demo login: `demo@local.test` / `password123`

⸻

## Available Scripts

- `npm run dev` - Start both frontend and backend
- `npm run dev:frontend` - Start frontend only
- `npm run dev:backend` - Start backend only
- `npm run build` - Build for production
- `npm run setup` - Initialize database and demo user

⸻

## Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend services. The React frontend communicates with the Express.js backend through RESTful APIs, while the PostgreSQL database provides reliable data persistence.

⸻

## Contributing

This project represents a complete, production-ready course catalog system. The codebase is structured for maintainability and scalability, with comprehensive error handling and responsive design principles.

