'use strict';

const _          = require('lodash');
const anymatch   = require('anymatch');
const logger     = require('./logger');
const Components = require('./components/source');
const Pages      = require('./pages/source');
const Plugin     = require('./plugin');

class Fractal {

    constructor(){
        this._config   = require('../config');
        this._engines  = new Map();
        this._commands = new Map();
        this._plugins  = new Map();
        this._sources  = new Map();
        this.components();
        this.pages();
        this.engine('handlebars', '@frctl/handlebars-engine');
    }

    run(command) {
        if (this._commands.has(command)) {
            return this._commands.get(command)(this);
        }
        for (let pluginEntry of this._plugins.entries()) {
            const name = pluginEntry[0];
            const plugin = pluginEntry[1].plugin;
            const config = pluginEntry[1].config;
            for (let commandEntry of plugin.commands().entries()) {
                if (commandEntry[0] === command) {
                    const resolvedConfig = _.defaultsDeep(this.get(`plugins.${name}`, {}), config, plugin.defaults);
                    return commandEntry[1](resolvedConfig, this);
                }
            }
        }
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

    watch() {
        this._sources.forEach(function(source){
            source.watch();
        });
    }

    unwatch() {
        this._sources.forEach(function(source){
            source.unwatch();
        });
    }

    plugin(plugin, config) {
        const plug = new Plugin();
        _.isString(plugin) ? require(plugin)(plug) : plugin(plug);
        if (!plug.name) {
            logger.error(`Plugins must provide a valid 'name' value.`);
            return;
        }
        this._plugins.set(plug.name, {
            plugin: plug,
            config: config || {}
        });
    }

    command(name, callback) {
        this._commands.set(name, callback);
    }

    engine(name, engine, config) {
        if (arguments.length > 1) {
            this._engines.set(name, {
                engine: engine,
                config: config || {},
            });
        } else if (name) {
            return this._engines.get(name);
        }
    }

    components() {
        if (!this.get('components.path')) {
            return null;
        }
        if (!this._sources.has('components')) {
            const config = this.get('components');
            const source = new Components(this.get('components.path'), {
                name:       'components',
                status:     config.status.default,
                layout:     config.preview.layout,
                display:    config.preview.display,
                context:    config.context,
                ext:        config.ext,
                splitter:   config.splitter,
                yield:      config.preview.yield,
                engine:     config.engine,
                status:     config.status,
                app:        this
            });
            this._sources.set('components', source);
        }
        return this._sources.get('components');
    }

    pages() {
        if (!this.get('pages.path')) {
            return null;
        }
        if (!this._sources.has('pages')) {
            const config = this.get('pages');
            const source = new Pages(this.get('pages.path'), {
                name:       'pages',
                context:    config.context,
                indexLabel: config.indexLabel,
                markdown:   config.markdown,
                ext:        config.ext,
                engine:     config.engine,
                app:        this
            });
            this._sources.set('pages', source);
        }
        return this._sources.get('pages');
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
