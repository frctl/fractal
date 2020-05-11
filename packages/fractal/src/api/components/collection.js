'use strict';

const _ = require('lodash');
const EntityCollection = require('../../core/entities/collection');

module.exports = class ComponentCollection extends EntityCollection {

    constructor(config, items, parent) {
        super(config.name, config, items, parent);
    }

    find() {
        return this.source.find.apply(this, arguments);
    }

    components() {
        return super.entities();
    }

    variants() {
        return this.source.variants.apply(this, arguments);
    }

};
