'use strict';

const _    = require('lodash');
const cli  = require('../cli');
const Path = require('path');

module.exports = {

    name: 'new',

    opts: {
        description: 'Create a new Fractal project',
        private: true
    },

    callback: function (args, opts, app) {
        if (!args[0]) {
            cli.error('You must specify a path - e.g. \'fractal new foo/bar\'');
            process.exit(1);
        }
        const newPath = args[0].startsWith('/') ? args[0] : Path.join(process.cwd(), args[0]);

        return;
    }

};
