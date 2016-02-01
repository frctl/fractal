'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const utils   = require('./utils');

module.exports = class Collection {

    constructor(props, items) {
        this.type     = 'collection';
        this.name     = props.name;
        this.order    = props.order;
        this.handle   = props.handle || utils.slugify(this.name);
        this.ref      = `@${this.handle}`;
        this.isHidden = props.isHidden;
        this._parent  = props.parent;
        this.label    = props.label || utils.titlize(props.name);
        this.title    = props.title || this.label;
        this._context = props.context || {};
        this._config  = props;
        this._items   = new Set(items || []);
        this._labelPath = props.labelPath || null;
        this._path   = props.path || null;
    }

    static create(props, items) {
        return Promise.resolve(new Collection(props, items));
    }

    add(item) {
        this._items.add(item);
    }

    get items() {
        return Array.from(this._items);
    }

    get size() {
        return this._items.size;
    }

    set items(items) {
        this._items = new Set(items || []);
    }

    get path() {
        if (this._path) {
            return this._path;
        }
        return _.trimStart(this._makePath(),'/') || '/';
    }

    get labelPath() {
        if (this._labelPath) {
            return this._labelPath;
        }
        return _.trimStart(this._makeLabelPath(),'/') || '/';
    }

    _makePath(){
        return (this._parent) ? `${this._parent._makePath()}/${this.handle}` : '';
    }

    _makeLabelPath(){
        return (this._parent) ? `${this._parent._makeLabelPath()}/${this.label}` : '';
    }

    toJSON() {
        const result = utils.toJSON(this);
        result.items = this.items.map(i => i.toJSON());
        return result;
    }

    find(str) {
        const type = str.startsWith('@') ? 'ref' : 'handle';
        if (this.size === 0) {
            return undefined;
        }
        for (let item of this) {
            if (item.type !== 'collection' && item[type] === str) {
                return item;
            }
            if (item.type === 'collection') {
                const search = item.find(str);
                if (search) return search;
            }
        }
        return undefined;
    }

    findCollection(str){
        const type = str.startsWith('@') ? 'ref' : (str.includes('/') ? 'path' : 'handle');
        if (this.size === 0) {
            return undefined;
        }
        for (let item of this) {
            if (item.type === 'collection') {
                if (item[type] === str) {
                    return item;
                }
                const search = item.findCollection(str);
                if (search) return search;
            }
        }
        return undefined;
    }

    flatten(withCollections) {
        if (withCollections) {
            return this._flattenWithCollections();
        }
        let items = [];
        for (let item of this) {
            if (item.type === 'collection') {
                items = _.concat(items, item.flatten().items);
            } else {
                items.push(item);
            }
        }
        return this.newSelf({
            order:    this.order,
            isHidden: this.isHidden,
            label:    this.label,
            title:    this.title,
            name:     this.name,
            handle:   this.handle,
            parent:   this.parent
        }, items);
    }

    _flattenWithCollections(){
        let items = [];
        let collections = [];
        for (let item of this) {
            if (item.type === 'collection') {
                const childCollections = item.flatten(true).items;
                collections = collections.concat(childCollections);
            } else {
                items.push(item);
            }
        }
        if (items.length){
            const col = this.newSelf({
                order:    this.order,
                isHidden: this.isHidden,
                label:    this.label,
                title:    this.title,
                name:     this.name,
                handle:   this.handle,
                parent:   this.parent,
                labelPath: this.labelPath,
                path:   this.path
            }, items);
            collections.unshift(col);
        }
        collections = collections.filter(c => c.items.length > 0);
        // collections = collections.concat(items);
        return this.newSelf({}, collections);
    }

    filter(predicate){
        return this.newSelf({
            order:    this.order,
            isHidden: this.isHidden,
            label:    this.label,
            title:    this.title,
            name:     this.name,
            handle:   this.handle,
            parent:   this.parent
        }, _.filter(this.flatten().items, predicate));
    }

    newSelf(props, items) {
        return new Collection(props, items);
    }

    [Symbol.iterator]() {
        return this.items[Symbol.iterator]();
    }
};
