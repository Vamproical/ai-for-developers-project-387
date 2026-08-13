import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/shared': resolve(__dirname, './src/shared'),
      '@/features': resolve(__dirname, './src/features'),
      '@/app': resolve(__dirname, './src/app'),
    },
  },
});
