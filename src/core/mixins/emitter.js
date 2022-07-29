'use strict';

const _ = require('lodash');
const { Mixin } = require('mixwith');
const { EventEmitter } = require('events');

module.exports = Mixin((superclass) => {
    const Emitter = class extends superclass {
        constructor() {
            super();
            super.addMixedIn('Emitter');
        }
    };

    _.extend(Emitter.prototype, EventEmitter.prototype);

    return Emitter;
});
