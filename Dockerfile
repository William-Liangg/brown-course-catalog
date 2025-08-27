# Multi-stage build for BrunoTrack
# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY vite.config.ts ./
COPY tsconfig*.json ./
COPY tailwind.config.js ./
COPY postcss.config.* ./
COPY eslint.config.js ./

# Clear npm cache and install frontend dependencies
RUN npm cache clean --force && npm ci

# Copy frontend source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Build frontend with timestamp to force cache invalidation
RUN echo "Build timestamp: $(date)" && npm run build

# Stage 2: Backend setup
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Clear npm cache and install backend dependencies
RUN npm cache clean --force && npm ci

# Copy backend source code
COPY backend/ ./

# Stage 3: Production image
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy built frontend from stage 1 to /app/dist (where backend expects it)
COPY --from=frontend-builder /app/dist ./dist

# Copy backend from stage 2
COPY --from=backend-builder /app/backend ./backend
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy package files for potential runtime dependencies
COPY package*.json ./
COPY backend/package*.json ./backend/

# Install production dependencies for runtime
RUN npm ci --only=production
RUN cd backend && npm ci --only=production

# Set ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to nodejs user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "backend/server.cjs"] 