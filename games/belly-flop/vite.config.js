import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [],
  build: {
    minify: 'terser',
    terserOptions: {
      /*
      mangle: {
        module: true,
        properties: {
          debug: true,
          keep_quoted: 'strict',
          reserved: ['P', 'if', 'else']
        }
      }
      */
    },
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].min.js',
      }
    }
  }
})
