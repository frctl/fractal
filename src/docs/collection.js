'use strict';

const _        = require('lodash');
const console   = require('../console');
const Entities = require('../entities');

module.exports = class ComponentCollection extends Entities {

    constructor(props, items) {
        super(props, items);
    }

    pages() {
        return super.entities();
    }
};
