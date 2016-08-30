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
            if (!obj) {
                return Promise.resolve(null);
            }
            const iterator = _.isArray(obj) ? 'map' : 'mapValues';
            const resolver = iterator == 'map' ? 'all': 'props';

            return Promise[resolver](_[iterator](obj, mapper));
        }

        function mapper(item, key) {

            if (!item) {
                return Promise.resolve(null);
            }

            if (item.then) {
                return item;
            }

            if (_.isString(item) && _.startsWith(item, '\\@')) {
                return item.replace(/^\\@/, '@');
            }

            if (_.isString(item) && _.startsWith(item, '@')) {
                const parts = item.split('.');
                const handle = parts.shift();
                let entity = source.find(handle);
                if (entity) {
                    entity = self.entity(entity);
                    if (entity._hasResolvedContext) {
                        let context = entity.getContext();
                        if (parts.length) {
                            return _.get(context, parts.join('.'), null);
                        }
                        return context;
                    } else {
                        return resolve(entity.context).then(entityContext => {
                            let clonedContext = _.cloneDeep(entityContext);
                            if (parts.length) {
                                return _.get(clonedContext, parts.join('.'), null);
                            }
                            return clonedContext;
                        });
                    }
                }
                Log.warn(`Could not resolve context reference for ${item}`);
                return null;
            }

            if (_.isArray(item) || _.isObject(item)) {
                return resolve(item);
            }

            return item;
        }

        return resolve(context).then(ctx => _.cloneDeep(ctx));
    }

};
