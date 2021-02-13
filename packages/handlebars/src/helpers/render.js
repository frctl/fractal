'use strict';

const Handlebars = require('handlebars');
const _ = require('lodash');
const utils = require('@frctl/core').utils;

module.exports = function (fractal) {
    return function render(handle) {
        let context;
        let source = fractal.components;
        const opts = arguments[arguments.length - 1].hash;
        const root = arguments[arguments.length - 1].data.root;
        const merge = opts.merge || false;
        if (arguments.length >= 3) {
            context = arguments[1];
        } else if (arguments.length == 2) {
            context = null;
        } else if (arguments.length == 1) {
            throw new Error(`You must provide a component handle to the render helper.`);
        }
        const entity = source.find(handle);
        if (!entity) {
            throw new Error(`Could not render component '${handle}' - component not found.`);
        }
        const defaultContext = _.cloneDeep(
            entity.isComponent ? entity.variants().default().getContext() : entity.getContext()
        );
        if (!context) {
            context = defaultContext;
        } else if (merge) {
            context = utils.defaultsDeep(context, defaultContext);
        }

        // fix env for rendered components
        let env = JSON.parse(JSON.stringify(root._env));
        _.set(context, '_env', env);

        return entity
            .render(context)
            .then((html) => new Handlebars.SafeString(html))
            .catch(() => {});
    };
};
