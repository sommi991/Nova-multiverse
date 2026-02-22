import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@core': path.resolve(__dirname, './src/core'),
      '@niches': path.resolve(__dirname, './src/niches'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@selector': path.resolve(__dirname, './src/niche-selector'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
  },
  server: {
    port: 3000,
  },
})
