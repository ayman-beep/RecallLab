import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Allow the sandbox preview host (and any *.e2b.app proxy) to reach the dev
    // server. Local development is unaffected: localhost is always permitted.
    allowedHosts: ['.e2b.app', '.arena.ai', 'localhost'],
  },
})
