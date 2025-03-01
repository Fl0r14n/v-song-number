import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import fs from 'fs'

let key, cert

try {
  key = fs.readFileSync('.cert/key.pem')
  cert = fs.readFileSync('.cert/cert.pem')
} catch {
  /* empty */
}

const https =
  (key &&
    cert && {
      key,
      cert
    }) ||
  undefined

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: {
        // enabled: true
      },
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'SongNumber',
        short_name: 'song-number',
        description: 'A small mobile app that will allow user to set a song number from a list of song books and cast it.',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/icon/icon-192.webp',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon/icon-512.webp',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 4200,
    strictPort: true,
    https
  }
})
