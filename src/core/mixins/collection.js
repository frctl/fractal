'use strict';

const mixin = require('mixwith').Mixin;

module.exports = mixin((superclass) => class Collection extends superclass {

    constructor(){
        super();
        this._items = new Set(items || []);
    }

});
