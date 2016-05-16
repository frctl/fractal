'use strict';

const _            = require('lodash');
const beautifyHTML = require('js-beautify').html;

module.exports = function(app, env) {

    return {
        name: 'beautify',
        filter(str) {
            return beautifyHTML(rendered, {
                // TODO: move to config
                indent_size: 4,
                preserve_newlines: true,
                max_preserve_newlines: 1
            });
        }
    }

};
