'use strict';

const co = require('co');
const source = require('../source');

const resolver = module.exports = function (context) {

    const components = yield source(app.get('components.path'), 'components');
    const resolve = function resolve(obj) {

        const mapper = co(function* (val, key){
            const item = yield Promise.resolve(val);
            if (_.isFunction(item)) {
                return resolve(item());
            }
            if (_.isObject(item) || _.isArray(item)) {
                return resolve(item);
            }
            if (_.startsWith(item, '@')) {
                const parts = val.split('.');
                const handle = parts.shift();
                let entity = components.find(handle);
                if (entity) {
                    if (entity.type === 'component') {
                        entity = entity.getVariant();
                    }
                    if (parts.length) {
                        const entityContext = yield resolver(entity.context);
                        return _.get(entityContext, parts.join('.'), null);
                    }
                    return entity.getResolvedContext();
                }
                logger.warn(`Could not resolve context reference for ${item}`);
                return null;
            }
            return item;
        });

        const iterator = _.isArray(obj) ? 'map' : 'mapValues';
        return _[iterator](obj, mapper);
    };
    
    return resolve(context);
};
