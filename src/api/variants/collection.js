'use strict';

const _                = require('lodash');
const EntityCollection = require('../../core/entities/collection');

class ComponentCollection extends EntityCollection {

    constructor(props, items, app){
        super(app);
        this.setItems(items);
    }

}
