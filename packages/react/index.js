'use strict';

const { PathProvider } = require('./src/components');

module.exports = require('./src/adapter');
module.exports.PathProvider = PathProvider;
module.exports.PathContext = PathProvider.PathContext;
module.exports.usePath = PathProvider.usePath;
