'use strict';

const _               = require('lodash');
const Promise         = require('bluebird');
const settings        = require('../settings');
const Cli             = require('./cli');
const Web             = require('./web');
const ComponentSource = require('./api/components');
const DocSource       = require('./api/docs');
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
    constructor() {
        super();
        this.setConfig(settings);

        this.cli        = new Cli(this);
        this.web        = new Web(this);
        this.components = new ComponentSource(this);
        this.docs       = new DocSource(this);

        this.utils = {
            console: this.cli.console,
            helpers: utils
        };

        if (this.get('env') !== 'debug') {
            process.on('uncaughtException', function (err) {
                Log.error(err);
                process.exit(1);
            });
        }
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

module.exports = new Fractal();
