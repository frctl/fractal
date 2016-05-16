'use strict';

const _                = require('lodash');
const EntityCollection = require('../../core/entities/collection');

module.exports = class ComponentCollection extends EntityCollection {

    constructor(config, items, parent){
        super(config.name, config, items, parent);
    }

    pages() {
        return super.entities();
    }

}
