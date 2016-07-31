'use strict';

const Promise = require('bluebird');
const Path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const minimist = require('minimist');
const fang = require('@allmarkedup/fang');
const _ = require('lodash');
const Stream = require('stream');

module.exports = {

    lang(filePath) {
        return fang(filePath) || {
            name: Path.parse(filePath).ext.replace('.', '').toUpperCase(),
            mode: 'text',
            scope: null,
            color: null,
        };
    },

    titlize(str) {
        return _.startCase(str);
    },

    slugify: str => _.deburr(str).replace(/\s+/g, '-').toLowerCase(),

    toJSON(item) {
        const obj = {};
        _.forOwn(item, (value, key) => {
            if (!key.startsWith('_')) {
                if (value instanceof Buffer) {
                    obj[key] = '<Buffer>';
                } else if (value && typeof value.toJSON === 'function') {
                    obj[key] = value.toJSON();
                } else {
                    obj[key] = value;
                }
            }
        });
        return obj;
    },

    escapeForRegexp(str) {
        return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    },

    parseArgv() {
        const argv = minimist(process.argv.slice(2));
        const args = argv._;
        const command = args.length ? args.shift() : null;
        const opts = argv;
        delete opts._;
        delete opts.$0;
        return {
            command: command,
            args: args,
            opts: opts,
        };
    },

    stringify(data, indent) {
        return JSON.stringify(data, function (key, val) {
            if (this[key] instanceof Buffer) {
                return '<Buffer>';
            }
            if (this[key] instanceof Function) {
                return '<Function>';
            }
            if (_.isPlainObject(this[key]) && !_.size(this[key])) {
                return '{}';
            }
            return val;
        }, indent || 4);
    },

    fileExistsSync(path) {
        try {
            fs.accessSync(path, fs.F_OK);
            return true;
        } catch (e) {
            return false;
        }
    },

    isPromise(value) {
        return (value && _.isFunction(value.then));
    },

    md5(str) {
        return crypto.createHash('md5').update(str).digest('hex');
    },

    mergeProp(prop, upstream) {
        if (_.isFunction(prop)) {
            return prop;
        }
        if (_.isFunction(upstream)) {
            return upstream;
        }
        if (_.isArray(upstream)) {
            return _.uniq(_.concat(upstream, _.castArray(prop)));
        } else if (_.isObject(upstream)) {
            return _.defaultsDeep(_.clone(prop || {}), _.clone(upstream));
        }
        if (_.isUndefined(prop)) {
            return upstream;
        }
        return prop;
    },

    relUrlPath(toPath, fromPath, opts) {
        if (toPath.startsWith('http') || toPath.startsWith('.')) {
            return toPath;
        }

        const ext = opts.ext || '';

        fromPath = getStaticPagePath(fromPath).replace(/\\/g, '/');
        toPath = ('/' + _.trim(Path.extname(toPath) ? toPath : getStaticPagePath(toPath), '/')).replace(/\\/g, '/');

        if (toPath == '/') {
            return Path.relative(fromPath, toPath).replace(/\\/g, '/');
        }

        return Path.relative(fromPath, toPath).replace(/\\/g, '/').replace(/^\.\.\//, '').replace('.PLACEHOLDER', ext);

        function getStaticPagePath(url) {
            if (url == '/') {
                return ext == '' ? '/' : '/index.PLACEHOLDER';
            }
            const parts = Path.parse(url);
            return `${parts.dir}/${parts.name}.PLACEHOLDER`;
        }
    },

};
