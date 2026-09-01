import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: false,
    allowedHosts: true,
    hmr: { overlay: false },
    fs: { strict: false },
  },
  optimizeDeps: { exclude: [] },
  build: { outDir: 'dist', sourcemap: false },
})
