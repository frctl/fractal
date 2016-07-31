'use strict';

const _ = require('lodash');
const Stream = require('../array-stream');
const mixin = require('mixwith').Mixin;

module.exports = mixin((superclass) => class Collection extends superclass {

    constructor() {
        super();
        this.addMixedIn('Collection');
        this._items = new Set([]);
        this.isCollection = true;
    }

    /**
     * Return the length of the items set
     * @return {Number}
     */
    get size() {
        return this._items.size;
    }

    /**
     * Returns the collection items, converted to an array.
     * Alias for toArray()
     * @return {Array} The items in the collections
     */
    items() {
        return this.toArray();
    }

    /**
     * Returns the collection items, converted to an array.
     * @return {Array}
     */
    toArray() {
        return Array.from(this._items);
    }

    /**
     * Replace the contents of the collection with
     * a new set of items.
     * @param {Array} items
     * @return {Collection}
     */
    setItems(items) {
        this._items = new Set(items || []);
        return this;
    }

    /**
     * Pushes an item onto the end of the collection
     * @param  {Object} item  The item to add
     * @return {Collection}
     */
    pushItem(item) {
        this._items.add(item);
        return this;
    }

    removeItem(item) {
        this._items.delete(item);
        return this;
    }

    /**
     * Recursively converts the collection and its contents to a
     * JSON-serializable plain object.
     * @return {Object}
     */
    toJSON() {
        return {
            isCollection: true,
            items: this.toArray().map(i => (i.toJSON ? i.toJSON() : i)),
        };
    }

    toStream() {
        return new Stream(this.flatten().toArray());
    }

    each(fn) {
        _.forEach(this.items(), fn);
        return this;
    }

    forEach(fn) {
        return this.each(fn);
    }

    map(fn) {
        const items = _.map(this.items(), fn);
        return this.newSelf(items);
    }

    /**
     * Get the first item in the collections
     * @return {Object|undefined} The first item in the array
     */
    first() {
        return this.toArray()[0];
    }

    /**
     * Get the last item in the array
     * @return {object|undefined} The last item in the array
     */
    last() {
        return this.toArray()[this.size - 1];
    }

    /**
     * Get a collection item by index
     * @param  {Number} pos        The index of the item to fetch
     * @return {Object|undefined}  A collection item
     */
    eq(pos) {
        if (pos < 0) {
            pos = (this.size + pos);
        }
        return this.toArray()[pos];
    }

    /**
     * Return a new collection that only
     * includes collection-type items
     * @return {Collection}
     */
    collections() {
        return this.newSelf(this.toArray().filter(i => i.isCollection));
    }

    orderBy() {
        let args;
        if (arguments.length === 1 && _.isObject(arguments[0]) && !_.isArrayLikeObject(arguments[0])) {
            args = [_.keys(arguments[0]), _.values(arguments[0])];
        } else {
            args = Array.prototype.slice.call(arguments);
        }
        args.unshift(this.toArray());
        return this.newSelf(_.orderBy.apply(null, args));
    }

    find() {
        if (this.size === 0 || arguments.length === 0) {
            return;
        }
        for (const item of this) {
            if (item.isCollection) {
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
        for (const item of this) {
            if (item.isCollection) {
                const matcher = this._makePredicate.apply(null, arguments);
                if (matcher(item)) return item;
                const search = item.findCollection.apply(item, arguments);
                if (search) return search;
            }
        }
    }

    flatten() {
        return this.newSelf(this.flattenItems(this.toArray()));
    }

    flattenDeep() {
        return this.newSelf(this.flattenItems(this.toArray(), true));
    }

    squash() {
        return this.newSelf(this.squashItems(this.toArray()));
    }

    filter() {
        const args = Array.from(arguments);
        args.unshift(this.toArray());
        return this.newSelf(this.filterItems.apply(this, args));
    }

    filterItems(items) {
        const predicate = Array.prototype.slice.call(arguments, 1);
        const matcher = this._makePredicate.apply(null, predicate);
        const ret = [];
        for (const item of items) {
            if (item.isCollection) {
                const collection = item.filter.apply(item, predicate);
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
        for (const item of items) {
            if (item.isCollection) {
                ret = _.concat(ret, this.flattenItems(item.toArray(), deep));
            } else {
                if (deep && _.isFunction(item.flatten)) {
                    ret = _.concat(ret, item.flatten().toArray());
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
            for (const item of items) {
                if (item.isCollection) {
                    const children = item.toArray();
                    const entities = children.filter(c => !c.isCollection);
                    const collections = children.filter(c => c.isCollection);
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
        return this.toArray()[Symbol.iterator]();
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

});
