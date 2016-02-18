'use strict';

const Promise    = require('bluebird');
const _          = require('lodash');
const cli        = require('./cli');
const Components = require('./components/source');
const Docs       = require('./docs/source');
const Plugin     = require('./plugin');
const commander  = require('./commander');
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
        this._config  = require('../config');
        this._engines = new Map();
        this._plugins = new Map();
        this._sources = new Map();
        this.commands = commander(require('./commands'), this);
        cli.debugging = this.get('env') === 'debug';
        this.utils = {
            highlight: highlight,
            cli: cli
        };
        this.engine('handlebars', '@frctl/handlebars-engine');
        this.engine('nunjucks', '@frctl/nunjucks-engine');
        this.engine('mustache', '@frctl/mustache-engine');
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

    run(name, args, opts) {

        if (this.get('env') !== 'debug') {
            process.on('uncaughtException', function (err) {
                cli.error(err);
                process.exit(1);
            });
        }

        if (!name) {
            const input = utils.parseArgv();
            if (!input.command) {
                return this.commands.run('welcome', null, null, this);
            } else {
                name    = input.command;
                args    = input.args;
                opts    = input.opts;
            }
        }
        const command = this.commands.get(name);
        if (command) {
            this._initPlugins();
            return this.commands.run(command, args, opts, this);
        }
        cli.error(`Command ${name} not recognised`);
    }

    source(type) {
        if (type === 'components') {
            return this.components;
        } else if (type === 'docs') {
            return this.docs;
        } else {
            throw new Error(`Source type ${type} not recognised`);
        }
    }

    watch() {
        this.components.watch();
        this.docs.watch();
        return this;
    }

    unwatch() {
        this.components.unwatch();
        this.docs.unwatch();
        return this;
    }

    load() {
        return Promise.props({
            components: this.components.load(),
            docs: this.docs.load()
        });
    }

    plugin(plugin, config) {
        const instance = new Plugin();
        const init = _.isString(plugin) ? require(plugin) : plugin;
        init.bind(instance)(config || {}, this);
        if (!instance.name) {
            cli.error(`Plugins must provide a valid 'name' value.`);
            return;
        }
        for (let command of instance.commands()) {
            this.command(command[1].name, command[1].callback, command[1].opts || {});
        }
        this._plugins.set(instance.name, instance);
        return this;
    }

    command(name, callback, opts) {
        this.commands.add(name, callback, opts);
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

    get docs() {
        if (!this._sources.has('docs')) {
            this._sources.set('docs', new Docs(this.get('docs.path'), this.get('docs'), [], this));
        }
        return this._sources.get('docs');
    }

    get version() {
        return this.get('version').replace(/v/i, '');
    }

    set(setting, val) {
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

}

module.exports = new Fractal();
