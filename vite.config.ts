import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoBase = '/blockchain/'

export default defineConfig({
  plugins: [react()],
  base: repoBase,
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
})
