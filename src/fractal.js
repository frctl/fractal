'use strict';

const Promise    = require('bluebird');
const _          = require('lodash');
const logger     = require('./logger');
const Components = require('./components/source');
const Pages      = require('./pages/source');
const Plugin     = require('./plugin');
const commands   = require('./commands');
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
        _.forOwn(commands, (command, name) => {
            this.command(name, command, {});
        });
    }

    /**
     * Run the specified command.
     *
     * If no command is provided, this will parse argv to establish what command
     * to run and what arguments and opts should be passed to that command.
     *
     * @api public
     */

    run(name, args, opts) {
        if (!name) {
            const input = utils.parseArgv();
            if (!input.command) {
                return this.run('welcome');
            } else {
                name    = input.command;
                args    = input.args;
                opts    = input.opts;
            }
        }
        const command = this._findCommand(name);
        if (command) {
            this._initPlugins();
            return this._runCommand(command, args, opts);
        }
        logger.error(`Command ${name} not recognised`);
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
        return this;
    }

    unwatch() {
        this.components.unwatch();
        this.pages.unwatch();
        return this;
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
        return this;
    }

    command(name, callback, opts) {
        this._commands.set(name, {
            name: name,
            callback: callback,
            opts: opts || {}
        });
        return this;
    }

    engine(name, engine, config) {
        if (arguments.length > 1) {
            this._engines.set(name, {
                name: name,
                engine: engine,
                config: config || {},
            });
            return this;
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

    _initPlugins(name) {
        for (let plugin of this._plugins.values()) {
            plugin.config = _.defaultsDeep(_.clone(this.get(`plugins.${plugin.name}`, {})), plugin.config);
        }
    }

    _runCommand(command, args, opts) {
        command = _.isString(command) ? this._findCommand(command) : command;
        if (command) {
            return command.callback(args, opts, this);
        }
    }

    _findCommand(name) {
        const command = this._getCommands()[name];
        if (command) {
            return command;
        }
    }

    _getCommands() {
        const commands = {};
        for (let command of this._commands.entries()) {
            commands[command[0]] = command[1];
        }
        for (let plugin of this._plugins.values()) {
            for (let command of plugin.commands()) {
                commands[command[0]] = command[1];
            }
        }
        return commands;
    }

    get version(){
        return this.get('version');
    }

}

module.exports = new Fractal();
