const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    entry: './main.js',
  },
  output: {
    filename: 'main.bundle.js', // Ім'я файлу бандлу
    path: path.resolve(__dirname, 'dist'), // Папка для виводу бандлу (створіть папку 'dist' у корені вашого проекту)
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.bundle.css', // Ваш мініфікований CSS файл
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin(), // Мініфікація JavaScript
      new CssMinimizerPlugin(), // Мініфікація CSS
    ],
  },
};
