const utils = require('@frctl/utils');

module.exports = function (opts = {}) {
  const adapterName = opts.name;
  const match = opts.match;
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
