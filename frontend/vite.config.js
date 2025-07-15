import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Ajout automatique de PostCSS config
export default defineConfig({
  plugins: [react()],
})
