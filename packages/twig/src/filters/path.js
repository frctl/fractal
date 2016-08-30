'use strict';

const _     = require('lodash');
const utils = require('@frctl/fractal').utils;

module.exports = function(fractal) {

    return function(path) {

        let env = this.context._env;
        let request = env.request || this.context._request;

        return (! env || env.server) ? path : utils.relUrlPath(path, _.get(request, 'path', '/'), fractal.web.get('builder.urls'));
    }

};
