const path = require('path');
const _ = require('lodash');
const multimatch = require('multimatch');

module.exports = function (opts = {}) {
  const marker = opts.marker || '@';
  const matchOpts = {nocase: true};

  const roles = [{
    name: 'view',
    match: opts.view || function (file) {
      return file.isFile && multimatch([file.path], ['**/?(*.)view.*'], matchOpts).length;
    }
  }, {
    name: 'config',
    match: opts.config || function (file) {
      return file.isFile && multimatch([file.path], ['**/?(*.)config.*'], matchOpts).length;
    }
  },{
    name: 'readme',
    match: opts.readme || function (file) {
      return file.isFile && multimatch([file.path], ['**/readme.*'], matchOpts).length;
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

    files.filter(file => !file.role).forEach(file => {
      file.role = 'resource';
    });

    done();
  };
};
