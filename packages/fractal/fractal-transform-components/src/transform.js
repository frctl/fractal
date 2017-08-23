const {addTrailingSeparator} = require('@frctl/utils');
const {Component, Collection, ComponentCollection, FileCollection} = require('@frctl/support');

module.exports = function (opts = {}) {
  const marker = opts.marker || '@';

  return {

    name: 'components',

    transform(files, state) {
      const components = files.toArray().filter(file => {
        return file.isDirectory() && file.stem.startsWith(marker);
      });

      return ComponentCollection.from(components.map(dir => {
        const componentFiles = FileCollection.from(matchComponentFiles(dir, files, marker).map(file => {
          file = file.clone();
          file.base = dir.path;
          return file;
        }));

        // TODO: proper config file loading. this is for example only!!
        let config = {};
        const configFile = componentFiles.find({basename: 'config.js'});
        if (configFile) {
          config = require(configFile.path);
        }

        return Component.from({
          src: dir,
          config: config,
          files: componentFiles
        });
      }));
    }
  };
};

function matchComponentFiles(dir, files, marker) {
  const rootPath = addTrailingSeparator(dir.path);
  return files.filter(file => {
    return !file.isDirectory() && // is not a directory
      file.path.startsWith(rootPath) && // within the component directory
      file.path.replace(rootPath, '').indexOf(marker) === -1; // and does not contain @ (a subcomponent)
  });
}
