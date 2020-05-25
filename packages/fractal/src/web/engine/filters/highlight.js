'use strict';

const highlight = require('@frctl/core').highlighter;

module.exports = function () {
    return {
        name: 'highlight',
        filter: (str, lang) => highlight(str, lang),
    };
};
