import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'
import viteImagemin from 'vite-plugin-imagemin'


let colors = [
  'background',
  'darkblue',
  'light',
  'lightblue',
  'darkblue',
  'red',
  'darkred',
  'green',
  'purple',
  'darkpurple',
  'lightpurple'
]



let reserved = [...['experience', '_scheds', '_elapsed', 'from_code', 'cluster', 'make', 'current_frame', '_current_frame', 'ticks_per_second', '__elapsed', 'hline', 'vline', 'seconds', 'hex', 'css', 'h', 'lerp', '_music_onoff', 'time_left'], ...colors]

export default defineConfig({
  base: './',
  plugins: [glsl(), viteImagemin({
    optipng: { optimizationLevel: 7 }
  })],
  build: {
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
