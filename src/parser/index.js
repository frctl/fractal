const path = require('path');
const _ = require('lodash');
const Bluebird = require('bluebird');
const Parser = require('@frctl/internals').Parser;
const utils = require('@frctl/utils');

const plugins = {
  files: require('./files'),
  components: require('./components'),
  collections: require('./collections')
};

module.exports = function (opts = {}) {
  const parser = new Parser();
  const state = {};

  for (const name of Object.keys(plugins)) {
    parser.addProcessor(name, plugins[name](opts[name]), state);
  }

  /**
   * Run file transformations
   */
  parser.addStep(function (files) {
    return this.getProcessor('files').process(files).then(files => {
      state.files = files.filter(file => file.isFile);
      return files;
    });
  });

  /**
   * Extract components, collections and assets
   */
  parser.addStep(function (files, done) {
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
      return null;
    }).filter(file => file);

    unAssignedFiles.filter(file => file.isFile).forEach(file => {
      file.scope = 'global';
    });

    function entity(file) {
      return {
        path: file.path,
        name: file.name,
        role: file.role,
        label: utils.titlize(file.name),
        main: file,
        files: getFiles(file.role, file.path)
      };
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
      return files.filter(file => file.isFile).map(file => {
        file.scope = role;
        return file;
      });
    }

    done(null, {components, collections});
  });

  /**
   * Run component, collection and resource transformations
   */
  parser.addStep(function (entities) {
    return Bluebird.mapSeries(['collections', 'components'], key => {
      return this.getProcessor(key).process(entities[key]).then(result => {
        state[key] = result;
        return result;
      });
    }).then(() => state);
  });

  return parser;
};
