'use strict';

const markdown = require('../../../core/markdown');

module.exports = function () {
    return {
        name: 'markdown',
        filter: (str) => markdown(str),
    };
};
