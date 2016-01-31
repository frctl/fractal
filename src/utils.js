'use strict';

const Promise   = require('bluebird');
const Path      = require('path');
const anymatch  = require('anymatch');
const fang      = require('@allmarkedup/fang');
const _         = require('lodash');


module.exports = {

    lang(filePath) {
        return fang(filePath) || {
            name:  Path.parse(filePath).ext.replace('.','').toUpperCase(),
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
    }
};
