'use strict';

const chalk   = require('chalk');
const _       = require('lodash');
const shell   = require('shelljs');
const kexec   = require('kexec');
const console = require('../console');

module.exports = {

    command: 'restart',

    config: {
        description: 'Restarts Fractal. Use if you have made changes to your fractal.js file',
        scope: ['project'],
        hidden: false
    },

    action: function (args, done) {
        this.console.notice('Restarting... [any running servers will need to be restarted individually]');
        kexec('fractal', ['--restart']);
        done();
    }

};
