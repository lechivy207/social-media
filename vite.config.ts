import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/social-media/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
