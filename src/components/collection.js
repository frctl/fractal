'use strict';

const _          = require('lodash');
const config     = require('../config');
const logger     = require('../logger');
const EntityCollection = require('../entity-collection');

module.exports = class ComponentCollection extends EntityCollection {

    constructor(props, items) {
        super(props, items);
        this.status  = props.status  || this._parent.status;
        this.preview = props.preview || this._parent.preview;
        this.display = props.display || this._parent.display;
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
                let variant = item.getVariantByHandle(handle);
                if (variant) return variant;
            }
        }
    }
    
    //
    // filter(predicate) {
    //     if (
    //         (_.isArray(predicate) && predicate[0] === 'status') ||
    //         (_.isObject(predicate) && predicate.status)
    //     ) {
    //         let items = [];
    //         for (let item of this) {
    //             if (item.type === 'collection') {
    //                 let collection = item.filter(predicate);
    //                 if (collection.size) {
    //                     items.push(collection);
    //                 }
    //             } else {
    //                 let statuses = item.statuses;
    //                 let search = _.isArray(predicate) ? predicate[1] : predicate.status;
    //                 if (_.includes(statuses, search)) {
    //                     items.push(item);
    //                 }
    //             }
    //         }
    //         return _.clone(this);
    //     }
    //     return super.filter(predicate);
    // }
    //
    // _getAttributes() {
    //     const attrs = {
    //         order:     this.order,
    //         isHidden:  this.isHidden,
    //         label:     this.label,
    //         title:     this.title,
    //         name:      this.name,
    //         handle:    this.handle,
    //         labelPath: this.labelPath,
    //         path:      this.path
    //     };
    //     if (this._parent) {
    //         attrs.parent = this._parent;
    //     } else {
    //         attrs.status  = this.status;
    //         attrs.preview = this.preview;
    //         attrs.display = this.display;
    //         attrs.context = this.context;
    //     }
    //     return attrs;
    // }

};
