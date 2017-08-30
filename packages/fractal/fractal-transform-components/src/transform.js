const {addTrailingSeparator, defaultsDeep} = require('@frctl/utils');
const {Component, ComponentCollection, FileCollection} = require('@frctl/support');

module.exports = function (opts = {}) {
  const marker = opts.marker || '@';

  return {

    name: 'components',

    transform(files, state, app) {
      const components = files.toArray().filter(file => {
        return file.isDirectory() && file.stem.startsWith(marker);
      });

      return ComponentCollection.from(components.map(dir => {
        const componentFiles = FileCollection.from(matchComponentFiles(dir, files, marker).map(file => {
          file = file.clone();
          file.base = dir.path;
          return file;
        }));

        const configFiles = componentFiles.filter(app.get('configs.filter')).sortBy('basename');
        const data = configFiles.mapToArray(file => {
          const data = app.loader.requireFromString(file.contents.toString(), file.path);
          return (typeof data === 'function') ? data(app, files) : data;
        });

        const config = Object.assign({}, ...data);

        return Component.from({
          src: dir,
          files: componentFiles,
          config: defaultsDeep(config, app.get('configs.defaults', {}))
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
