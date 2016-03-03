'use strict';

const chalk   = require('chalk');
const _       = require('lodash');
const shell   = require('shelljs');
var kexec = require('kexec');
const console = require('../console');

module.exports = {

    command: 'restart',

    config: {
        description: 'Restart Fractal after changes to your fractal.js file',
        scope: ['project'],
        hidden: false
    },

    action: function (args, done) {
        kexec('fractal');
        done();
    }

};
