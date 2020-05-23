'use strict';

const Promise = require('bluebird');
const Path = require('path');
const co = require('co');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs'));
const readFile = Promise.promisify(fs.readFile);
const isBinary = require('istextorbinary').isBinaryPromise;
const utils = require('./utils');
const glob = require('globby');

module.exports = {
    describe(dir, relDir, filter, ext) {
        filter = filter || ((filePath) => !/(^|\/)\.[^/.]/g.test(filePath));

        return dirscribe(dir, {
            filter: filter,
            after: (files) => _.orderBy(files, ['isDirectory', 'order', 'path'], ['desc', 'asc', 'asc']),
            build: build,
            ext: ext,
        });
    },

    globDescribe(dir, relDir, match) {
        return glob(match, {
            cwd: dir,
        }).then((matches) => {
            const directories = [];
            matches.forEach((path) => {
                const parts = Path.parse(path).dir.split('/');
                const buildPath = [];
                parts.forEach((part) => {
                    buildPath.push(part);
                    directories.push(buildPath.join('/'));
                });
            });
            const included = _.uniq(directories.concat(matches)).map((p) => Path.join(dir, p));
            return this.describe(dir, relDir, (filePath) => {
                return _.includes(included, filePath);
            });
        });
    },

    find(filePath) {
        return fs.statAsync(filePath).then((stat) => {
            return build(filePath, stat, Path.parse(filePath).dir);
        });
    },
};

function build(filePath, stat, root, ext) {
    return co(function* () {
        const p = Path.parse(filePath);
        // use basename instead of p.name to account for double extensions, like ".html.twig"
        const basename = Path.basename(filePath, ext);

        p.relPath = Path.relative(root, filePath);
        p.fsName = basename;
        p.name = _.get(p.fsName.match(/^_?(\d+-)?(.*)/), 2, p.fsName);
        p.path = filePath;
        p.dirs = _.compact(p.dir.split('/'));
        p.isHidden = !!(_.find(p.relPath.split('/'), (s) => s.startsWith('_')) || p.fsName.startsWith('_'));
        p.order = parseInt(_.get(p.fsName.match(/^_?(\d+)-.*/), 1, 1000000), 10);
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

function dirscribe(root, opts) {
    opts = opts || {};
    const filter = opts.filter || (() => true);
    const after = opts.after || ((i) => i);
    const build = opts.build || buildDefault;
    const recursive = opts.recursive === false ? false : true;
    const ext = opts.ext || undefined;

    function readdir(dir) {
        return fs
            .readdirAsync(dir)
            .filter((file) => filter(Path.join(dir, file)))
            .map((filePath) => objectify(Path.join(dir, filePath)))
            .then(after);
    }

    function objectify(filePath) {
        let statCache;
        return fs
            .statAsync(filePath)
            .then(function (stat) {
                statCache = stat;
                return build(filePath, stat, root, ext);
            })
            .then(function (desc) {
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
    return isBinary(file.path, null);
}
