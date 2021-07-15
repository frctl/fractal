'use strict';

const Handlebars = require('handlebars');
const _ = require('lodash');
const utils = require('@frctl/core').utils;

module.exports = function (fractal) {
    return function staticPath(path) {
        const options = Array.from(arguments).pop();
        const root = options.data.root;

        // TODO: what is this for?
        // Handlebars supports subexpressions, so this should not be necessary.
        // Other template adapters do not have this implemented either.
        // Remove in next major release if noone understands.
        if (path.includes('{{')) {
            let context = _.defaults(
                {},
                this,
                _.pickBy(root, (item, key) => key.startsWith('_'))
            );
            const tpl = Handlebars.compile(path, {
                data: false,
            });
            path = tpl(context);
        }

        if (!root || !root._env || root._env.server) {
            return path;
        }

        return utils.relUrlPath(
            path,
            _.get(root._env.request || root._request, 'path', '/'),
            fractal.web.get('builder.urls')
        );
    };
};
