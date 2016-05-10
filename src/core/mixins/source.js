'use strict';

const _         = require('lodash')
const mixin     = require('mixwith').Mixin;
const mix       = require('mixwith').mix;
const utils     = require('../utils');
const Heritable = require('./heritable');

module.exports = mixin((superclass) => class Source extends Heritable(superclass) {

    constructor(){
        super(...arguments);
    }

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

    getProp(key) {
        const upstream = this.get(`default.${key}`);
        const prop     = this._props.get(key);
        return utils.mergeProp(prop, upstream);
    }

});
