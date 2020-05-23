'use strict';

const WebError = require('../../error');

module.exports = function (app, engine) {
    return {
        name: 'throw',
        value(code, message) {
            code = code || 500;
            throw new WebError(code, message || `${code} error`);
        },
    };
};
