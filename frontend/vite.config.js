import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Proxy API requests to the backend
    }
  }
  // Base path setting to help with Vercel deployment
  base: '/',
  // Build outputs directory
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
