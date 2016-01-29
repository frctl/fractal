'use strict';

const Promise = require('bluebird');
const utils   = require('./utils');

module.exports = class Collection {

    constructor(props, items) {
        this.type     = 'collection';
        this._config  = props;
        this.name     = props.name;
        this.order    = props.order;
        this.isHidden = props.isHidden;
        this._items   = new Set(items || []);
        this.label    = props.label || utils.titlize(props.name);
        this.title    = props.title || this.label;
    }

    static create(props, items) {
        return Promise.resolve(new Collection(props, items));
    }

    get items(){
        return Array.from(this._items);
    }

    get size(){
        return this._items.size;
    }

    toJSON() {
        return utils.toJSON(this);
    }

    find(handle) {
        const isRef = handle.startsWith('@');
        if (this.size === 0) {
            return undefined;
        }
        for (let item of this) {
            if (item instanceof Collection) {
                return item.find(handle);
            }
            if (isRef && item.ref === handle) {
                return item;
            }
            if (! isRef && item.handle === handle) {
                return item;
            }
        }
        return undefined;
    }

    flatten() {

    }

    [Symbol.iterator](){
        return this.items[Symbol.iterator]()
    }
};
