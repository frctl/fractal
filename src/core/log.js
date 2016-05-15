'use strict';

const mix     = require('./mixins/mix');
const Emitter = require('./mixins/emitter');

class Log extends mix(Emitter) {
    
    log(msg, data) {
        this.emit('log', msg, data);
    }

    write(msg, data) {
        this.emit('log', msg, data);
    }

    debug(msg, data) {
        this.emit('debug', msg, data);
    }

    success(msg, data) {
        this.emit('success', msg, data);
    }

    error(msg, data) {
        this.emit('error', msg, data);
    }

    alert(msg, data) {
        this.emit('alert', msg, data);
    }

}

module.exports = new Log();
