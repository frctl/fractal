const path = require('path');
const _ = require('lodash');
const Bluebird = require('bluebird');
const Compiler = require('@frctl/internals').Compiler;
const utils = require('@frctl/utils');

const plugins = {
  files: require('./files'),
  components: require('./components'),
  collections: require('./collections')
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
      collections: []
    };
    let unAssignedFiles = _.orderBy(files, [f => f.path.split(path.sep).length], ['desc']);

    files.forEach(file => {
      const group = `${file.role}s`;
      if (Object.keys(entities).includes(group)) {
        entities[group].push({
          path: file.path,
          name: file.name,
          label: utils.titlize(file.name),
          files: getFiles(file.role, file.path)
        });
      }
    });

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
    return Bluebird.mapSeries(['collections', 'components'], key => {
      return this.getParser(key).process(entities[key]);
    }).then(entities => {
      const [collections, components] = entities;
      return {collections, components};
    });
  });

  return compiler;
};
