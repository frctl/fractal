const path = require('path');
const _ = require('lodash');
const Bluebird = require('bluebird');
const Compiler = require('@frctl/internals').Compiler;
const utils = require('@frctl/utils');

const plugins = {
  files: require('./files'),
  components: require('./components'),
  collections: require('./collections'),
  assets: require('./assets'),
};

module.exports = function (opts = {}) {
  const compiler = new Compiler();

  for (const name of Object.keys(plugins)) {
    compiler.addParser(name, plugins[name](opts[name]));
  }

  /**
   * Run file transformations
   */
  compiler.addStep(function (files) {
    return this.getParser('files').process(files);
  });

  /**
   * Create components and collections
   */
  compiler.addStep(function (files, done) {
    const entities = {
      components: [],
      collections: [],
      assets: [],
    };
    let unAssignedFiles = _.orderBy(files, [f => f.path.split(path.sep).length], ['desc']);

    files.filter(file => file.role === 'component').forEach(file => {
      entities.components.push(entity(file));
    });

    const componentDirs = _.uniq(entities.components.map(c => path.dirname(c.path)));

    files.filter(file => file.role === 'collection').forEach(file => {
      for (const dir of componentDirs) {
        if (dir.startsWith(file.path)) {
          entities.collections.push(entity(file));
        }
      }
    });

    unAssignedFiles.filter(file => file.isFile).forEach(file => {
      entities.assets.push(file);
    });

    function entity(file){
      return {
        path: file.path,
        name: file.name,
        label: utils.titlize(file.name),
        root: file,
        files: getFiles(file.role, file.path)
      }
    }

    function getFiles(role, entityPath) {
      let files = [];
      if (role === 'component') {
        files = unAssignedFiles.filter(file => {
          return file.path.startsWith(utils.addTrailingSeparator(entityPath));
        });
      } else if (role === 'collection') {
        files = unAssignedFiles.filter(file => {
          return !file.isDirectory && file.dirname === entityPath;
        });
      }
      unAssignedFiles = _.difference(unAssignedFiles, files);
      return files;
    }

    done(null, entities);
  });

  /**
   * Run component and collection transformations
   */
  compiler.addStep(function (entities) {
    return Bluebird.mapSeries(['collections', 'components', 'assets'], key => {
      return this.getParser(key).process(entities[key]);
    }).then(entities => {
      const [collections, components, assets] = entities;
      return {collections, components, assets};
    });
  });

  return compiler;
};
