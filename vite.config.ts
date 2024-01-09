import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import viteBasicSslPlugin from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    viteBasicSslPlugin(),
    vue()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  server: {
    port: 4200,
    strictPort: true,
    https: true
  }
})
