'use strict';

const _        = require('lodash');
const Entities = require('../entities');

module.exports = class ComponentCollection extends Entities {

    constructor(props, items) {
        super(props, items);
        this._status  = props.status  || this._parent._status;
        this._preview = props.preview || this._parent._preview;
        this._display = props.display || this._parent._display;
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
