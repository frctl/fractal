'use strict';

const EventEmitter = require('events').EventEmitter;

class Fractal {

    /**
     * Constructor.
     * @return {Fractal}
     */
    constructor() {

    }

    get web() {

    }

    get cli() {

    }

}

_.extend(Fractal.prototype, EventEmitter.prototype);

module.exports = new Fractal();
