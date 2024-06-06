import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname, 'Front-end-Buzzpage'),
  envFile: path.resolve(__dirname, '.env'),
  server: {
    proxy: {
        '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            secure: false,
            ws: true,
        }
    },
    // the following is used only if Vite is not live refreshing your browser
    watch: {
        usePolling: true
    }
  }
})
