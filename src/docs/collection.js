'use strict';

const _        = require('lodash');
const cli   = require('../cli');
const Entities = require('../entities');

module.exports = class ComponentCollection extends Entities {

    constructor(props, items) {
        super(props, items);
    }

    pages() {
        return super.entities();
    }
};
