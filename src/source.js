'use strict';

const EventEmitter = require('events').EventEmitter;
const Promise      = require('bluebird');
const Path         = require('path')
const _            = require('lodash');
const chokidar     = require('chokidar');
const utils        = require('./utils');
const console      = require('./console');
const Collection   = require('./collection');
const fs           = require('./fs');

class Source extends Collection {

    constructor(namespace, items, app) {
        super(items);
        this.isLoaded   = false;
        this.name       = namespace;
        this._namespace = namespace;
        this._app       = app;
        this._loading   = null;
        this._monitor   = null;
        this._engines   = new Map();
        this._fileTree  = null;
    }

    get label() {
        return this.setting('label') || utils.titlize(this.name);
    }

    get title() {
        return this.setting('title') || this.label;
    }

    get parent() {
        return null;
    }

    get source() {
        return this;
    }

    get sourcePath() {
        return this._app.getProjectPath(this.setting('path'));
    }

    setProp(key, value) {
        if (!_.isUndefined(this.setting(`default.${key}`))) {
            this._props.set(key, value);
        }
    }

    getProp(key) {
        const upstream = this.setting(`default.${key}`);
        const prop     = this._props.get(key);
        return utils.mergeProp(prop, upstream);
    }

    setting(key, fallback) {
        return this._app.get(`${this._namespace}.${key}`, fallback);
    }

    statusInfo(handle) {
        return null;
    }

    setItems(items) {
        this._items = new Set(items || []);
        return this;
    }

    load(force) {
        if (this._loading) {
            return this._loading;
        }
        if (force || !this.isLoaded) {
            return this._build().then(source => {
                console.debug(`Finished parsing ${this.name} directory`);
                this.isLoaded = true;
                this.emit('loaded', this);
                this._app.emit('loaded', this.name, this);
                return source;
            });
        }
        return Promise.resolve(this);
    }

    refresh(data) {
        if (!this.isLoaded) {
            return this.load();
        }
        if (this._loading) {
            return this._loading;
        }
        return this._build().then(source => {
            console.debug(`Finished parsing ${this.name} directory`);
            this.isLoaded = true;
            this.emit('changed', this, data);
            this._app.emit('changed', this.name, this, data);
            return source;
        });
    }

    watch() {
        const sourcePath = this.sourcePath;
        if (!this._monitor && sourcePath) {
            console.debug(`Watching ${this.name} directory - ${sourcePath}`);
            this._monitor = chokidar.watch(sourcePath, {
                ignored: /[\/\\]\./
            });
            this._monitor.on('ready', () => {
                this._monitor.on('all', (event, path) => {
                    console.debug(`Change in ${this.name} directory`);
                    this.refresh({
                        event: event,
                        path: path,
                        isAsset: this.isAsset({ path: path })
                    });
                });
            });
        }
    }

    unwatch() {
        this._monitor.close();
        this._monitor = null;
    }

    engine() {
        const e = this.setting('engine');
        if (!this._engines.has(e)) {
            const engine = this._app.engine(e);
            if (!engine) {
                throw new Error('Engine not found');
            }
            if (_.isString(engine.engine)) {
                engine.engine = require(engine.engine);
            }
            const instance = engine.engine(this, engine.config);
            this._engines.set(e, instance);
        }
        return this._engines.get(e);
    }

    findFile(filePath) {
        filePath = Path.resolve(filePath);
        if (this._fileTree) {
            function findFile(items) {
                for (let item of items) {
                    if (item.type == 'file' && item.path === filePath) {
                        return item;
                    } else if (item.type == 'directory') {
                        let result = findFile(item.children);
                        if (result) {
                            return result;
                        }
                    }
                }
            }
            return findFile(this._fileTree.children);
        }
    }

    _build() {
        const sourcePath = this.sourcePath;
        if (!sourcePath) {
            return Promise.resolve(this);
        }
        this._loading = fs.describe(sourcePath).then(fileTree => {
            this._fileTree = fileTree;
            this._loading = null;
            return this.transform(fileTree, this);
        }).catch(e => {
            console.error(e);
        });
        return this._loading;
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

    isAsset() {
        return false;
    }

}

_.extend(Source.prototype, EventEmitter.prototype);

module.exports = Source;
