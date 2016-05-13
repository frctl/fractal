'use strict';

const markdown = require('../../../core/markdown');

module.exports = function(app, env) {

    return {
        name: 'markdown',
        filter: str => markdown(str)
    }

};
