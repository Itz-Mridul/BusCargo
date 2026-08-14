import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'map-vendor': ['leaflet', 'react-leaflet'],
          'qr-vendor': ['qrcode.react', 'html5-qrcode'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // Pre-bundle common deps for faster cold start
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx'],
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios', 'leaflet', 'react-leaflet', 'qrcode.react'],
  },
})
