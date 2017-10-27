const Parser = require('./src/parser');
const Transform = require('./src/transform/transform');

module.exports = function (opts = {}) {
  return new Parser(opts);
};

module.exports.Parser = Parser;
module.exports.Transform = Transform;
module.exports.filesTransform = require('./src/transform/file-transform');
