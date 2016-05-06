'use strict';

const EventEmitter = require('events').EventEmitter;

class Fractal {

    /**
     * Constructor.
     * @return {Fractal}
     */
    constructor() {

    }

    web() {

    }

}

_.extend(Fractal.prototype, EventEmitter.prototype);

module.exports = new Fractal();
