const {modifyNodes} = require('reshape-plugin-util');
const safeEval = require('./eval');

module.exports = function(tree, env){

  return modifyNodes(tree, (node) => node.type === 'tag', async (node) => {

    if (node.attrs) {
      for (const key of Object.keys(node.attrs)) {
        if (key[0] === ':') {
          const attrs = node.attrs[key];
          delete node.attrs[key];
          const modifiedAttrs = [];

          for (const attr of attrs) {
            if (attr.type === 'text') {
              attr.content = safeEval(attr.content, env);
              if (!attr.content) {
                continue;
              }
              if (Array.isArray(attr.content)) {
                attr.content = attr.content.join(' ');
              }
              if (typeof attr.content !== 'string') {
                throw new Error(`attribute '${key}' must resolve to a string`);
              }
              modifiedAttrs.push(attr);
            } else {
              modifiedAttrs.push(attr);
            }
          }
          const attrName = key.slice(1);

          if (node.attrs[attrName] && modifiedAttrs.length > 0) {
            node.attrs[attrName] = node.attrs[attrName].concat({
              type: 'text',
              content: ' ',
              location: node.location
            }, ...modifiedAttrs);
          } else {
            node.attrs[attrName] = modifiedAttrs;
          }
        }
      }
    }

    return node;
  });
}
