const ApiServer = require('./src/api-server');

module.exports = function(fractal, opts = {}){
  return new ApiServer(fractal, opts);
}

module.exports.Server = require('./src/server');
module.exports.ApiServer = ApiServer;
