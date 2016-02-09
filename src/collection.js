'use strict';

const Promise      = require('bluebird');
const _            = require('lodash');
const utils        = require('./utils');

module.exports = class Collection {

    constructor(props, items) {
        this.type      = 'collection';
        this._items    = new Set(items || []);
    }

    items() {
        return Array.from(this._items);
    }

    setItems(items) {
        this._items = new Set(items || []);
        return this;
    }

    get size() {
        return this._items.size;
    }

    toJSON() {
        const result = utils.toJSON(this);
        result.items = this.items().map(i => i.toJSON());
        return result;
    }

    find(str) {
        if (this.size === 0) {
            return undefined;
        }
        for (let item of this) {
            if (item.type === 'collection') {
                const search = item.find(str);
                if (search) return search;
            } else if (item.handle === str || `@${item.handle}` === str) {
                return item;
            }
        }
    }

    findCollection(str) {
        const type = str.startsWith('@') ? 'handle' : (str.includes('/') ? 'path' : 'handle');
        if (this.size === 0) {
            return undefined;
        }
        for (let item of this) {
            if (item.type === 'collection') {
                if (item[type] === str || `@${item[type]}` === str)  {
                    return item;
                }
                const search = item.findCollection(str);
                if (search) return search;
            }
        }
    }

    flatten(deep) {
        return this.newSelf(this.flattenItems(this.items(), deep));
    }

    squash(){
        return this.newSelf(this.squashItems(this.items()));
    }

    filter(predicate){
        return this.newSelf(this.filterItems(this.items(), predicate));
    }

    filterItems(items, predicate) {
        let matcher = _.iteratee(predicate);
        let ret = [];
        for (let item of items) {
            if (item.type === 'collection') {
                let collection = item.filter(predicate);
                if (collection.size) {
                    ret.push(collection);
                }
            } else {
                if (matcher(item)) {
                    ret.push(item);
                }
            }
        }
        return ret;
    }

    flattenItems(items, deep) {
        let ret = [];
        for (let item of items) {
            if (item.type === 'collection') {
                ret = _.concat(ret, this.flattenItems(item.items()));
            } else {
                if (deep && _.isFunction(item.flatten)) {
                    ret = _.concat(ret, item.flatten());
                } else {
                    ret.push(item);
                }
            }
        }
        return ret;
    }

    squashItems(items) {
        const squashed = [];
        function squash(items){
            items = _.sortBy(items, function(i){
                return i.type === 'collection' ? 1 : 0;
            });
            for (let item of items) {
                if (item.type === 'collection') {
                    const children = item.items();
                    const entities = children.filter(c => c.type !== 'collection');
                    const collections = children.filter(c => c.type == 'collection');
                    if (entities.length) {
                        squashed.push(item.newSelf(entities));
                    } else {
                        squash(collections);
                    }
                } else {
                    squashed.push(item);
                }
            }
        }
        squash(items);
        return squashed;
    }

    newSelf(items) {
        const self = _.clone(this);
        self.setItems(items);
        return self;
    }

    [Symbol.iterator]() {
        return this.items()[Symbol.iterator]();
    }
};
