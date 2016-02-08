'use strict';

const co        = require('co');
const _         = require('lodash');
const logger    = require('../logger');

module.exports = function(context, components) {

    const resolve = co.wrap(function* (obj) {

        const mapper = co.wrap(function* (item, key) {

            item = yield Promise.resolve(item);
            if (_.isFunction(item)) {
                return resolve(item());
            }
            if (_.isArray(item) || _.isObject(item)) {
                return resolve(item);
            }
            if (_.isString(item) && _.startsWith(item, '@')) {
                const parts  = item.split('.');
                const handle = parts.shift();
                let entity   = components.find(handle);
                if (entity && parts.length) {
                    if (entity.type === 'component') {
                        entity = entity.getVariant();
                    }
                    const entityContext = yield resolve(entity.context);
                    return _.get(entityContext, parts.join('.'), null);
                }
                logger.warn(`Could not resolve context reference for ${item}`);
                return null;
            }

            return item;
        });

        const iterator = _.isArray(obj) ? 'map' : 'mapValues';
        return yield _[iterator](obj, mapper);
    });

    return resolve(context);
};
