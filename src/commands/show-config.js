'use strict';

const chalk = require('chalk');
const _     = require('lodash');
const console   = require('../console');

module.exports = {

    command: 'show-config [path]',

    config: {
        description: 'Display project configuration info',
        scope: ['project']
    },

    action: function (args, done) {
        console.dump(this.fractal.get(args.path));
        done();
    }

};
