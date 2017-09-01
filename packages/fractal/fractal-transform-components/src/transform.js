const {addTrailingSeparator, defaultsDeep} = require('@frctl/utils');
const {Component, ComponentCollection, FileCollection} = require('@frctl/support');

module.exports = function (opts = {}) {

  return {

    name: 'components',

    async transform(files, state, app) {

      let remainingFiles = files;
      const componentDirs = files.filter(file => file.isDirectory()).filter(app.get('components.filter')).sortBy('path.length', 'desc');

      return ComponentCollection.from(await componentDirs.mapToArrayAsync(async dir => {

        const rootPath = addTrailingSeparator(dir.path);

        let componentFiles = remainingFiles.filter(file => !file.isDirectory() && file.path.startsWith(rootPath));
        componentFiles = componentFiles.map(file => {
          file = file.clone();
          file.base = dir.path;
          return file;
        });

        remainingFiles = remainingFiles.reject(file => componentFiles.find(f => f.path === file.path));

        const configFiles = componentFiles.filter(file => !file.isDirectory()).filter(app.get('configs.filter')).sortBy('basename', 'asc');

        const data = await configFiles.mapToArrayAsync(file => {
          const data = app.loader.requireFromString(file.contents.toString(), file.path);
          return (typeof data === 'function') ? Promise.resolve(data(files, app)) : Promise.resolve(data);
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
