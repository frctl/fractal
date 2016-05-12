'use strict';

const _               = require('lodash');
const Promise         = require('bluebird');
const settings        = require('../settings');
const Log             = require('./core/log');
const utils           = require('./core/utils');
const mix             = require('./core/mixins/mix');
const Configurable    = require('./core/mixins/configurable');
const Emitter         = require('./core/mixins/emitter');

const sources = ['components', 'docs'];

class Fractal extends mix(Configurable, Emitter) {

    /**
     * Constructor.
     * @return {Fractal}
     */
    constructor(config) {
        super();
        this.config(_.defaultsDeep(config || {}, settings));

        this._cli        = null;
        this._web        = null;
        this._components = null;
        this._docs       = null;

        if (this.get('env') !== 'debug') {
            process.on('uncaughtException', function (err) {
                Log.error(err.toString(), err);
                process.exit(1);
            });
        }

    }

    get components(){
        if (!this._components) {
            const ComponentSource = require('./api/components');
            this._components = new ComponentSource(this);
        }
        return this._components;
    }

    get docs(){
        if (!this._docs) {
            const DocSource = require('./api/docs');
            this._docs = new DocSource(this);
        }
        return this._docs;
    }

    get cli(){
        if (!this._cli) {
            const Cli = require('./cli');
            this._cli = new Cli(this);
        }
        return this._cli;
    }

    get web(){
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
        sources.forEach(s => this[s].watch());
    }

    unwatch() {
        sources.forEach(s => this[s].unwatch());
    }

    engine() {
        if (!arguments.length) {
            const ret = {};
            sources.forEach(s => (ret[s] = this[s].engine()));
            return ret;
        } else {
            sources.forEach(s => this[s].engine(...arguments));
        }
    }

    load() {
        return Promise.all(sources.map(s => this[s].load()));
    }

    source(type) {
        if (_.includes(sources, type)) {
            return this[type];
        }
        throw new Error(`Source type ${type} not recognised`);
    }

}

function create(config){
    return new Fractal(config);
};

module.exports = create;

module.exports.create   = create;
module.exports.Fractal  = Fractal;
module.exports.WebTheme = require('./web/theme');
module.exports.CliTheme = require('./cli/theme');
module.exports.utils    = require('./core/utils');
