const EngineStore = require('./src/engine-store');

module.exports = function (engines = []) {
  return new EngineStore(engines);
};

module.exports.EngineStore = EngineStore;
