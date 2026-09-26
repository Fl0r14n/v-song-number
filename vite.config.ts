// import { VitePWA } from 'vite-plugin-pwa'
import fs from 'node:fs'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

let key: Buffer | undefined, cert: Buffer | undefined
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

export default defineConfig({
  plugins: [
    vue()
    // VitePWA({
    //   injectRegister: 'auto',
    //   registerType: 'autoUpdate',
    //   devOptions: {
    //     // enabled: true
    //   },
    //   includeAssets: ['favicon.png', 'apple-touch-icon.png', 'mask-icon.svg'],
    //   manifest: {
    //     name: 'SongNumber',
    //     short_name: 'song-number',
    //     description: 'A small mobile app that will allow user to set a song number from a list of song books and cast it.',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: '/icon/icon-192.webp',
    //         sizes: '192x192',
    //         type: 'image/png'
    //       },
    //       {
    //         src: '/icon/icon-512.webp',
    //         sizes: '512x512',
    //         type: 'image/png'
    //       }
    //     ]
    //   }
    // })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // single vendor chunk loaded from the device in the native app; ~0.8 MB is expected
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      // Ionic 9 added an `exports` map to @ionic/core, so rolldown no longer picks up the
      // `sideEffects: false` in @ionic/core/components/package.json and bundles every component
      treeshake: { moduleSideEffects: id => !/[\\/]@ionic[\\/]core[\\/]components[\\/]/.test(id) }
    }
  },
  server: {
    host: true,
    port: 3000,
    https,
    hmr: {
      host: 'vite.local.dev',
      port: 3000,
      protocol: 'wss'
    }
  }
})
