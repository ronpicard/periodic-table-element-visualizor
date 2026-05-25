import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Production builds use the repo name as the GitHub Pages base path.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/periodic-table-element-visualizor/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber'],
  },
}));
