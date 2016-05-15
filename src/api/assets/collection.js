'use strict';

const _          = require('lodash');
const mix        = require('../../core/mixins/mix');
const Collection = require('../../core/mixins/collection');

module.exports = class EntityCollection extends mix(Collection) {

    constructor(config, items){
        super();
        this.setItems(items);
    }

}
