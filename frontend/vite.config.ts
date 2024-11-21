import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
      watch:{
        usePolling: true,
        },
      host:true,
      strictPort:true,
      port:5173
      },
      css: {
        preprocessorOptions: {
          scss: {
            api: 'modern-compiler',
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src')
        }
      },
  })