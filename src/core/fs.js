'use strict';

const Promise = require('bluebird');
const Path = require('path');
const co = require('co');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs'));
const readFile = Promise.promisify(fs.readFile);
const isBinary = Promise.promisify(require('istextorbinary').isBinary);
const utils = require('./utils');
const glob = require('globby');

const notBinary = ['.nunj', '.nunjucks', '.hbs', '.handlebars', '.jsx', '.twig']; // TODO: handle this in a scalable, extendable way

module.exports = {

    describe(dir, relDir, filter) {
        filter = filter || (filePath => !(/(^|\/)\.[^\/\.]/g).test(filePath));

        return dirscribe(dir, {
            filter: filter,
            after: files => _.orderBy(files, ['isDirectory', 'order', 'path'], ['desc', 'asc', 'asc']),
            build: build,
        });

        function build(filePath, stat) {
            return co(function* () {
                const p = Path.parse(filePath);
                p.relPath = Path.relative(dir, filePath);
                p.fsName = p.name;
                p.name = _.get(p.fsName.match(/^_?(\d+\-)?(.*)/), 2, p.fsName);
                p.path = filePath;
                p.dirs = _.compact(p.dir.split('/'));
                p.isHidden = !!(_.find(p.relPath.split('/'), s => s.startsWith('_')) || p.fsName.startsWith('_'));
                p.order = parseInt(_.get(p.fsName.match(/^_?(\d+)\-.*/), 1, 1000000), 10);
                p.ext = p.ext.toLowerCase();
                p.isFile = stat.isFile();
                p.isDirectory = stat.isDirectory();
                p.stat = stat;
                if (p.isFile) {
                    p.lang = utils.lang(filePath);
                    p.isBinary = yield checkIsBinary(p);
                    p.readBuffer = function () {
                        return fs.readFileSync(filePath);
                    };
                    p.readSync = function () {
                        const contents = p.isBinary ? fs.readFileSync(filePath) : fs.readFileSync(filePath, 'utf8');
                        return contents.toString();
                    };
                    p.read = function () {
                        const read = p.isBinary ? readFile(filePath) : readFile(filePath, 'utf8');
                        return read.then(function (contents) {
                            return contents.toString();
                        });
                    };
                }
                p.toString = function () {
                    return p.path;
                };
                p.toJSON = function () {
                    const self = _.clone(this);
                    return self;
                };
                return p;
            });
        }
    },

    globDescribe(dir, relDir, match) {
        return glob(match, {
            cwd: dir,
        }).then(matches => {
            const directories = [];
            matches.forEach(path => {
                const parts = Path.parse(path).dir.split('/');
                const buildPath = [];
                parts.forEach(part => {
                    buildPath.push(part);
                    directories.push(buildPath.join('/'));
                });
            });
            const included = _.uniq(directories.concat(matches)).map(p => Path.join(dir, p));
            return this.describe(dir, relDir, filePath => {
                return _.includes(included, filePath);
            });
        });
    },

};

function dirscribe(root, opts) {
    opts = opts || {};
    const filter = opts.filter || (i => true);
    const after = opts.after || (i => i);
    const build = opts.build || buildDefault;
    const recursive = opts.recursive === false ? false : true;
    const childrenKey = opts.childrenKey || 'children';

    function readdir(dir) {
        return fs.readdirAsync(dir)
            .filter(file => filter(Path.join(dir, file)))
            .map(filePath => objectify(Path.join(dir, filePath)))
            .then(after);
    }

    function objectify(filePath) {
        let statCache;
        return fs.statAsync(filePath).then(function (stat) {
            statCache = stat;
            return build(filePath, stat);
        }).then(function (desc) {
            if (recursive && statCache.isDirectory()) {
                return readdir(filePath).then(function (children) {
                    desc.children = children;
                    return desc;
                });
            }

            return desc;
        });
    }

    function buildDefault(filePath, stat) {
        const p = Path.parse(filePath);
        p.path = filePath;
        p.stat = stat;
        return p;
    }

    return objectify(root);
}

function checkIsBinary(file) {
    if (_.includes(notBinary, file.ext)) {
        return Promise.resolve(false);
    }
    return isBinary(file.path, null);
}
