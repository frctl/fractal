const webpack = require('webpack');

const webpackConfig = Object.assign({}, require('./webpack.shared'));

webpackConfig.plugins = webpackConfig.plugins.concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  })
]);

module.exports = webpackConfig;
