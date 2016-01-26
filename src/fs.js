'use strict';

const Promise  = require('bluebird');
const Path     = require('path');
const co       = require('co');
const all      = require('co-flow').all;
const _        = require('lodash');
const isBinary = Promise.promisify(require('istextorbinary').isBinary);
const fs       = Promise.promisifyAll(require('fs'));
const utils    = require('./utils');

var self = module.exports = {

    readdir(dir) {
        return fs.readdirAsync(dir)
                .filter(filePath => ! (/(^|\/)\.[^\/\.]/g).test(filePath))
                .map(filePath => self.describe(Path.join(dir, filePath), true))
                .then(files => _.orderBy(files, ['type','order','path'], ['desc','asc','asc']));
    },

    describe(filePath, recursive) {
        recursive = recursive === false ? false : true;
        return co(function* () {
            const stat = yield fs.statAsync(filePath);
            const desc = {
                path: filePath,
                stat: stat,
            };
            Object.assign(desc, self.pathInfo(filePath));
            if (stat.isDirectory()) {
                desc.isFile = false;
                desc.isDirectory = true;
                desc.type = 'directory';
                if (recursive) {
                    desc.children = yield self.readdir(filePath);
                }
            } else {
                desc.isFile = true;
                desc.isDirectory = false;
                desc.type = 'file';
                desc.lang = utils.guessLanguage(filePath);
                desc.isBinary = yield isBinary(filePath, null);
                desc.buffer = yield fs.readFileAsync(filePath);
            }

            return desc;
        });
    },

    pathInfo(filePath) {
        const p = Path.parse(filePath);
        const fsName = p.name;
        p.name = _.get(fsName.match(/^_?(\d+\-)?(.*)/), 2, fsName);
        p.dirs = _.compact(p.dir.split('/'));
        p.isHidden = !!_.find(p.dirs, s => s.startsWith('_'));
        p.order = parseInt(_.get(fsName.match(/^_?(\d+)\-.*/), 1, 1000000), 10);
        p.ext = p.ext.toLowerCase();
        return p;
    },

    ext(fileName){
        return
    }

};
