const {normalizeName, addTrailingSeparator} = require('@frctl/utils');
const {Component, Collection, ComponentCollection, FileCollection} = require('@frctl/support');

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

        const configFiles = componentFiles.filter(app.get('components.config.filter')).sortBy('basename');
        const data = configFiles.mapToArray(file => {
          const data = {};
          // const data = app.loader.requireFromString(file.contents.toString(), file.path);
          return (typeof data === 'function') ? data(app, files) : data;
        });

        return Component.from({
          config: Object.assign({}, ...data),
          path: dir.path,
          relative: dir.relative,
          src: dir,
          name: normalizeName(dir.stem),
          variants: new Collection(),
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
