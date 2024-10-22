import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src', import.meta.url),
    },
  },
  build: {
    outDir: '../tmf-loadingscreen/web/dist',
    sourcemap: true,
    emptyOutDir: true,
  },

});
