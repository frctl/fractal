'use strict';

const _         = require('lodash');
const highlight = require('../../../core/highlighter');

module.exports = function(app, env) {

    return {
        name: 'highlight',
        filter: (str, lang) => highlight(str, lang)
    }

};
