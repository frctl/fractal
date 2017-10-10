const visit = require('unist-util-visit');
const safeEval = require('./eval');

module.exports = function (tree, env) {
  visit(tree, 'element', function (node, index, parentNode) {
    if (node.properties) {
      for (const key of Object.keys(node.properties)) {
        if (key[0] === ':') {
          const propRealName = key.slice(1);
          let result = safeEval(node.properties[key], env);

          if (Array.isArray(result)) {
            result = result.join(' ');
          }
          if (typeof result !== 'string') {
            throw new Error(`attribute '${key}' must resolve to a string`);
          }

          delete node.properties[key];

          if (node.properties[propRealName] && node.properties[propRealName].trim() !== '') {
            node.properties[propRealName] += ` ${result}`;
          } else {
            node.properties[propRealName] = result;
          }
        }
      }
    }
  });
  return tree;
};
