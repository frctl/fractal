'use strict';

const Promise  = require('bluebird');
const resolver = require('../../../core/resolver');

module.exports = function(app, env) {

    return {
        name: 'context',
        async: true,
        filter(context, source, cb) {
            if (arguments.length !== 3) {
                throw new Error(`Missing 'source' parameter from 'context' filter`);
            }
            resolver.context(context, source).then(result => cb(null, result)).catch(cb);
        }
    }

};
