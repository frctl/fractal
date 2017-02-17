const path = require('path');
const _ = require('lodash');
const minimatch = require('minimatch');

module.exports = function (opts = {}) {
  const marker = opts.marker || '@';
  const matchOpts = {nocase: true};

  const roles = [{
    name: 'view',
    match: opts.view || function (file) {
      return file.isFile && minimatch(path.basename(file.path), '?(*.)view.*', matchOpts);
    }
  }, {
    name: 'preview',
    match: opts.preview || function (file) {
      return file.isFile && minimatch(path.basename(file.path), '?(*.)preview.*', matchOpts);
    }
  }, {
    name: 'config',
    match: opts.config || function (file) {
      return file.isFile && minimatch(path.basename(file.path), '?(*.)config.*', matchOpts);
    }
  }, {
    name: 'component',
    match: opts.component || function (file) {
      return file.isDirectory && file.name.startsWith(marker);
    }
  }, {
    name: 'collection',
    match: opts.collection || function (file) {
      return file.isDirectory && file.relative.indexOf(marker) === -1;
    }
  }];

  return function identifyRole(files, done) {
    for (const role of roles) {
      files.filter(role.match).forEach(file => {
        file.role = role.name;
      });
    }
    files.forEach(file => {
      if (file.isFile && !file.role) {
        file.role = 'resource';
      }
    });

    done();
  };
};
