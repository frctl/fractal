'use strict';

const _        = require('lodash');
const logger   = require('../logger');
const Entities = require('../entities');

module.exports = class ComponentCollection extends Entities {

    constructor(props, items) {
        super(props, items);
    }

};
