var path = require('path');
const nodeExternals = require('webpack-node-externals');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: ['./src/export.tsx'],
  plugins: [new MiniCssExtractPlugin({filename: "react-chatbotify.css"})],
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.tsx?|\.jsx?|\.js?|\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(jpg|png|wav|svg)$/,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  resolve: {
    extensions: ['.tsx', '.jsx', '.js', '.ts'],
  },
  externals: ['react', 'react-dom', nodeExternals()]
};