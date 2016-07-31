'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const defaults = require('../config');
const Log = require('./core/log');
const utils = require('./core/utils');
const mix = require('./core/mixins/mix');
const Configurable = require('./core/mixins/configurable');
const Emitter = require('./core/mixins/emitter');

class Fractal extends mix(Configurable, Emitter) {

    /**
     * Constructor.
     * @return {Fractal}
     */
    constructor(config) {
        super();
        this.config(_.defaultsDeep(config || {}, defaults));

        this._cli = null;
        this._web = null;
        this._components = null;
        this._docs = null;
        this._assets = null;
        this._engine = null;

        if (this.debug) {
            Promise.config({
                longStackTraces: true,
            });
        }
    }

    get components() {
        if (!this._components) {
            const ComponentSource = require('./api/components');
            this._components = new ComponentSource(this);
        }
        return this._components;
    }

    get docs() {
        if (!this._docs) {
            const DocSource = require('./api/docs');
            this._docs = new DocSource(this);
        }
        return this._docs;
    }

    get assets() {
        if (!this._assets) {
            const AssetSourceCollection = require('./api/assets');
            this._assets = new AssetSourceCollection(this);
        }
        return this._assets;
    }

    get cli() {
        if (!this._cli) {
            const Cli = require('./cli');
            this._cli = new Cli(this);
        }
        return this._cli;
    }

    get web() {
        if (!this._web) {
            const Web = require('./web');
            this._web = new Web(this);
        }
        return this._web;
    }

    get version() {
        return this.get('version').replace(/v/i, '');
    }

    get debug() {
        return this.get('env').toLowerCase() === 'debug';
    }

    watch() {
        this._sources().forEach(s => s.watch());
        return this;
    }

    unwatch() {
        this._sources().forEach(s => s.unwatch());
        return this;
    }

    load() {
        return Promise.all(this._sources().map(s => s.load()));
    }

    _sources() {
        return [this.components, this.docs].concat(this.assets.sources());
    }

    get __fractal() {
        return this.version;
    }
}

function create(config) {
    return new Fractal(config);
}

module.exports = create;

module.exports.create = create;
module.exports.Fractal = Fractal;
module.exports.WebTheme = require('./web/theme');
module.exports.CliTheme = require('./cli/theme');
module.exports.Adapter = require('./core/adapter');
module.exports.utils = require('./core/utils');
