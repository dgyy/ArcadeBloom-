import { defineConfig } from 'vite'
import { viteSingleFile } from 'vite-plugin-singlefile';
import compressGame from './compress-game-plugin';
import roadroller from './roadroller-plugin';

export default defineConfig({
  build: {
    target: "esnext",
    minify: "esbuild"
  },
  plugins: [
    compressGame(),
    viteSingleFile({
      removeViteModuleLoader: true
    }),
    roadroller()
  ]
});
