const _ = require('lodash');
const multimatch = require('multimatch');
const assert = require('check-types').assert;

module.exports = function (opts = {}) {
  assert.maybe.object(opts, `'Role' plugin's 'opts' argument should be an object [opts-invalid]`);
  const marker = opts.marker || '@';
  const matchOpts = {nocase: true};

  const roles = [{
    name: 'view',
    match: opts.view || function (file) {
      return file.isFile && multimatch([file.relative], ['**/?(*.)view.*'], matchOpts).length;
    }
  }, {
    name: 'config',
    match: opts.config || function (file) {
      return file.isFile && multimatch([file.relative], ['**/?(*.)config.*'], matchOpts).length;
    }
  }, {
    name: 'readme',
    match: opts.readme || function (file) {
      return file.isFile && multimatch([file.relative], ['**/readme.*'], matchOpts).length;
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
    // Arguments here do not require checking as this function will always be wrapped in function with checks
    files.forEach(file => {
      file.scope = 'global';
    });

    for (const role of roles) {
      files.filter(role.match).forEach(file => {
        file.role = role.name;
      });
    }

    files.filter(file => !file.role).forEach(file => {
      file.role = 'resource';
    });

    done();
  };
};
