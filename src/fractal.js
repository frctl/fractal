'use strict';

const EventEmitter    = require('events');
const _               = require('lodash');
const co              = require('co');
const anymatch        = require('anymatch');
const logger          = require('./logger');
const fs              = require('./fs');
const components      = require('./components');
const Source          = require('./source');
// const pages           = require('./pages');
// const pageTreeParser = require('./pages/transform');

class Fractal extends EventEmitter {

    constructor(){
        super();
        this._config  = require('../config');
        this._cache   = {};
        this._engines  = {};
    }

    components(watch) {
        const self = this;
        const source = new components.Source({
            name:     'components',
            status:   self.get('components.status.default'),
            layout:   self.get('components.preview.layout'),
            display:  self.get('components.preview.display'),
            context:  self.get('components.context'),
        });
        return fs.describe(self.get('components.path')).then(function(fileTree){
            return components.transform(fileTree, source, {
                ext:      self.get('components.ext'),
                splitter: self.get('components.splitter')
            });
        });
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
