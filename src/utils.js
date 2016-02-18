'use strict';

const Promise   = require('bluebird');
const Path      = require('path');
const minimist  = require('minimist');
const fang      = require('@allmarkedup/fang');
const _         = require('lodash');

module.exports = {

    lang(filePath) {
        return fang(filePath) || {
            name:  Path.parse(filePath).ext.replace('.', '').toUpperCase(),
            mode:  'text',
            scope: null,
            color: null
        };
    },

    titlize: function (str) {
        return _.startCase(str);
    },

    slugify: str => _.kebabCase(_.deburr(str)).toLowerCase(),

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
           opts: opts
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
   }

};
