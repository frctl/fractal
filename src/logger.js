'use strict';

const winston = require('winston');
const _       = require('lodash');
const chalk   = require('chalk');

const mute = process.env.NODE_ENV === 'TEST';

const logger = module.exports = {

    started(str) {
        mute ? null : console.log(chalk.magenta(`⚑ ${str}`));
    },

    logLn(str) {
        mute ? null : console.log(str);
    },

    logInfo(str) {
        mute ? null : console.log(chalk.grey(`⚑ ${str}`));
    },

    ended(str) {
        mute ? null : console.log(str);
    },

    taskSuccess(str) {
        mute ? null : console.log(chalk.green(`✔ ${str}`));
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
