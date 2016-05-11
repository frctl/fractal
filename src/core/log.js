'use strict';

const mix     = require('./mixins/mix');
const Emitter = require('./mixins/emitter');

class Log extends mix(Emitter) {

    debug(msg, data) {
        this.emit('debug', msg);
    }

    alert(msg, data) {
        this.emit('alert', msg);
    }

    error(msg, data) {
        this.emit('error', msg);
    }

    log(msg, data) {
        this.emit('log', msg);
    }

}

module.exports = new Log();
