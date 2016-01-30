'use strict';

const _          = require('lodash');
const config     = require('../config');
const logger     = require('../logger');
const Collection = require('../collection');
const matcher    = require('../matchers');

module.exports = class ComponentCollection extends Collection {

    constructor(props, items) {
        super(props, items);
        this._context = props.context || {};
        this._parent = props.parent || undefined;
    }

    get context(){
        if (this._parent) {
            return _.defaultsDeep(this._context, this._parent.context);
        }
        return _.defaultsDeep(this._context, config.get('components.view.context', {}));
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
