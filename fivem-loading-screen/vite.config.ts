import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  plugins: [react(), svgr()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src', import.meta.url),
    },
  },
  build: {
    outDir: '../tmf-loadingscreen/web/dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]'
      }
    },
    sourcemap: false,
    emptyOutDir: true,
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
  },
  // Server configuration if needed
  server: {
    port: 3000,
  },
});
