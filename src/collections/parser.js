const path = require('path');
const _ = require('lodash');
const utils = require('@frctl/utils');
const parser = require('@frctl/internals/parser');
const config = require('./plugins/config');

module.exports = function(opts = {}){

  const collectionsParser = parser(function(files){

    const componentDirs = _.uniq(files.filter(file => file.isDirectory && file.role === 'component').map(c => path.dirname(c.path)));

    const collections = files.filter(file => file.role === 'collection').map(file => {
      for (const dir of componentDirs) {
        if (dir.startsWith(file.path)) {
          return {
            path: file.path,
            name: file.name,
            role: 'collection',
            label: utils.titlize(file.name),
            dir: file,
            files: getFiles(file.path)
          };
        }
      }
      return null;
    }).filter(file => file);

    function getFiles(entityPath) {
      return files.filter(file => {
        return file.scope === 'global' && !file.isDirectory && file.dirname === entityPath;
      }).map(file => {
        file.scope = 'collection';
        return file;
      });
    }

    return collections;

  });

  collectionsParser.addPlugin(config());

  return collectionsParser;

};
