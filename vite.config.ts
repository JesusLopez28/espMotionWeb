import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Agrega el plugin PWA
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ESP Motion - Detector de Emociones',
        short_name: 'ESP Motion',
        description: 'Plataforma de análisis y seguimiento de emociones en tiempo real',
        theme_color: '#5271ff',
        background_color: '#f8f9fd',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/emotion-icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/emotion-icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/emotion-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
      }
    })
  ],
})
