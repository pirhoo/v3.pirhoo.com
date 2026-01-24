import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
    Icons({ compiler: 'vue3' })
  ],
  test: {
    environment: 'jsdom',
    globals: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue3-masonry-css': fileURLToPath(new URL('./node_modules/vue3-masonry-css/dist/vue3-masonry.es.js', import.meta.url))
    }
  }
})
