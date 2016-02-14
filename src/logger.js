'use strict';

const winston = require('winston');
const _       = require('lodash');
const chalk   = require('chalk');

const mute = process.env.NODE_ENV === 'TEST';

const logger = module.exports = {

    started(str) {
        mute ? console.log(chalk.magenta(`⚑ ${str}`)) : null;
    },

    logLn(str) {
        mute ? console.log(str): null;
    },

    logInfo(str) {
        mute ? console.log(chalk.grey(`⚑ ${str}`)) : null;
    },

    ended(str) {
        mute ? console.log(str) : null;
    },

    taskSuccess(str) {
        mute ? console.log(chalk.green(`✔ ${str}`)) : null;
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
