'use strict';

const Promise = require('bluebird');

module.exports = function (app, engine) {
    return {
        name: 'isError',
        filter(item) {
            return item instanceof Error;
        },
    };
};
