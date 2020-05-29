'use strict';

const _ = require('lodash');
const utils = require('@frctl/core').utils;

module.exports = function (app, engine) {
    return {
        name: 'path',
        value(path, req) {
            req = req || this.lookup('request');
            return engine.env === 'server'
                ? path
                : utils.relUrlPath(path, _.get(req, 'path', '/'), app.web.get('builder.urls'));
        },
    };
};
