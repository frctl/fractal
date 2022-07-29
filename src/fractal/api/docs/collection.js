'use strict';

const EntityCollection = require('../../../core').entities.Collection;

module.exports = class DocCollection extends EntityCollection {
    constructor(config, items, parent) {
        super(config.name, config, items, parent);
    }

    pages() {
        return super.entities();
    }
};
