'use strict';

const _            = require('lodash');
const mixin        = require('mixwith').Mixin;
const EventEmitter = require('events').EventEmitter;

module.exports = mixin((superclass) => {

    let Emitter = class extends superclass {
        constructor(){
            super(...arguments);
            super.addMixedIn('Emitter');
        }
    };

    _.extend(Emitter.prototype, EventEmitter.prototype);

    return Emitter;

});
