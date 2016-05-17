'use strict';

const Promise = require('bluebird');

module.exports = function(app, engine) {

    return {
        name: 'async',
        async: true,
        filter: (p, cb) => Promise.resolve(p).then(result => cb(null, result)).catch(cb)
    }

};
