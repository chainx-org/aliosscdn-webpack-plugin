const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ChainxCdnWebpackPlugin = require('./module')

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: path.join(__dirname, 'demo.js'),
  mode,
  output: {
    path: path.join(__dirname, 'dist/assets'),
    // publicPath: '/assets',
    // filename: 'app.js',
  },
  plugins: [
    new HtmlWebpackPlugin({ filename: '../index.html' }), // output file relative to output.path
    new ChainxCdnWebpackPlugin({
      filesPath: 'd://practice/chainx-dapp-wallet-v3/packages/apps/build'
    })
  ],
};
