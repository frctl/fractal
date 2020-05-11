'use strict';

const _ = require('lodash');
const anymatch = require('anymatch');
const Promise = require('bluebird');

const utils = require('../../core/utils');
const Log = require('../../core/log');
const mix = require('../../core/mixins/mix');
const Configurable = require('../../core/mixins/configurable');
const Emitter = require('../../core/mixins/emitter');
const Source = require('./source');

module.exports = class AssetSourceCollection extends mix(Configurable, Emitter) {

    constructor(app) {
        super('assets', app);
        this.name = 'assets';
        this._app = app;
        this._sources = new Map();
        this.config(app.get(this.name));
    }

    get label() {
        return this.get('label') || utils.titlize(this.name);
    }

    get title() {
        return this.get('title') || this.label;
    }

    add(name, config) {
        name = utils.slugify(name).replace('/', '-');
        config = config || {};
        if (_.isString(config)) {
            config = {
                path: config,
            };
        }
        config = _.defaults(config, {
            path: process.cwd(),
            match: '**/*',
        });
        const source = new Source(name, config, this._app);
        this._sources.set(name, source);
        return source;
    }

    remove(name) {
        this._sources.delete(name);
        return this;
    }

    find(name) {
        return this._sources.get(name);
    }

    sources() {
        const sources = [];
        this._sources.forEach(source => sources.push(source));
        return sources;
    }

    toArray() {
        return this.sources();
    }

    visible() {
        const sources = [];
        this._sources.forEach(source => source.isHidden ? null : sources.push(source));
        return sources;
    }

    watch() {
        this.sources().forEach(s => s.watch());
        return this;
    }

    unwatch() {
        this.sources().forEach(s => s.unwatch());
        return this;
    }

    load() {
        return Promise.all(this.sources().map(s => s.load()));
    }

    toJSON() {
        const self = super.toJSON();
        self.name = this.name;
        self.label = this.label;
        self.title = this.title;
        self.isCollection = true;
        self.items = this.toArray().map(i => (i.toJSON ? i.toJSON() : i));
        return self;
    }

    [Symbol.iterator]() {
        return this._sources.entries()[Symbol.iterator]();
    }

};
