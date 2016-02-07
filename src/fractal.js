'use strict';

const EventEmitter   = require('events');
const _              = require('lodash');
const co             = require('co');
const anymatch       = require('anymatch');
const logger         = require('./logger');
const fs             = require('./fs');
const compTreeParser = require('./components/transform');
// const pageTreeParser = require('./pages/transform');

class Fractal extends EventEmitter {

    constructor(){
        super();
        this._config  = require('../config');
        this._cache   = {};
    }

    components() {
        const self = this;
        const components = co(function* () {
            const fileTree   = yield fs.describe(self.get('components.path'));
            const components = yield compTreeParser(fileTree, {
                ext:      self.get('components.ext'),
                splitter: self.get('components.splitter'),
                defaults: {
                    status:   self.get('components.status.default'),
                    layout:   self.get('components.preview.layout'),
                    display:  self.get('components.preview.display'),
                    context:  self.get('components.context'),
                }
            });
            return components;
        }).catch(e => {
            logger.error(e);
        });
        return components;
    }

    pages() {

    }

    render() {

    }

    register(plugin, config) {

    }

    engine(engine, config, type) {

    }

    run() {

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
