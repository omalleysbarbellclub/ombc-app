import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  root: '.', // tells Vite to start in root folder
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: resolve(__dirname, 'index.html') // CRUCIAL
    }
  }
})
