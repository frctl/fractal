const visit = require('unist-util-visit');
const safeEval = require('./eval');

module.exports = function (tree, context, env) {
  visit(tree, 'element', function (node, index, parentNode) {
    if (node.properties['@if']) {
      const result = safeEval(node.properties['@if'], context);
      delete node.properties['@if'];
      if (!result) {
        // false, remove the node
        parentNode.children.splice(index, 1);
      }
      // TODO: Handle if/else and else statements
    }
  });
  return tree;
};
