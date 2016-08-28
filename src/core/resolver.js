'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const Log = require('./log');

const resolver = module.exports = {

    entity(entity) {
        if (entity.isComponent) {
            entity = entity.variants().default();
        }
        return entity;
    },

    context(context, source) {
        const self = this;

        function resolve(obj) {

            const iterator = _.isArray(obj) ? 'map' : 'mapValues';
            const resolver = iterator == 'map' ? 'all': 'props';

            return Promise[resolver](_[iterator](obj, mapper));
        }

        function mapper(item, key) {

            if (item.then) {
                return item;
            }

            if (_.isArray(item) || _.isObject(item)) {
                return resolve(item);
            }
            if (_.isString(item) && _.startsWith(item, '@')) {
                const parts = item.split('.');
                const handle = parts.shift();
                let entity = source.find(handle);
                if (entity) {
                    entity = self.entity(entity);
                    return resolve(entity.context).then(entityContext => {
                        if (parts.length) {
                            return _.get(entityContext, parts.join('.'), null);
                        }
                        return entityContext;
                    });
                }
                Log.warn(`Could not resolve context reference for ${item}`);
                return null;
            }
            if (_.isString(item) && _.startsWith(item, '\\@')) {
                return item.replace(/^\\@/, '@');
            }

            return item;
        }

        return resolve(context);
    }

};
