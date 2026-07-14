import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Must match PORT in server/.env (default 3000)
  const env = loadEnv(mode, process.cwd(), '')
  const apiPort = env.VITE_API_PORT || '3000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${apiPort}`,
          changeOrigin: true,
        },
      },
    },
  }
})
