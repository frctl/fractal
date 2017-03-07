const utils = require('@frctl/utils');
const check = require('check-types');

const assert = check.assert;

module.exports = function (adapter) {
  if (check.null(adapter) || check.undefined(adapter)) {
    assert(false, `'Adapter' plugin's 'adapter' argument is undefined [adapter-undefined]`, TypeError);
  }
  assert.string(adapter.name, `'adapter.name' is a required string [adapter-invalid]`);
  if (check.not.string(adapter.match) && check.not.function(adapter.match)) {
    assert(false, `'adapter.match' is required and should be a string or function [adapter-invalid]`, TypeError);
  }

  const adapterName = adapter.name;
  const match = adapter.match;
  let fileFilter = () => true;

  if (typeof match === 'string' || Array.isArray(match)) {
    const exts = utils.toArray(match).map(ext => utils.normalizeExt(ext));
    fileFilter = file => exts.includes(file.ext);
  } else if (typeof match === 'function') {
    fileFilter = match;
  }

  return function enginePlugin(files, done) {
    // Arguments here do not require checking as this function will always be wrapped in function with checks
    const canRender = files.filter(file => ['view'].includes(file.role));
    canRender.filter(fileFilter).forEach(file => {
      file.adapter = adapterName;
    });
    done();
  };
};
