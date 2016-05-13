'use strict';

module.exports = function(app, env) {

    return {
        name: 'render',
        async: false,
        filter: (str, context) => env.renderString(str, context || {})
    }

};
