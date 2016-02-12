'use strict';

const EventEmitter = require('events').EventEmitter;
const Promise      = require('bluebird');
const _            = require('lodash');
const chokidar     = require('chokidar');
const utils        = require('./utils');
const logger       = require('./logger');
const Collection   = require('./collection');
const fs           = require('./fs');

class Source extends Collection {

    constructor(sourcePath, props, items){
        super(props, items);
        this.name       = utils.slugify(props.name.toLowerCase());
        this.label      = props.label || utils.titlize(props.name);
        this.title      = props.title || this.label;
        this.labelPath  = '';
        this.path       = '';
        this.sourcePath = sourcePath;
        this.ext        = props.ext;
        this.isLoaded   = false;
        this._engine    = props.engine;
        this._loading   = null;
        this._app       = props.app;
        this._monitor   = null;
        this._defaults  = {};
        this._engines   = new Map();
        this._context   = _.cloneDeep(props.context || {});
        this._tags      = _.cloneDeep(props.tags || {});
        this._defaults.context = _.cloneDeep(props.context || {});
        this._defaults.tags    = _.clone(props.tags || []);
    }

    get parent() {
        return null;
    }

    get context() {
        return this._context;
    }

    get tags() {
        return this._tags;
    }
    
    setTags(tags){
        this._tags = _.uniq(_.concat(tags, this._defaults.tags));
    }

    setContext(context){
        this._context = _.defaultsDeep(context, this._defaults.context);
    }

    setItems(items) {
        this._items = new Set(items || []);
        return this;
    }

    load(force){
        if (this._loading) {
            return this._loading;
        }
        if (force || !this.isLoaded) {
            return this._build().then(source => {
                logger.logInfo(`Finished parsing ${this.name} directory`);
                this.emit('loaded', this);
                this.isLoaded = true;
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
            logger.logInfo(`Finished parsing ${this.name} directory`);
            this.emit('changed', this);
            this.isLoaded = true;
            return source;
        });
    }

    watch(){
        if (!this._monitor && this.sourcePath) {
            logger.started(`Watching ${this.name} directory - ${this.sourcePath}`);
            this._monitor = chokidar.watch(this.sourcePath, {
                ignored: /[\/\\]\./
            });
            this._monitor.on('ready', () => {
                this._monitor.on('all', (event, path) => {
                    logger.logInfo(`Change in ${this.name} directory`);
                    this.refresh();
                });
            });
        }
    }

    unwatch(){
        this._monitor.close();
        this._monitor = null;
    }

    engine(){
        if (!this._engines.has(this._engine)) {
            const engine = this._app.engine(this._engine);
            if (!engine) {
                throw new Error('Engine not found')
            }
            if (_.isString(engine.engine)) {
                engine.engine = require(engine.engine);
            }
            const instance = engine.engine(this, engine.config);
            this._engines.set(this._engine, instance);
        }
        return this._engines.get(this._engine);
    }

    _build() {
        if (!this.sourcePath) {
            return Promise.resolve(this);
        }
        this._loading = fs.describe(this.sourcePath).then(fileTree => {
            this._loading = null;
            return this.transform(fileTree, this);
        }).catch(e => {
            logger.error(e);
        });
        return this._loading;
    }

    toJSON(){
        const self    = super.toJSON();
        self.name     = this.name;
        self.label    = this.label;
        self.title    = this.title;
        self.viewExt  = this.ext;
        self.isLoaded = this.isLoaded;
        return self;
    }

    newSelf(items) {
        return new Collection({}, items);
    }

}

_.extend(Source.prototype, EventEmitter.prototype);

module.exports = Source;
