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
        this.items    = items || [];
        this.label    = props.label || utils.titlize(props.name);
        this.title    = props.title || this.label;
    }

    static create(props, items) {
        return Promise.resolve(new Collection(props, items));
    }

    toJSON() {
        return utils.toJSON(this);
    }

    find(handle) {
        const isRef = handle.startsWith('@');
        if (this.items.length === 0) {
            return undefined;
        }
        for (let i = 0; i < this.items.length; i++) {
            let item = this.items[i];
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

};
