const {toArray} = require('@frctl/utils');
const visit = require('unist-util-visit');
const safeEval = require('./eval');

module.exports = function (tree, env) {
  visit(tree, 'element', function (node, index, parentNode) {
    if (node.properties['@if']) {
      const result = safeEval(node.properties['@if'], env);
      delete node.properties['@if'];
      if (!result) {
        // false, remove the node
        parentNode.children.splice(index, 1);
      }
    }
  });
  return tree;
};
