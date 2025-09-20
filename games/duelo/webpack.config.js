const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlInlineScriptPlugin = require('html-inline-script-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './src/main.ts',
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        hot: true,
        liveReload: true,
        allowedHosts: 'all',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: './index.html',
            inject: 'body',
            minify: {
                collapseWhitespace: true,
                minifyCSS: true,
            },
        }),
        //new HtmlInlineScriptPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                use: [{ loader: path.resolve('tools/svg-loader.js') }],
            },
            {
                test: /\.(vert|frag)$/,
                use: [{ loader: path.resolve('tools/glsl-loader.js') }],
            },
            {
                test: /game\.html$/i,
                use: 'html-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.png', '.glsl'],
    },
};
