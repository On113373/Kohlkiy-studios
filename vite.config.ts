import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/kohlkiy-studios/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          audio: ['howler'],
          ui: ['framer-motion', 'lottie-react']
        }
      }
    }
  }
})
