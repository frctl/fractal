'use strict';

const WebError = require('../error');

module.exports = function(app, engine) {

    return {
        name: 'throw',
        value: function(message) {
            throw new WebError(message);
        }
    }

};
