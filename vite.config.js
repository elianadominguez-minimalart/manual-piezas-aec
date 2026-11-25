import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base './' para que funcione en cualquier subcarpeta (GitHub Pages, hosting interno)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
