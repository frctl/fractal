'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const utils   = require('./utils');


module.exports = class Collection {

    constructor(props, items) {
        this.type     = 'collection';
        this.name     = props.name;
        this.order    = props.order;
        this.isHidden = props.isHidden;
        this.label    = props.label || utils.titlize(props.name);
        this.title    = props.title || this.label;
        this._config  = props;
        this._items   = new Set(items || []);
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
        let items = [];
        for (let item of this) {
            if (item instanceof Collection) {
                items = _.concat(items, item.flatten().items);
            } else {
                items.push(item);
            }
        }
        return this.newSelf({
            order: this.order,
            isHidden: this.isHidden,
            label: this.label,
            title: this.title
        }, items)
    }

    newSelf(props, items){
        return new Collection(props, items);
    }

    [Symbol.iterator](){
        return this.items[Symbol.iterator]()
    }
};
