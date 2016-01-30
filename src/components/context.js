'use strict';

const co     = require('co');
const _      = require('lodash');
const source = require('../source');
const app    = require('../app');

const resolver = module.exports = co.wrap(function* (context) {

    const components = yield source(app.get('components.path'), 'components');

    const resolve = co.wrap(function* (obj) {

        const mapper = co.wrap(function* (item, key){

            item = yield Promise.resolve(item);
            if (_.isFunction(item)) {
                return resolve(item());
            }
            if (_.isArray(item) || _.isObject(item)) {
                return resolve(item);
            }
            if (_.isString(item) && _.startsWith(item, '@')) {
                const parts = item.split('.');
                const handle = parts.shift();
                let entity = components.find(handle);
                if (entity) {
                    if (entity.type === 'component') {
                        entity = entity.getVariant();
                    }
                    if (parts.length) {
                        const entityContext = yield resolve(entity.context);
                        return _.get(entityContext, parts.join('.'), null);
                    }
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
});
