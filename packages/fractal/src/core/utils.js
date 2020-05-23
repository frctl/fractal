'use strict';

const Path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const minimist = require('minimist');
const fang = require('@allmarkedup/fang');
const _ = require('lodash');

module.exports = {
    lang(filePath) {
        const name = Path.parse(filePath).ext.replace('.', '').toUpperCase();
        switch (name) {
            case 'NUNJUCKS':
            case 'NUNJS':
            case 'NUNJ':
            case 'NJK':
            case 'NJ':
            case 'JINJA2':
            case 'J2':
                return {
                    name: 'HTML+Django',
                    mode: 'django',
                    scope: 'text.html.django',
                    color: null,
                };
            default:
                return (
                    fang(filePath) || {
                        name: name,
                        mode: 'plaintext',
                        scope: null,
                        color: null,
                    }
                );
        }
    },

    titlize(str) {
        return _.startCase(str);
    },

    slugify: (str) => _.deburr(str).replace(/\s+/g, '-').toLowerCase(),

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
        return JSON.stringify(
            data,
            function (key, val) {
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
            },
            indent || 4
        );
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
        return value && _.isFunction(value.then);
    },

    md5(str) {
        return crypto.createHash('md5').update(str).digest('hex');
    },

    mergeProp(prop, upstream) {
        if (_.isArray(upstream)) {
            return _.uniq(_.concat(upstream, _.castArray(prop)));
        } else if (_.isPlainObject(upstream) && _.isPlainObject(prop)) {
            return this.defaultsDeep(_.cloneDeep(prop || {}), upstream);
        }
        if (_.isUndefined(prop)) {
            return upstream;
        }
        return prop;
    },

    /*
     * Non-array merging version of _.defaultsDeep
     *
     * utils.defaultsDeep(src, defaults);
     */

    defaultsDeep() {
        let output = {};

        _.toArray(arguments)
            .reverse()
            .forEach((item) => {
                _.mergeWith(output, item, (objectValue, sourceValue) => {
                    if (_.isArray(sourceValue)) {
                        return sourceValue;
                    }
                    if (!_.isPlainObject(sourceValue) || !_.isPlainObject(objectValue)) {
                        return sourceValue;
                    }
                    if (_.isUndefined(sourceValue)) {
                        return objectValue;
                    }
                });
            });

        return output;
    },

    relUrlPath(toPath, fromPath, opts) {
        if (toPath.startsWith('http')) {
            return toPath;
        }

        const ext = opts.ext || '';

        if (toPath.startsWith('.')) {
            return ext === '' ? toPath : toPath + ext;
        }

        fromPath = getStaticPagePath(fromPath).replace(/\\/g, '/');
        toPath = ('/' + _.trim(Path.extname(toPath) ? toPath : getStaticPagePath(toPath), '/')).replace(/\\/g, '/');

        if (toPath == '/') {
            return Path.relative(fromPath, toPath).replace(/\\/g, '/');
        }

        return Path.relative(fromPath, toPath)
            .replace(/\\/g, '/')
            .replace(/^\.\.\//, '')
            .replace('.PLACEHOLDER', ext);

        function getStaticPagePath(url) {
            if (url == '/') {
                return ext == '' ? '/' : '/index.PLACEHOLDER';
            }
            const parts = Path.parse(url);
            return `${parts.dir}/${parts.name}.PLACEHOLDER`;
        }
    },
};
