const path = require('path');
const utils = require('@frctl/utils');

module.exports = function (files) {
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
    }).map(file => {
      file.scope = 'component';
      Object.defineProperty(file, 'componentPath', {
        get() {
          return path.relative(entityPath, file.path);
        }
      });
      return file;
    });
  }

  return components;
};
