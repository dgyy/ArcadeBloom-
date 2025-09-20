import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [viteSingleFile()],
  base: './',
  build: {
    polyfillModulePreload: false,
    reportCompressedSize: false,
    assetsInlineLimit: 0,
    minify: 'terser',
    terserOptions: {
      compress: {
        unsafe_arrows: true,
        passes: 2,
      },
      mangle: {
        properties: {
          // Glyph width overrides in font.json need to be preserved.
          keep_quoted: true,
        },
      },
    },
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
})
