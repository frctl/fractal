'use strict';

const Promise   = require('bluebird');
const Path      = require('path');
const co        = require('co');
const _         = require('lodash');
const dirscribe = require('@allmarkedup/dirscribe');
const readFile  = Promise.promisify(require('fs').readFileAsync);
const isBinary  = Promise.promisify(require('istextorbinary').isBinary);
const utils     = require('./utils');

module.exports = {

    describe(dir){
        return dirscribe(dir, {
            filter:   filePath => ! (/(^|\/)\.[^\/\.]/g).test(filePath),
            after:    files => _.orderBy(files, ['type','order','path'], ['desc','asc','asc']),
            build:    build,
            recursive: true
        });
    }

};

function build(filePath, stat) {
    return co(function* () {
        const p        = Path.parse(filePath);
        const fsName   = p.name;
        p.path         = filePath;
        p.name         = _.get(fsName.match(/^_?(\d+\-)?(.*)/), 2, fsName);
        p.dirs         = _.compact(p.dir.split('/'));
        p.isHidden     = !!_.find(p.dirs, s => s.startsWith('_'));
        p.order        = parseInt(_.get(fsName.match(/^_?(\d+)\-.*/), 1, 1000000), 10);
        p.ext          = p.ext.toLowerCase();
        p.isFile       = stat.isFile();
        p.isDirectory  = stat.isDirectory();
        if (p.isDirectory) {
            p.type     = 'directory';
        } else {
            p.type     = 'file';
            p.lang     = utils.guessLanguage(filePath);
            p.isBinary = yield isBinary(filePath, null);
            p.buffer   = yield readFile(filePath);
        }
        return p;
    });
};
