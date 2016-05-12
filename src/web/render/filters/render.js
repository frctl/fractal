'use strict';

module.exports = function(app, env) {

    return {

        name: 'nunj',

        filter(str, context) => {
            return env.renderString(str, context || {});
        },

        async: false
    }

};
