import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'recharts'],
          'state-vendor': ['zustand', 'immer'],
          'dnd-vendor': ['react-dnd', 'react-dnd-html5-backend', 'react-dnd-touch-backend', '@hello-pangea/dnd'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@niches': path.resolve(__dirname, './src/niches'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@selector': path.resolve(__dirname, './src/niche-selector'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
})
