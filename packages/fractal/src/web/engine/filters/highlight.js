'use strict';

const highlight = require('../../../core/highlighter');

module.exports = function () {
    return {
        name: 'highlight',
        filter: (str, lang) => highlight(str, lang),
    };
};
