'use strict';

const _ = require('lodash');
const mix = require('../mixins/mix');
const Collection = require('../mixins/collection');
const Heritable = require('../mixins/heritable');
const Entity = require('../mixins/entity');

module.exports = class EntityCollection extends mix(Heritable, Collection, Entity) {

    constructor(name, config, items, parent) {
        super();
        this.initEntity(name, config, parent);
        this.setHeritable(parent);
        this.setItems(items);

        Object.defineProperty(this, 'status', {
            enumerable: true,
            get() {
                return this.source.statusInfo(this.getProp('status'));
            },
        });

        this.setProps(config);
    }

    /**
     * Return a new collection that only includes
     * non-collection-type items
     * @return {Collection}
     */
    entities() {
        return this.newSelf(this.toArray().filter(i => ! i.isCollection));
    }

    toJSON() {
        const self = super.toJSON();
        self.isCollection = true;
        self.items = this.toArray().map(i => (i.toJSON ? i.toJSON() : i));
        return self;
    }

};
