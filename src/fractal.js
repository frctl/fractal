'use strict';

const vorpal       = require('vorpal')();
const Promise      = require('bluebird');
const _            = require('lodash');
const console      = require('./console')(vorpal);
const EventEmitter = require('events').EventEmitter;
const Components   = require('./components/source');
const Docs         = require('./docs/source');
const Plugin       = require('./plugin');
const commander    = require('./commander');
const highlight    = require('./highlighter');
const utils        = require('./utils');

class Fractal {

    /**
     * Constructor. Sets up object and adds the bundled plugins and
     * rendering engines ready for instantiation.
     *
     * @api public
     */

    constructor() {
        this.global    = false;
        this.interactive = false;
        this._settings = require('../settings');
        this._engines  = new Map();
        this._plugins  = new Map();
        this._sources  = new Map();
        this._commander = commander(this, vorpal, require('./commands'));
        this.utils = {
            highlight: highlight,
            console: console,
            helpers: utils
        };
        this.console = console;
        this.engine('handlebars', '@frctl/handlebars-adapter');
        this.plugin('@frctl/web-plugin');
    }

    /**
     * Run the command specified in the CLI arguments.
     *
     * @api public
     */

    run() {
        this._init();
        return this._commander.run();
    }

    // exec() {
    //     this._initPlugins();
    //     return this._commander.exec.apply(this._commander, Array.from(arguments));
    // }

    _init() {
        console.debugging = this.get('env') === 'debug';
        if (this.get('env') !== 'debug') {
            process.on('uncaughtException', function (err) {
                console.error(err);
                process.exit(1);
            });
        }
        this._initPlugins();
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
            console.error(`Plugins must provide a valid 'name' value.`);
            return;
        }
        for (let command of instance.commands()) {
            this.command(command[1].name, command[1].callback, command[1].opts || {});
        }
        this._plugins.set(instance.name, instance);
        return this;
    }

    command(name, opts, action) {
        this._commander.add(name, opts, action);
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
            this._sources.set('components', new Components([], this));
        }
        return this._sources.get('components');
    }

    get docs() {
        if (!this._sources.has('docs')) {
            this._sources.set('docs', new Docs([], this));
        }
        return this._sources.get('docs');
    }

    get version() {
        return this.get('version').replace(/v/i, '');
    }

    get scope() {
        return this.global ? 'global' : 'project';
    }

    set(setting, val) {
        _.set(this._settings, setting, val);
        return this;
    }

    get(setting, defaultVal) {
        if (_.isUndefined(setting)) {
            return this._settings;
        }
        return _.get(this._settings, setting, defaultVal || undefined);
    }

    _initPlugins(name) {
        for (let plugin of this._plugins.values()) {
            plugin.config = _.defaultsDeep(_.clone(this.get(`plugins.${plugin.name}`, {})), plugin.config);
        }
    }

}

_.extend(Fractal.prototype, EventEmitter.prototype);

module.exports = new Fractal();
