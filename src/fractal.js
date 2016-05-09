'use strict';

const Promise         = require('bluebird');
const mix             = require('mixwith').mix;
const settings        = require('../settings');
const Cli             = require('./cli');
const Web             = require('./web');
const ComponentSource = require('./core/api/components');
const Base            = require('./core/mixins/base.js');
const Configurable    = require('./core/mixins/configurable');
const Emitter         = require('./core/mixins/emitter');

class Fractal extends mix(Base).with(Configurable, Emitter) {

    /**
     * Constructor.
     * @return {Fractal}
     */
    constructor() {
        super();
        this._config    = settings;
        this.cli        = new Cli(this);
        this.web        = new Web(this);
        this.components = new ComponentSource(this);
        // this.docs       = new DocsSource(this);
    }

    get version() {
        return this.get('version').replace(/v/i, '');
    }

    watch() {

    }

    unwatch() {

    }

    load() {
        return Promise.all([
            this.components.load(),
            // this.docs.load()
        ]);
    }

}

module.exports = new Fractal();
