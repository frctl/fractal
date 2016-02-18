'use strict';

const Promise   = require('bluebird');
const Path      = require('path');
const co        = require('co');
const _         = require('lodash');
const dirscribe = require('@allmarkedup/dirscribe');
const fs        = require('fs');
const readFile  = Promise.promisify(fs.readFile);
const isBinary  = Promise.promisify(require('istextorbinary').isBinary);
const utils     = require('./utils');
const cli    = require('./cli');

module.exports = {

    describe(dir, noCache) {

        return dirscribe(dir, {
            filter: filePath => !(/(^|\/)\.[^\/\.]/g).test(filePath),
            after:  files => _.orderBy(files, ['type', 'order', 'path'], ['desc', 'asc', 'asc']),
            build:  build
        });

        function build(filePath, stat) {
            return co(function* () {
                const p        = Path.parse(filePath);
                p.fsName       = p.name;
                p.name         = _.get(p.fsName.match(/^_?(\d+\-)?(.*)/), 2, p.fsName);
                p.path         = filePath;
                p.dirs         = _.compact(p.dir.split('/'));
                p.isHidden     = !!(_.find(p.dirs, s => s.startsWith('_')) || p.fsName.startsWith('_'));
                p.order        = parseInt(_.get(p.fsName.match(/^_?(\d+)\-.*/), 1, 1000000), 10);
                p.ext          = p.ext.toLowerCase();
                p.isFile       = stat.isFile();
                p.isDirectory  = stat.isDirectory();
                if (p.isDirectory) {
                    p.type     = 'directory';
                } else {
                    p._cachedContents = null;
                    p.isCacheable  = !!noCache;
                    p.type     = 'file';
                    p.lang     = utils.lang(filePath);
                    p.isBinary = yield isBinary(filePath, null);
                    p.readSync = function () {
                        if (!p.isCacheable || (p.isCacheable && !p._cachedContents)) {
                            p._cachedContents = p.isBinary ? fs.readFileSync(filePath) : fs.readFileSync(filePath, 'utf8');
                            p._cachedContents = p._cachedContents.toString();
                        }
                        return p._cachedContents;
                    };
                    p.read = function () {
                        if (!p.isCacheable || (p.isCacheable && !p._cachedContents)) {
                            var read = p.isBinary ? readFile(filePath) : readFile(filePath, 'utf8');
                            return read.then(function (contents) {
                                p._cachedContents = contents.toString();
                                return p._cachedContents;
                            });
                        }
                        return Promise.resolve(p._cachedContents);
                    };
                }
                p.toString = function () {
                    return p.path;
                };
                p.toJSON = function () {
                    const self = _.clone(this);
                    delete self._cachedContents;
                    return self;
                };
                return p;
            });
        };

    }

};
