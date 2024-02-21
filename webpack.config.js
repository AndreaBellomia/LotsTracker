const path = require("path");
const BundleTracker = require("webpack-bundle-tracker");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    frontend: "./react_app/src/index.js",
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'react_app/src'), // Assumi che le tue librerie siano nella directory 'src'
      'node_modules': path.resolve(__dirname, 'node_modules') // Alias per il percorso dei moduli nodejs
    }
  },
  output: {
    path: path.resolve("./django/app/frontend/static/frontend/"),
    filename: "[name]-react.js",
    publicPath: "/static/frontend/",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleTracker({
      path: __dirname,
      filename: "./django/webpack-stats.json",
    }),
  ],
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: ["babel-loader"],
      // },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
