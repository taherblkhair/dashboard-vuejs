import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/pos/',
  plugins: [vue()],
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