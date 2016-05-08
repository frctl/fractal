'use strict';

const Promise      = require('bluebird');
const _            = require('lodash');
const utils        = require('./utils');

module.exports = class Collection {

    /**
     * Constructor. Takes optional array of items to populate
     * the initial collection with.
     * @param  {Array} items
     * @return {Collection}
     */
    constructor(items) {
        this.type   = 'collection';
        this._items = new Set(items || []);
        this._props = new Map();
        this._source = null;
    }

    /**
     * Getter for private _source property
     * @return {Source}
     */
    get source() {
        return this._source;
    }

    /**
     * Return the length of the items set
     * @return {Number}
     */
    get size() {
        return this._items.size;
    }

    /**
     * Sets a property.
     * @param {String} key
     * @param {*} value
     */
    setProp(key, value) {
        this._props.set(key, value);
        return this;
    }

    /**
     * Iterates over a supplied object and sets properties
     * based on the object's key:value pairs
     * @param {Object} obj An object of properties to set
     */
    setProps(obj) {
        _.forEach(obj, (value, key) => {
            this.setProp(key, value);
        });
        return this;
    }

    /**
     * Return a property value
     * @param  {String} key
     * @return {*}
     */
    getProp(key) {
        return this._props.get(key);
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
     * Recursively converts the collection and it's contents to a
     * JSON-serializable plain object.
     * @return {Object}
     */
    toJSON() {
        return {
            type: this.type,
            items: this.toArray().map(i => (i.toJSON ? i.toJSON() : i))
        };
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
     * Return a new collection that only includes
     * non-collection-type items
     * @return {Collection}
     */
    entities() {
        return this.newSelf(this.toArray().filter(i => i.type !== 'collection'));
    }

    /**
     * Return a new collection that only
     * includes collection-type items
     * @return {Collection}
     */
    collections() {
        return this.newSelf(this.toArray().filter(i => i.type === 'collection'));
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
            for (let item of items) {
                if (item.type === 'collection') {
                    const children = item.toArray();
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

};
