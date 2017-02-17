const path = require('path');
const _ = require('lodash');
const Bluebird = require('bluebird');
const Compiler = require('@frctl/internals').Compiler;
const utils = require('@frctl/utils');

const plugins = {
  files: require('./files'),
  components: require('./components'),
  collections: require('./collections'),
  resources: require('./resources'),
};

module.exports = function (opts = {}) {
  const compiler = new Compiler();
  const state = {};

  for (const name of Object.keys(plugins)) {
    compiler.addParser(name, plugins[name](opts[name]), state);
  }

  /**
   * Run file transformations
   */
  compiler.addStep(function (files) {
    return this.getParser('files').process(files).then(files => {
      state.files = files;
      return files;
    });
  });

  /**
   * Extract components, collections and assets
   */
  compiler.addStep(function (files, done) {

    let unAssignedFiles = _.orderBy(files, [f => f.path.split(path.sep).length], ['desc']);

    const components = files.filter(file => file.role === 'component').map(file => {
      return entity(file);
    });
    const componentDirs = _.uniq(components.map(c => path.dirname(c.path)));

    const collections = files.filter(file => file.role === 'collection').map(file => {
      for (const dir of componentDirs) {
        if (dir.startsWith(file.path)) {
          return entity(file);
        }
      }
    }).filter(file => file);

    unAssignedFiles.filter(file => file.isFile).forEach(file => {
      file.scope = 'global';
    });

    const resources = files.filter(file => file.role === 'resource');

    function entity(file){
      return {
        path: file.path,
        name: file.name,
        role: file.role,
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
      return files.map(file => {
        file.scope = role;
        return file;
      });
    }

    done(null, {resources, components, collections});
  });

  /**
   * Run component, collection and resource transformations
   */
  compiler.addStep(function (entities) {
    return Bluebird.mapSeries(['resources', 'collections', 'components'], key => {
      return this.getParser(key).process(entities[key]).then(result => {
        state[key] = result;
        return result;
      });
    }).then(entities => state);
  });

  return compiler;
};
