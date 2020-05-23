'use strict';

const _ = require('lodash');
const mixin = require('mixwith').Mixin;
const EventEmitter = require('events').EventEmitter;

module.exports = mixin((superclass) => {
    const Emitter = class extends superclass {
        constructor() {
            super();
            super.addMixedIn('Emitter');
            this.on('error', e => {});
        }
    };

    _.extend(Emitter.prototype, EventEmitter.prototype);

    return Emitter;
});
