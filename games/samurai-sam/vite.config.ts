import { js13kViteConfig } from 'js13k-vite-plugins';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 9090,
    proxy: {
      '/api': {
        target: 'http://localhost:9999/.netlify/functions/collection',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  ...js13kViteConfig({
    closureOptions: false,
  }),
});
