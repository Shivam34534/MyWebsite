import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    // keep host/port as needed
    watch: {
      // ignore OneDrive and common noisy dirs/files
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.vite/**',
        '**/.cache/**',
        '**/*.tmp',
        '**/Thumbs.db',
        '**/desktop.ini',
        '**/*.crdownload',
      ],
    },

  },
})
