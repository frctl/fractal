'use strict';

const _            = require('lodash')
const chokidar     = require('chokidar');
const anymatch     = require('anymatch');

const fs           = require('./fs');
const utils        = require('./utils');
const Log          = require('./log');
const mix          = require('./mixins/mix');
const Configurable = require('./mixins/configurable');
const Collection   = require('./mixins/collection');
const Emitter      = require('./mixins/emitter');
const Heritable    = require('./mixins/heritable');

class Source extends mix(Configurable, Heritable, Emitter, Collection) {

    constructor(name, app){
        super(app);
        this.name           = name;
        this.isLoaded       = false;
        this._app           = app;
        this._loading       = false;
        this._monitor       = null;
        this._transform     = null;
        this._fileTree      = null;
        this._engine        = null;
        this._defaultEngine = '@frctl/handlebars-adapter';

        this.config(app.get(this.name));
        this.setHeritable(_.keys(this.get('default')));
    }

    get label() {
        return this.get('label') || utils.titlize(this.name);
    }

    get title() {
        return this.get('title') || this.label;
    }

    exists() {
        return this.get('path') && utils.fileExistsSync(this.get('path'));
    }

    engine(engine, config) {
        if (!arguments.length) {
            if (this._engine === null) {
                this.engine(this._defaultEngine); // load the default template engine
            }
            return this._engine;
        }
        if (_.isString(engine)) {
            engine = require(engine);
        }
        if (_.isFunction(engine)) {
            engine = engine(config || {});
        }
        if (_.isFunction(engine.register)) {
            engine.register(this, this._app);
        }
        this._engine = engine;
    }

    load(force) {
        if (!this.get('path')) {
            return Promise.resolve(this);
        }
        if (!utils.fileExistsSync(this.get('path'))) {
            Log.error(`The ${this.name} directory (${this.get('path')}) does not exist.`);
            return Promise.resolve(this);
        }
        if (this._loading) {
            return this._loading;
        }
        if (force || !this.isLoaded) {
            return this._build().then(source => {
                Log.debug(`Finished parsing ${this.name} directory`);
                this.isLoaded = true;
                this.emit('loaded');
                this._app.emit('source:loaded', this);
                return source;
            });
        }
        return Promise.resolve(this);
    }

    refresh() {
        if (!this.isLoaded) {
            return this.load();
        }
        if (this._loading) {
            return this._loading;
        }
        return this._build().then(source => {
            Log.debug(`Finished parsing ${this.name} directory`);
            this.isLoaded = true;
            return source;
        });
    }

    watch() {
        const sourcePath = this.get('path');
        if (!this._monitor && sourcePath) {
            Log.debug(`Watching ${this.name} directory - ${sourcePath}`);
            this._monitor = chokidar.watch(sourcePath, {
                ignored: /[\/\\]\./
            });
            this._monitor.on('ready', () => {
                this._monitor.on('all', (event, path) => {
                    Log.debug(`Change in ${this.name} directory`);

                    const data = {
                        event: event,
                        path: path,
                        type: this.fileType(path)
                    };

                    this.emit('changed', data);
                    this._app.emit('source:changed', this, data);

                    this.refresh().then(source => {
                        this.emit('updated', data);
                        this._app.emit('source:updated', this, data);
                        return source;
                    });

                });
            });
        }
    }

    unwatch() {
        this._monitor.close();
        this._monitor = null;
    }

    getProp(key) {
        const upstream = this.get(`default.${key}`);
        const prop     = this._props.get(key);
        return utils.mergeProp(prop, upstream);
    }

    toJSON() {
        const self    = super.toJSON();
        self.name     = this.name;
        self.label    = this.label;
        self.title    = this.title;
        self.viewExt  = this.setting('ext');
        self.isLoaded = this.isLoaded;
        return self;
    }

    fileType(file) {
        if (this.isConfig(file)) {
            return 'config';
        }
    }

    isConfig(file) {
        return anymatch(`**/*.config.{js,json,yaml,yml}`, this._getPath(file));
    }

    _build() {
        if (!this.get('path')) {
            return Promise.resolve(this);
        }
        this._loading = fs.describe(this.get('path')).then(fileTree => {
            this._fileTree = fileTree;
            this._loading  = false;
            return this._parse(fileTree);
        }).catch(e => {
            Log.error(e);
        });
        return this._loading;
    }

    _parse() {
        return [];
    }

    _getPath(file) {
        const filePath = _.isString(file) ? file : file.path;
        return filePath.toLowerCase();
    }

};

module.exports = Source;
