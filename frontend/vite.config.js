import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    https: true, // Включает HTTPS
    port: 5173   // Опционально: укажите порт
  }
})