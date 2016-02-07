'use strict';

const _          = require('lodash');
const config     = require('../config');
const logger     = require('../logger');
const Collection = require('../collection');

module.exports = class ComponentCollection extends Collection {

    constructor(props, items) {
        super(props, items);
        const p = this._parent;
        this.status  = props.status  || (p ? p.status : null);
        this.preview = props.preview || (p ? p.preview : null);
        this.display = props.display || (p ? p.display : {});
    }

    static create(props, items) {
        return Promise.resolve(new ComponentCollection(props, items));
    }

    find(handle) {
        if (!handle) {
            return null;
        }
        for (let item of this) {
            if (item.type === 'collection') {
                const search = item.find(handle);
                if (search) return search;
            } else if (item.type === 'component' && (item.handle === handle || `@${item.handle}` === handle)) {
                return item;
            } else if (item.type === 'component') {
                let variant = item.getVariantByHandle();
                if (variant) return variant;
            }
        }
    }

    filter(predicate) {
        if (
            (_.isArray(predicate) && predicate[0] === 'status') ||
            (_.isObject(predicate) && predicate.status)
        ) {
            let items = [];
            for (let item of this) {
                if (item.type === 'collection') {
                    let collection = item.filter(predicate);
                    if (collection.size) {
                        items.push(collection);
                    }
                } else {
                    let statuses = item.statuses;
                    let search = _.isArray(predicate) ? predicate[1] : predicate.status;
                    if (_.includes(statuses, search)) {
                        items.push(item);
                    }
                }
            }
            return _.clone(this);
        }
        return super.filter(predicate);
    }

    _getAttributes() {
        const attrs = {
            order:     this.order,
            isHidden:  this.isHidden,
            label:     this.label,
            title:     this.title,
            name:      this.name,
            handle:    this.handle,
            labelPath: this.labelPath,
            path:      this.path
        };
        if (this._parent) {
            attrs.parent = this._parent;
        } else {
            attrs.status  = this.status;
            attrs.preview = this.preview;
            attrs.display = this.display;
            attrs.context = this.context;
        }
        return attrs;
    }

};
