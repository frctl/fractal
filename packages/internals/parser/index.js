const Parser = require('./src/parser');
const Transformer = require('./src/transform/transform');

module.exports = function (opts = {}) {
  return new Parser(opts);
};

module.exports.Parser = Parser;
module.exports.Transformer = Transformer;
