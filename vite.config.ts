
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080
  },
  optimizeDeps: {
    include: ['xlsx', 'papaparse']
  },
  build: {
    commonjsOptions: {
      include: [/xlsx/, /node_modules/]
    },
    rollupOptions: {
      // Ensure that XLSX is properly bundled
      output: {
        manualChunks: {
          xlsx: ['xlsx'],
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
