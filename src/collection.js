'use strict';

const Promise = require('bluebird');

module.exports = class Collection {
    constructor(props, items) {
        this.type = 'collection';
        this.items = items || [];
    }
    static create(props, items){
        return Promise.resolve(new Collection(props, items));
    }
}
