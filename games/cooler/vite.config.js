import { defineConfig } from 'vite'
import viteImagemin from 'vite-plugin-imagemin'

let colors = []
let reserved = [...['_current_frame'], ...colors]

export default defineConfig({
  base: './',
  plugins: [viteImagemin({
    optipng: { optimizationLevel: 7 }
  })],
  build: {
    assetsInlineLimit: 0,
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      mangle: {
        module: true,
        properties: {
          //debug: true,
          keep_quoted: 'strict',
          reserved
        }
      }
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