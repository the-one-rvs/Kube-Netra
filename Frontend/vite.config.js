import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true,
    allowedHosts: [
      'kubenetra.onrender.com'
    ],
    proxy: {
      '/api': {
        target: process.env.REACT_APP_API_URL || 'https://kubenetra-backend.onrender.com/',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
