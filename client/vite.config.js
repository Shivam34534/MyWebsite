import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


import { VitePWA } from 'vite-plugin-pwa'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'bgImage.png', 'logo.svg'], // Caches these heavy images!
      manifest: {
        name: 'Aura Social',
        short_name: 'Aura',
        description: 'Illuminate your digital presence',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/aura_logo_icon.png', // Fallback icon path
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/aura_logo_icon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
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
