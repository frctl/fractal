'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const chokidar = require('chokidar');
const anymatch = require('anymatch');
const Path = require('path');
const mixin = require('mixwith').Mixin;
const mix = require('mixwith').mix;

const fs = require('../fs');
const utils = require('../utils');
const Log = require('../log');
const Configurable = require('../mixins/configurable');
const Collection = require('../mixins/collection');
const Emitter = require('../mixins/emitter');
const Stream = require('../promise-stream');

module.exports = mixin((superclass) => class Source extends mix(superclass).with(Configurable, Collection, Emitter) {

    constructor() {
        super();
        // super.apply(null, Array.from(arguments));
        super.addMixedIn('Source');
        this.isSource = true;
        this.isLoaded = false;
        this._app = null;
        this._loading = false;
        this._monitor = null;
        this._fileTree = null;
    }

    initSource(name, config, app) {
        this._app = app;
        this.name = utils.slugify(name.toLowerCase());
    }

    get label() {
        return this.get('label') || utils.titlize(this.name);
    }

    get title() {
        return this.get('title') || this.label;
    }

    get source() {
        return this;
    }

    get isWatching() {
        return !! this._monitor;
    }

    get fullPath() {
        return this.get('path') ? Path.resolve(this.get('path')) : null;
    }

    get relPath() {
        return Path.relative(process.cwd(), this.get('path'));
    }

    toStream() {
        return new Stream(this.load().then(() => this.flatten().toArray()));
    }

    exists() {
        return this.get('path') && utils.fileExistsSync(this.get('path'));
    }

    load(force) {
        if (!this.get('path')) {
            return Promise.resolve(this);
        }
        if (!this.exists()) {
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
        if (this.isWatching) {
            return;
        }
        const sourcePath = this.fullPath;
        if (!this._monitor && sourcePath) {
            Log.debug(`Watching ${this.name} directory - ${sourcePath}`);
            this._monitor = chokidar.watch(sourcePath, {
                ignored: /[\/\\]\./,
            });
            this._monitor.on('ready', () => {
                this._monitor.on('all', (event, path) => {
                    if (this._fileFilter && !this._fileFilter(path)) {
                        // don't do anything if there is a file filter in place
                        // and the changed file doesn't match it.
                        return;
                    }

                    Log.debug(`Change in ${this.name} directory`);

                    const data = this._appendEventFileInfo(path, {
                        event: event,
                        path: path,
                    });

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
        if (!this.isWatching) {
            return;
        }
        this._monitor.close();
        this._monitor = null;
    }

    isConfig(file) {
        return anymatch('**/*.config.{js,json,yaml,yml}', this._getPath(file));
    }

    _build() {
        if (!this.get('path')) {
            return Promise.resolve(this);
        }
        this._loading = this._getTree().then(fileTree => {
            this._fileTree = fileTree;
            this._loading = false;
            return this._parse(fileTree);
        }).catch(e => {
            Log.error(e);
            if (this._app.debug) {
                Log.write(e.stack);
            }
        });
        return this._loading;
    }

    _getTree() {
        return fs.describe(this.fullPath, this.relPath);
    }

    _parse() {
        return [];
    }

    _appendEventFileInfo(file, eventData) {
        if (this.isConfig(file)) {
            eventData.isConfig = true;
        }
        return eventData;
    }

    _getPath(file) {
        const filePath = _.isString(file) ? file : file.path;
        return filePath.toLowerCase();
    }

});
