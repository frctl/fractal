'use strict';

const _         = require('lodash');
const Source    = require('../source');
const transform = require('./transform');
const fs        = require('../fs');
const chokidar     = require('chokidar');

module.exports = class ComponentSource extends Source {

    constructor(sourcePath, props, items) {
        super(sourcePath, props, items);
        this.status  = props.status;
        this.preview = props.preview;
        this.display = props.display;
        this.config  = props.config;
        this.splitter = props.splitter;
        this._monitor = null;
    }

    load(){
        return this._load().then(() => this.emit('loaded', this));
    }

    refresh() {
        return this.loaded ? this._load().then(() => this.emit('changed', this)) : this.load();
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

    _load() {
        return fs.describe(this.sourcePath).then(fileTree => {
            return transform(fileTree, this).then(self => {
                this.loaded = true;
                return self;
            });
        });
    }
}
