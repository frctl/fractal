'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const defaults = require('../config');
const utils = require('@frctl/core').utils;
const mix = require('@frctl/core').mixins.mix;
const Configurable = require('@frctl/core').mixins.configurable;
const Emitter = require('@frctl/core/').mixins.emitter;

class Fractal extends mix(Configurable, Emitter) {
    /**
     * Constructor.
     * @return {Fractal}
     */
    constructor(config) {
        super();
        this.config(utils.defaultsDeep(config || {}, defaults));

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
            const Web = require('@frctl/web').Web;
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

    extend(plugin) {
        if (_.isString(plugin)) {
            plugin = require(plugin);
        }
        if (!_.isFunction(plugin)) {
            throw new Error('Plugins must be a function');
        }
        const boundPlugin = plugin.bind(this);
        boundPlugin(module.exports.core);
        return this;
    }

    watch() {
        this._sources().forEach((s) => s.watch());
        return this;
    }

    unwatch() {
        this._sources().forEach((s) => s.unwatch());
        return this;
    }

    load() {
        return Promise.all(this._sources().map((s) => s.load()));
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
module.exports.WebTheme = require('@frctl/web').Theme;
module.exports.CliTheme = require('./cli/theme');
module.exports.Adapter = require('@frctl/core').Adapter;
module.exports.log = require('@frctl/core').Log;
module.exports.utils = require('@frctl/core').utils;

module.exports.core = {
    Component: require('./api/components/component.js'),
    Variant: require('./api/variants/variant.js'),
    Doc: require('./api/docs/doc.js'),
};
