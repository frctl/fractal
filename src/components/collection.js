'use strict';

const _        = require('lodash');
const Entities = require('../entities');

module.exports = class ComponentCollection extends Entities {

    constructor(props, items) {
        super(props, items);
        this._status  = props.status  || this._parent._status;
        this._preview = props.preview || this._parent._preview;
        this._display = props.display || this._parent._display;
        this._tags    = props.tags    || this._parent._tags;
    }

    find() {
        return this._source.find.apply(this, arguments);
    }

    components(){
        return super.entities();
    }

    variants(){
        return this._source.variants.apply(this, arguments);
    }

    get tags() {
        return _.uniq(_.concat(this._tags, this._parent.tags));
    }

};
