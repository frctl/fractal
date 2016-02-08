'use strict';

const EventEmitter    = require('events');
const _               = require('lodash');
const co              = require('co');
const anymatch        = require('anymatch');
const logger          = require('./logger');
const ComponentSource      = require('./components/source');
const Source          = require('./source');

// const pages           = require('./pages');
// const pageTreeParser = require('./pages/transform');

class Fractal extends EventEmitter {

    constructor(){
        super();
        this._config  = require('../config');
        this._engines = {};
        this._watch   = false;
        this._sources = new Map();
    }

    source(type) {
        if (type === 'components') {
            return this.components();
        } else if (type === 'pages') {
            return this.pages();
        } else {
            throw new Error(`Source type ${type} not recognised`);
        }
    }

    components() {
        if (!this._sources.has('components')) {
            const source = new ComponentSource(this.get('components.path'), {
                name:       'components',
                status:     this.get('components.status.default'),
                layout:     this.get('components.preview.layout'),
                display:    this.get('components.preview.display'),
                context:    this.get('components.context'),
                ext:        this.get('components.ext'),
                splitter:   this.get('components.splitter')
            });
            this._sources.set('components', source);
        }
        return this._sources.get('components');
    }

    watch() {
        this.components().watch();
        // this.pages().watch();
    }

    endWatch() {
        this.components().endWatch();
    }

    pages() {
        
    }

    renderPreview(component, context, layout) {

    }

    render(entity, context, layout) {
        var self = this;
        context = context || entity.context;
        return co(function* (){
            if (entity.type === 'component') {
                const collection = yield self.components();
                context = yield components.context(context, collection);
                return components.render(entity, context, this);
            } else if (entity.type === 'page') {
                const collection = yield self.pages();
                context = yield pages.context(context, collection);
                return pages.render(entity, context, this);
            }
        });
    }

    register(plugin, config) {

    }

    engine(name, engine) {
        if (arguments.length == 2) {
            this._engines[name] = engine();
        } else if (name) {
            return this._engines[name];
        }
    }

    run(command) {

    }

    set(setting, val) {
        logger.debug('Setting config value: %s = %s', setting, _.isObject(val) ? JSON.stringify(val, null, 2) : val);
        _.set(this._config, setting, val);
        return this;
    }

    get(setting, defaultVal) {
        if (_.isUndefined(setting)) {
            return this._config;
        }
        return _.get(this._config, setting, defaultVal || undefined);
    }
}

module.exports = new Fractal();
