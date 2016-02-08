'use strict';

const EventEmitter = require('events').EventEmitter;
const Promise      = require('bluebird');
const _            = require('lodash');
const chokidar     = require('chokidar');
const utils        = require('./utils');
const Collection   = require('./collection');

class Source extends Collection {

    constructor(sourcePath, props, items){
        super(props, items);
        this.name       = utils.slugify(props.name);
        this.label      = props.label || utils.titlize(props.name);
        this.title      = props.title || this.label;
        this.labelPath  = '';
        this.path       = '';
        this.sourcePath = sourcePath;
        this.ext        = props.ext;
        this.loaded     = false;
        this.engine     = props.engine;
        this._app       = props.app;
        this._monitor   = null;
        this._defaults  = {};
        this._context   = _.cloneDeep(props.context || {});
        this._engines = new Map();
        this._defaults.context = _.cloneDeep(props.context || {});
    }

    set context(context) {
        this._context = _.defaultsDeep(context, this._defaults.context);
    }

    get context() {
        return this._context;
    }

    setItems(items) {
        this._items = new Set(items || []);
        return this;
    }

    flatten() {
        return new Collection({}, this.flattenItems(this.items()));
    }

    squash(){
        return new Collection({}, this.squashItems(this.items()));
    }

    filter(predicate){
        return new Collection({}, this.filterItems(this.items(), predicate));
    }

    load(){
        return this._load().then(source => {
            this.emit('loaded', this);
            return source;
        });
    }

    refresh() {
        return this.loaded ? this._load().then(source => {
            this.emit('changed', this);
            return source;
        }) : this.load();
    }

    watch(){
        if (!this._monitor) {
            this._monitor = chokidar.watch(this.sourcePath, {
                ignored: /[\/\\]\./
            });
            this._monitor.on('ready', () => {
                this._monitor.on('all', (event, path) => {
                    this.refresh();
                });
            });
        }
    }

    endWatch(){
        this._monitor.close();
        this._monitor = null;
        process.exit();
    }

    getEngine(){
        if (!this._engines.has(this.engine)) {
            const engine = this._app.engine(this.engine);
            if (!engine) {
                throw new Error('Engine not found')
            }
            if (_.isString(engine.engine)) {
                engine.engine = require(engine.engine);
            }
            const instance = engine.engine(this, engine.config);
            this._engines.set(this.engine, instance);
        }
        return this._engines.get(this.engine);
    }

}

_.extend(Source.prototype, EventEmitter.prototype);

module.exports = Source;
