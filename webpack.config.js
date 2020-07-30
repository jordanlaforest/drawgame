var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './client/index.jsx',
  mode: 'development',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public')
  },
  context: __dirname,
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-react'
            ],
            plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-regenerator'],
            cacheDirectory: true
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin()
  ]
};