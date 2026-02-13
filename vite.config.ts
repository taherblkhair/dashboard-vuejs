import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // دمج المكتبات الخارجية لتقليل عدد الطلبات
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1600,
  },
  // هذه الطريقة أسهل وأسرع لحذف ملفات الـ console والـ debugger
  esbuild: {
    drop: ['console', 'debugger'],
  },
})