'use strict';

const chalk = require('chalk');

module.exports = {

    log: {},

    success: {
        prefix: '✔',
        style: chalk.green,
    },

    debug: {
        prefix: '⚡',
        style: chalk.dim,
    },

    notice: {
        prefix: '⚑'
    },

    alert: {
        prefix: '★',
        style: chalk.yellow.bold,
    },

    error: {
        prefix: '✘',
        style: chalk.red,
    },

    delimiter: chalk.magenta('fractal ➤')

};
