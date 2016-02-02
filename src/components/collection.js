'use strict';

const _          = require('lodash');
const config     = require('../config');
const logger     = require('../logger');
const Collection = require('../collection');
const matcher    = require('../matchers');

module.exports = class ComponentCollection extends Collection {

    constructor(props, items) {
        super(props, items);

        const c = config.get('components');
        const p = this._parent;

        this.status  = props.status  || (p ? p.status  : c.status.default);
        this.preview = props.preview || (p ? p.preview : c.preview.layout);
        this.display = props.display || (p ? p.display : c.preview.display);
    }

    get context() {
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

    filter(predicate){
        if (
            (_.isArray(predicate) && predicate[0] === 'status') ||
            (_.isObject(predicate) && predicate.status)
        ){
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
            return this.newSelf(items);
        }
        return super.filter(predicate);
    }

};
