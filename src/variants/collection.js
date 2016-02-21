'use strict';

const Promise  = require('bluebird');
const _        = require('lodash');
const Entities = require('../entities');

module.exports = class ComponentCollection extends Entities {

    constructor(props, items) {
        super(props, items);
        this._parent        = props.parent;
        this._status        = this._parent._status;
        this._prefix        = this._parent._prefix;
        this._preview       = this._parent._preview;
        this._display       = this._parent._display;
        this._tags          = this._parent._tags;
    }

};
