import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [tsconfigPaths(), viteSingleFile()],
  server: {
    port: 3000,
  },
});
