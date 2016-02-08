'use strict';

const _                = require('lodash');
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

};
