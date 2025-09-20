import svg from 'vite-plugin-svgo';
import {rollupPluginSpglsl} from 'spglsl';

// @ts-ignore
import {
    advzipPlugin,
    defaultViteBuildOptions,
    defaultRollupOptions,
    ectPlugin,
    roadrollerPlugin,
    googleClosurePlugin
} from 'js13k-vite-plugins';
// @ts-ignore
import kontra from 'rollup-plugin-kontra';
import {defineConfig} from 'vite';

export default defineConfig({
    build: defaultViteBuildOptions,
    plugins: [
        svg({
            multipass: true,
        }),
        rollupPluginSpglsl({
            minify: true,
            mangle: true,
        }),
        roadrollerPlugin(),
        ectPlugin(),
        kontra({
            gameObject: {
                scale: true,
                group: true,
                anchor: true,
                rotation: true,
                opacity: true
            },
            sprite: {
                animation: true,
            },
            vector: {
                normalize: true,
                distance: true,
                angle: true,
            },
            text: {
                align: true,
                newline: true,
                autoNewline: true,
            },
            debug: false
        }),
    ],
});