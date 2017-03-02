const utils = require('@frctl/utils');
const parser = require('@frctl/internals/parser');
const config = require('./plugins/config');
const name = require('./plugins/name');
const label = require('./plugins/label');

module.exports = function () {
  const componentsParser = parser(function (files) {
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
        return file;
      });
    }

    return components;
  });

  componentsParser.addPlugin(config())
                  .addPlugin(name())
                  .addPlugin(label());

  return componentsParser;
};
