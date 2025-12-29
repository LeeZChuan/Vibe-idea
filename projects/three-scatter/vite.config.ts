import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages / 子目录部署时，使用相对路径引用资源，避免 /assets 这种绝对路径导致 404
  base: './',
})
