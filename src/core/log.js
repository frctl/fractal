'use strict';

const mix     = require('mixwith').mix;
const Base    = require('./mixins/base');
const Emitter = require('./mixins/emitter');

class Log extends mix(Base).with(Emitter) {

    debug(msg) {
        this.emit('debug', msg);
    }

    error(msg) {
        this.emit('error', msg);
    }

}

module.exports = new Log();
