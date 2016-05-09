'use strict';

const mixin = require('mixwith').Mixin;
const utils = require('../utils');

module.exports = mixin((superclass) => class Source extends superclass {

    get label() {
        return this.get('label') || utils.titlize(this.name);
    }

    get title() {
        return this.get('title') || this.label;
    }

    load(){
        return Promise.resolve({});
    }

    refresh(){
        return Promise.resolve({});
    }

    watch() {

    }

    unwatch() {

    }

});
