'use strict';

module.exports = function (app) {
    return {
        name: 'log',
        value(item, type) {
            app.cli.console[type || 'log'](item);
        },
    };
};
