'use strict';

const _          = require('lodash');
const config     = require('../config');
const Collection = require('../collection');
const matcher    = require('../matchers');

module.exports = class ComponentCollection extends Collection {

    constructor(props, items) {
        super(props, items);
    }

    static create(props, items) {
        return Promise.resolve(new ComponentCollection(props, items));
    }

    find(handle) {
        const parts = matcher.splitHandle(handle);
        const component = super.find(parts.component);
        if (component && parts.variant) {
            return component.getVariant(parts.variant);
        }
        return component;
    }

    newSelf(props, items){
        return new ComponentCollection(props, items);
    }

};
