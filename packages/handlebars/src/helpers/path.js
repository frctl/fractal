'use strict';

const Handlebars = require('handlebars');
const _          = require('lodash');
const utils      = require('@frctl/fractal').utils;

module.exports = function(fractal){

    return function staticPath(path){

        const options = Array.from(arguments).pop();
        const root = options.data.root;

        if (path.includes('{{')) {
            let context = _.defaults({}, this, _.pickBy(root, (item, key) => key.startsWith('_')));
            const tpl = Handlebars.compile(path, {
                data: false
            });
            path = tpl(context);
        }

        if (! root || ! root._env || root._env.server) {
            return path;
        }

        return utils.relUrlPath(path, _.get(root._env.request || root._request, 'path', '/'), fractal.web.get('builder.urls'));
    };

};
