'use strict';

const markdown = require('../../../core/markdown');

module.exports = function (app, engine) {
    return {
        name: 'markdown',
        filter: str => markdown(str),
    };
};
