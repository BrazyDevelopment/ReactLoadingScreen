import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({command}) => ({
  plugins: [react()],
  base: command === "build" ? "nui://tmf-loadingscreen/web/dist/" : "/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src', import.meta.url),
    },
  },
  build: {
    outDir: '../tmf-loadingscreen/web/dist',
    // sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name][extname]`,
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
      },
    },
  },

}));