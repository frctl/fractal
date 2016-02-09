'use strict';

const Promise    = require('bluebird');
const _          = require('lodash');
const minimist   = require('minimist');
const logger     = require('./logger');
const Components = require('./components/source');
const Pages      = require('./pages/source');
const Plugin     = require('./plugin');
const highlight  = require('./highlighter');

class Fractal {

    constructor(){
        this._config   = require('../config');
        this._engines  = new Map();
        this._commands = new Map();
        this._plugins  = new Map();
        this._sources  = new Map();
        this.utils = {
            log: logger,
            highlight: highlight
        };
        this.engine('handlebars', '@frctl/handlebars-engine');
        this.engine('nunjucks', '@frctl/nunjucks-engine');
        this.plugin('@frctl/web-plugin');
    }

    run(command) {
        if (!command) {
            const argv = minimist(process.argv.slice(2));
            if (argv._.length) {
                command = argv._[0];
            } else {
                logger.error('No command specified.');
                return;
            }
        }
        this._runCommand(command);
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
        this.components().watch();
        this.pages().watch();
    }

    unwatch() {
        this.components().unwatch();
        this.pages().unwatch();
    }

    load() {
        return Promise.props({
            components: this.components().load(),
            pages: this.pages().load()
        });
    }

    plugin(plugin, config) {
        const instance = new Plugin();
        const init = _.isString(plugin) ? require(plugin) : plugin;
        init.bind(instance)(config, this);
        if (!instance.name) {
            logger.error(`Plugins must provide a valid 'name' value.`);
            return;
        }
        this._plugins.set(instance.name, instance);
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
        if (!this._sources.has('components')) {
            const config = this.get('components');
            const source = new Components(this.get('components.path'), {
                name:       'components',
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

    _runCommand(command){
        this.components();
        this.pages();
        if (this._commands.has(command)) {
            return this._commands.get(command)(this);
        }
        for (let plugin of this._plugins.values()) {
            for (let commandEntry of plugin.commands().entries()) {
                if (commandEntry[0] === command) {
                    plugin.config = _.defaultsDeep(this.get(`plugins.${plugin.name}`, {}), plugin.config);
                    return commandEntry[1]();
                }
            }
        }
        logger.error(`Command '${command}' not recognised`);
    }

}

module.exports = new Fractal();
