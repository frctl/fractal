const {defaultsDeep, addTrailingSeparator} = require('@frctl/utils');
const {Component, ComponentCollection} = require('@frctl/support');

module.exports = function (opts = {}) {
  return {

    name: 'components',

    async transform(files, state, app) {
      let remainingFiles = files.sortBy('path.length', 'desc').filter(file => !file.isDirectory());
      const configMatcher = app.get('components.config.match');
      const configDefaults = app.get('components.config.defaults', {});
      const componentMatcher = app.get('components.match');
      const componentDirs = files.filter(file => file.isDirectory()).filter(componentMatcher);
      const loader = app.getLoader(files);

      return ComponentCollection.from(await componentDirs.mapToArrayAsync(async dir => {
        const rootPath = addTrailingSeparator(dir.path);

        let componentFiles = remainingFiles.filter(file => file.path.startsWith(rootPath));
        componentFiles = componentFiles.map(file => {
          file = file.clone();
          file.base = dir.path;
          return file;
        });

        remainingFiles = remainingFiles.reject(file => componentFiles.find(f => f.path === file.path));

        let config = {};
        const configFile = componentFiles.filter(configMatcher).sortBy('basename', 'asc').first();
        if (configFile) {
          const configData = loader.requireFromString(configFile.contents.toString(), configFile.path);
          config = await Promise.resolve(typeof configData === 'function' ? configData(files, app) : configData);
        }

        config = defaultsDeep(config, configDefaults, {
          id: dir.stem
        });

        return Component.from({
          config,
          src: dir,
          files: componentFiles
        });
      }));
    }
  };
};
