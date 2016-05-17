'use strict';

const _    = require('lodash');
const Path = require('path');

module.exports = function(app, engine) {

    return {
        name: 'log',
        value: function(item, type) {
            app.cli.console[type || 'log'](item);
        }
    }

};
