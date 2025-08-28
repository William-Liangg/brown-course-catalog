import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
  define: {
    // Ensure environment variables are available at build time
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://brown-course-catalog.onrender.com')
  }
})
