import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ command, mode, isPreview }) => {
  const config = { plugins: [react()] }

  if (command !== 'serve' || isPreview === true) {
    return config
  }

  const env = loadEnv(mode, process.cwd(), 'TMDB_')
  const token = env.TMDB_READ_ACCESS_TOKEN?.trim()

  if (!token) {
    throw new Error('Defina TMDB_READ_ACCESS_TOKEN no arquivo .env.local.')
  }

  return {
    ...config,
    server: {
      proxy: {
        '^/api/tmdb/': {
          target: 'https://api.themoviedb.org',
          changeOrigin: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
          rewrite: (path: string) => path.replace(/^\/api\/tmdb\//, '/3/'),
        },
      },
    },
  }
})
