'use strict';

const mix     = require('./mixins/mix');
const Emitter = require('./mixins/emitter');

class Log extends mix(Emitter) {

    debug(msg, data) {
        this.emit('debug', msg, data);
    }

    alert(msg, data) {
        this.emit('alert', msg, data);
    }

    error(msg, data) {
        this.emit('error', msg, data);
    }

    log(msg, data) {
        this.emit('log', msg, data);
    }

    notice(msg, data) {
        this.emit('notice', msg, data);
    }

}

module.exports = new Log();
