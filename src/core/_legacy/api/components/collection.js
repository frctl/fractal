'use strict';

const Promise  = require('bluebird');
const _        = require('lodash');
const Entities = require('../entities');

module.exports = class ComponentCollection extends Entities {

    constructor(props, items) {
        super(props, items);
    }

    find() {
        return this._source.find.apply(this, arguments);
    }

    components() {
        return super.entities();
    }

    assets() {
        return super.assets();
    }

    variants() {
        return this.source.variants.apply(this, arguments);
    }

};
