const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AliosscdnWebpackPlugin = require('./module')

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: path.join(__dirname, 'demo.js'),
  mode,
  output: {
    path: path.join(__dirname, 'dist/assets'),
  },
  plugins: [
    new HtmlWebpackPlugin({ filename: '../index.html' }), // output file relative to output.path
    new AliosscdnWebpackPlugin({
      https: <boolean>,
      directoryInOss: <directory name>,
      filesPath: <filesPath> // packaged path,
      region: '<Your oss region>',
      accessKeyId: '<Your oss accessKeyId>',
      accessKeySecret: '<Your oss accessKeySecret>',
      bucket: '<Your oss bucket name>'
    })
  ],
};
