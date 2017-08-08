const Surveyor = require('./src/surveyor');
const Transformer = require('./src/transform/transformer');

module.exports = function (opts = {}) {
  return new Surveyor(opts);
};

module.exports.Surveyor = Surveyor;
module.exports.Transformer = Transformer;
