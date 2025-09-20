import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import mkcert from'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: true
  },
  plugins: [mkcert(), svelte()],
  build: {
    minify: 'terser',
    cssMinify: 'esbuild',
    modulePreload: false,
    target: 'esnext',
    assetsInlineLimit: 0,
    terserOptions: {
      parse: {
        html5_comments: false,
      },
      compress: {
        drop_console: true,
        drop_debugger: true,
        ecma: 2020,
        keep_infinity: true,
        module: true,
        passes: 5,
        unsafe_arrows: true,
        unsafe_math: true,
        unsafe_methods: true,
      },
      mangle: {
        module: true,
      },
      format: {
        comments: false,
        ecma: 2020,
      }
    },
    rollupOptions: {
      external: ['aframe'],
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined!,
      }
    },
  },
})
