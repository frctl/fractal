const {toArray} = require('@frctl/utils');
const visit = require('unist-util-visit');
const getPropInfo = require('property-information');
const commaSep = require('comma-separated-tokens');
const spaceSep = require('space-separated-tokens');
const safeEval = require('./eval');

module.exports = function (tree, env) {
  visit(tree, 'element', function (node, index, parentNode) {
    if (node.properties) {
      for (const key of Object.keys(node.properties)) {
        if (key[0] === ':') {
          const propName = key.slice(1);
          const propInfo = getPropInfo(propName);
          const name = propInfo ? propInfo.propertyName : propName;
          const result = safeEval(node.properties[key], env);

          delete node.properties[key];

          node.properties[name] = resolveValue(node.properties[name], result, propInfo);
        }
      }
    }
  });
  return tree;
};

function resolveValue(existing, additional, propInfo) {
  if (!propInfo) {
    return toArray(existing).concat(toArray(additional)).join(' ');
  }
  if (propInfo.boolean || propInfo.overloadedBoolean) {
    return Boolean(additional);
  }
  if (propInfo.spaceSeparated || propInfo.commaSeparated) {
    // result should be an array
    if (typeof additional === 'string' && propInfo.spaceSeparated) {
      additional = spaceSep.parse(additional);
    } else if (typeof additional === 'string' && propInfo.commaSeparated) {
      additional = commaSeparated.parse(additional);
    }
    return toArray(existing).concat(toArray(additional));
  }
  if (propInfo.numeric || propInfo.positiveNumeric) {
    return parseInt(additional, 10);
  }
}
