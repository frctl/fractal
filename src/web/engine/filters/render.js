'use strict';

module.exports = function (app, engine) {
    return {
        name: 'render',
        async: false,
        filter: (str, context) => engine.renderString(str, context || {}),
    };
};
