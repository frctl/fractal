'use strict';

const Path = require('path');

module.exports = function(app, engine) {

    return {
        name: 'static',
        value: function(path) {
            if (path.startsWith('http')) {
                return path;
            }
            return Path.join('/', app.get('web.static') || '/', path);
        }
    }

};
