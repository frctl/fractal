'use strict';

const Promise      = require('bluebird');
const _            = require('lodash');
const utils        = require('./utils');

module.exports = class Collection {

    constructor(props, items) {
        this.type   = 'collection';
        this._items = new Set(items || []);
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
        return {
            type: this.type,
            items: this.items().map(i => i.toJSON())
        };
    }

    first() {
        return this.items()[0];
    }

    last() {
        return this.items()[this.size - 1];
    }

    eq(pos) {
        if (pos < 0) {
            pos = (this.size + pos);
        }
        return this.items()[pos];
    }

    entities() {
        return this.newSelf(Array.from(this._items).filter(i => i.type !== 'collection'));
    }

    collections() {
        return this.newSelf(Array.from(this._items).filter(i => i.type === 'collection'));
    }

    find() {
        if (this.size === 0 || arguments.length === 0) {
            return;
        }
        for (let item of this) {
            if (item.type === 'collection') {
                const search = item.find.apply(item, arguments);
                if (search) return search;
            } else {

                const matcher = this._makePredicate.apply(null, arguments);
                if (matcher(item)) return item;
            }
        }
    }

    findCollection() {
        if (this.size === 0 || arguments.length === 0) {
            return;
        }
        for (let item of this) {
            if (item.type === 'collection') {
                const matcher = this._makePredicate.apply(null, arguments);
                if (matcher(item)) return item;
                const search = item.findCollection.apply(item, arguments);
                if (search) return search;
            }
        }
    }

    flatten() {
        return this.newSelf(this.flattenItems(this.items()));
    }

    flattenDeep() {
        return this.newSelf(this.flattenItems(this.items(), true));
    }

    squash() {
        return this.newSelf(this.squashItems(this.items()));
    }

    filter() {
        const args = Array.from(arguments);
        args.unshift(this.items());
        return this.newSelf(this.filterItems.apply(this, args));
    }

    filterItems(items) {
        const predicate = Array.prototype.slice.call(arguments, 1);
        let matcher = this._makePredicate.apply(null, predicate);
        let ret = [];
        for (let item of items) {
            if (item.type === 'collection') {
                let collection = item.filter.apply(item, predicate);
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
                ret = _.concat(ret, this.flattenItems(item.items(), deep));
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
        function squash(items) {
            items = _.sortBy(items, function (i) {
                return i.type === 'collection' ? 1 : 0;
            });
            for (let item of items) {
                if (item.type === 'collection') {
                    const children = item.items();
                    const entities = children.filter(c => c.type !== 'collection');
                    const collections = children.filter(c => c.type == 'collection');
                    if (entities.length) {
                        squashed.push(item.newSelf(entities));
                    }
                    if (collections.length) {
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

    _makePredicate() {
        if (arguments.length == 1 && _.isString(arguments[0]) && arguments[0].startsWith('@')) {
            return _.iteratee(['handle', arguments[0].replace('@', '')]);
        }
        if (arguments.length === 2) {
            return _.iteratee([arguments[0], arguments[1]]);
        }
        return _.iteratee(arguments[0]);
    }

};
