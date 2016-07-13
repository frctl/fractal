'use strict';

const Handlebars = require('handlebars');
const _          = require('lodash');
const utils      = require('@frctl/fractal').utils;

module.exports = function(fractal){

    return function staticPath(path, root){
        root = this._config ? this : root;

        if (! root || ! root._env || root._env.server) {
            return path;
        }

        return utils.relUrlPath(path, _.get(root._request, 'path', '/'), fractal.web.get('builder.urls'));
    };

};
