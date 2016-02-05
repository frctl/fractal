'use strict';

const winston = require('winston');
const _       = require('lodash');
const chalk   = require('chalk');

const logger = module.exports = {

    started(str) {
        console.log(chalk.magenta(`${str}`));
    },

    ended(str) {
        console.log(str);
    },

    taskSuccess(str) {
        console.log(chalk.green(`✔ ${str}`));
    },

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
