'use strict';

const Promise    = require('bluebird');
const _          = require('lodash');
const logger     = require('./logger');
const Components = require('./components/source');
const Pages      = require('./pages/source');
const Plugin     = require('./plugin');
const highlight  = require('./highlighter');
const utils      = require('./utils');

class Fractal {

    /**
     * Constructor. Sets up object and adds the bundled plugins and
     * rendering engines ready for instantiation.
     *
     * @api public
     */

    constructor() {
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
        this.engine('consolidate', '@frctl/consolidate-engine');
        this.plugin('@frctl/web-plugin');
    }

    /**
     * Run the specified command.
     *
     * If no command is provided, this will parse argv to establish what command
     * to run and what arguments and opts should be passed to that command.
     *
     * @api public
     */

    run(command, args, opts) {
        if (!command) {
            const input = utils.parseArgv();
            if (!input.command) {
                const commands = this._getCommands();
                if (commands.length) {
                    logger.logInfo('No command specified. The following commands are available:');
                    commands.forEach(c => logger.logLn(`★ ${c}`));
                    return;
                }
                logger.error('No commands available.');
                return;
            } else {
                command = input.command;
                args    = input.args;
                opts    = input.opts;
            }
        }
        this._runCommand(command, args, opts);
    }

    source(type) {
        if (type === 'components') {
            return this.components;
        } else if (type === 'pages') {
            return this.pages;
        } else {
            throw new Error(`Source type ${type} not recognised`);
        }
    }

    watch() {
        this.components.watch();
        this.pages.watch();
    }

    unwatch() {
        this.components.unwatch();
        this.pages.unwatch();
    }

    load() {
        return Promise.props({
            components: this.components.load(),
            pages: this.pages.load()
        });
    }

    plugin(plugin, config) {
        const instance = new Plugin();
        const init = _.isString(plugin) ? require(plugin) : plugin;
        init.bind(instance)(config || {}, this);
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

    get components() {
        if (!this._sources.has('components')) {
            this._sources.set('components', new Components(this.get('components.path'), this.get('components'), [], this));
        }
        return this._sources.get('components');
    }

    get pages() {
        if (!this._sources.has('pages')) {
            this._sources.set('pages', new Pages(this.get('pages.path'), this.get('pages'), [], this));
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

    _runCommand(command, args, opts) {
        if (this._commands.has(command)) {
            return this._commands.get(command)(args, opts, this);
        }
        for (let plugin of this._plugins.values()) {
            for (let commandEntry of plugin.commands().entries()) {
                if (commandEntry[0] === command) {
                    logger.started('Booting Fractal...');
                    plugin.config = _.defaultsDeep(_.clone(this.get(`plugins.${plugin.name}`, {})), plugin.config);
                    return commandEntry[1](args, opts, this);
                }
            }
        }
        logger.error(`Command '${command}' not recognised`);
    }

    _getCommands() {
        const commands = Array.from(this._commands.keys());
        for (let plugin of this._plugins.values()) {
            for (let commandEntry of plugin.commands().entries()) {
                commands.push(commandEntry[0]);
            }
        }
        return commands;
    }

}

module.exports = new Fractal();
