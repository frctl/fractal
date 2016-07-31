'use strict';

const _ = require('lodash');
const mixin = require('mixwith').Mixin;
const utils = require('../utils');

module.exports = mixin((superclass) => class Heritable extends superclass {

    constructor() {
        super();
        super.addMixedIn('Heritable');
        this._props = new Map();
        this._parent = null;
        this._heritable = null;
    }

    setHeritable(arg) {
        if (!_.isArray(arg)) {
            this._parent = arg;
            return this.setHeritable(this._parent.getHeritable());
        }
        this._heritable = new Set(arg || []);

        for (const key of this._heritable) {
            Object.defineProperty(this, key, {
                get() {
                    return this.getProp(key);
                },
                set(value) {
                    this.setProp(key, value);
                },
                enumerable: true,
                configurable: true,
            });
        }

        return this;
    }

    getHeritable() {
        if (this._heritable) {
            return Array.from(this._heritable);
        }
        if (this._parent && _.isFunction(this._parent.getHeritable)) {
            return this._parent.getHeritable();
        }
        return [];
    }

    /**
     * Sets a property.
     * @param {String} key
     * @param {*} value
     */
    setProp(key, value) {
        if (_.includes(this.getHeritable(), key)) {
            this._props.set(key, value);
        }
        return this;
    }

    /**
     * Iterates over a supplied object and sets properties
     * based on the object's key:value pairs
     * @param {Object} obj An object of properties to set
     */
    setProps(obj) {
        _.forEach(obj, (value, key) => {
            this.setProp(key, value);
        });
        return this;
    }

    /**
     * Return a property value
     * @param  {String} key
     * @return {*}
     */
    getProp(key) {
        if (this._parent && _.isFunction(this._parent.getProp)) {
            const upstream = this._parent.getProp(key);
            const prop = this._props.get(key);
            return utils.mergeProp(prop, upstream);
        }
        return this._props.get(key);
    }

    getProps() {
        const props = {};
        for (const key of this.getHeritable()) {
            props[key] = this.getProp(key);
        }
        return props;
    }

});
