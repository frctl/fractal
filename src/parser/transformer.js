const fs = require('@frctl/ffs');
const assert = require('check-types').assert;
const utils = require('@frctl/utils');

module.exports = function (files) {
  assert.array.of.instance(files, fs.File, `transformer: input must be an array of File objects [files-invalid]`);

  const components = files.filter(file => file.role === 'component').map(file => {
    return {
      path: file.path,
      name: file.name,
      role: 'component',
      label: utils.titlize(file.name),
      dir: file,
      files: getFiles(file.path)
    };
  });

  function getFiles(entityPath) {
    return files.filter(file => {
      return file.path.startsWith(utils.addTrailingSeparator(entityPath));
    });
  }

  return components;
};
