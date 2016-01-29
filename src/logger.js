'use strict';

const winston = require('winston');
const _       = require('lodash');

const logger = module.exports = {
    dump(data) {
        if (!data) {
            return console.log(data);
        }
        if (!_.isFunction(data.then)) {
            data = Promise.resolve(data);
        }
        data.then(data => console.log(JSON.stringify(data, function (key, val) {
            if (this[key] instanceof Buffer) {
                return '<Buffer>';
            }
            return val;
        }, 4)));
    }
};

Object.assign(logger, winston);
