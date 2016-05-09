'use strict';

const mix = require('mixwith');
const settings = require('../settings');
const Configurable = require('./core/mixins/configurable');

class Fractal extends Configurable(Object) {

    /**
     * Constructor.
     * @return {Fractal}
     */
    constructor() {
        super();
    }

    get web() {

    }

    get cli() {

    }

    get components() {

    }

    get docs() {

    }

    get version() {
        // return this.get('version').replace(/v/i, '');
    }

}

module.exports = new Fractal();
