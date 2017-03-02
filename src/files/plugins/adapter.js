const utils = require('@frctl/utils');
const check = require('check-types');

const assert  = check.assert;

module.exports = function (adapter) {
  if (check.null(adapter) || check.undefined(adapter)) assert(false, `'adapter' must be an object with 'name' and 'render' properties [adapter-invalid]`, TypeError);
  assert.like(adapter, {name: 'name', render: function () {}}, `'adapter' must be an object with 'name' and 'render' properties [adapter-invalid]`);

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
    const canRender = files.filter(file => ['view'].includes(file.role));
    canRender.filter(fileFilter).forEach(file => {
      file.adapter = adapterName;
    });
    done();
  };
};
