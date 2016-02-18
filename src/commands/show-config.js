'use strict';

const chalk = require('chalk');
const _     = require('lodash');
const cli   = require('../cli');

module.exports = {

    name: 'show-config',

    opts: {
        description: 'Display project configuration info'
    },

    callback: function (args, opts, app) {
        if (args[0]) {
            return cli.dump(app.get(args[0]));
        }
        return cli.dump(app.get());
    }

};
