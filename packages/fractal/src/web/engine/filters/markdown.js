'use strict';

const markdown = require('@frctl/core').markdown;

module.exports = function () {
    return {
        name: 'markdown',
        filter: (str) => markdown(str),
    };
};
