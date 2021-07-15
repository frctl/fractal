'use strict';

const _ = require('lodash');
const utils = require('@frctl/core').utils;

module.exports = function (fractal) {
    return function (path) {
        let env = this.lookup('_env');
        let request = env.request || this.lookup('_request') || this.ctx.request;

        return !env || env.server
            ? path
            : utils.relUrlPath(path, _.get(request, 'path', '/'), fractal.web.get('builder.urls'));
    };
};
