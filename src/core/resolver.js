'use strict';

const Promise = require('bluebird');
const co = require('co');
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
                    const parts = item.split('.');
                    const handle = parts.shift();
                    let entity = source.find(handle);
                    if (entity) {
                        entity = self.entity(entity);
                        const entityContext = yield resolve(entity.context);
                        if (parts.length) {
                            return _.get(entityContext, parts.join('.'), null);
                        }
                        return entityContext;
                    }
                    Log.warn(`Could not resolve context reference for ${item}`);
                    return null;
                }
                if (_.isString(item) && _.startsWith(item, '\\@')) {
                    return item.replace(/^\\@/, '@');
                }

                return item;
            });

            const iterator = _.isArray(obj) ? 'map' : 'mapValues';
            return yield _[iterator](obj, mapper);
        });

        return resolve(context);
    },

};
