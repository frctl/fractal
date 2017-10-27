const webpack = require('webpack');

const webpackConfig = Object.assign({}, require('./webpack.shared'));

webpackConfig.entry.unshift('webpack-hot-middleware/client');
webpackConfig.plugins = webpackConfig.plugins.concat([
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoEmitOnErrorsPlugin()
]);

module.exports = webpackConfig;
