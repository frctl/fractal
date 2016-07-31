'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const anymatch = require('anymatch');

const utils = require('../utils');
const Log = require('../log');
const Data = require('../data');
const Adapter = require('../adapter');
const mix = require('../mixins/mix');
const Source = require('../mixins/source');
const Heritable = require('../mixins/heritable');

module.exports = class EntitySource extends mix(Source, Heritable) {

    constructor(name, app) {
        super();
        this._engine = null;
        this.initSource(name, app.get(this.name), app);
        this.config(app.get(this.name));
        this.setHeritable(_.keys(this.get('default')));
    }

    /**
     * Return a new collection that only includes
     * non-collection-type items
     * @return {Collection}
     */
    entities() {
        return this.newSelf(this.toArray().filter(i => ! i.isCollection));
    }

    engine(adapter) {
        if (!arguments.length) {
            if (this._engine === null) {
                return this.engine(this.get('engine')); // load the default template engine
            }
            return this._engine;
        }
        if (_.isString(adapter)) {
            adapter = require(adapter);
        }
        if (_.isFunction(adapter)) {
            adapter = adapter({});
        }
        if (!_.isFunction(adapter.register)) {
            throw new Error('Template engine adaptor factory functions must return an object with a \'register\' method.');
        }
        const engine = adapter.register(this, this._app);
        if (!(engine instanceof Adapter)) {
            // throw new Error(`Template engine adapters must extend the base Adapter class.`);
        }
        this._engine = engine;
        engine.load();
        return engine;
    }

    getProp(key) {
        const upstream = this.get(`default.${key}`);
        const prop = this._props.get(key);
        return utils.mergeProp(prop, upstream);
    }

    statusInfo(handle) {
        const statuses = this.get('statuses');
        const defaultStatus = this.get('default.status');
        if (_.isNull(handle)) {
            return null;
        }
        if (_.isUndefined(handle)) {
            return statuses[defaultStatus];
        }
        if (!statuses[handle]) {
            Log.warn(`Status ${handle} is not a known option.`);
            return statuses[defaultStatus];
        }
        return statuses[handle];
    }

    toJSON() {
        const self = super.toJSON();
        self.name = this.name;
        self.label = this.label;
        self.title = this.title;
        self.viewExt = this.get('ext');
        self.isLoaded = this.isLoaded;
        self.isWatching = this.isWatching;
        self.path = this.get('path');
        self.relPath = this.relPath;
        self.fullPath = this.fullPath;
        self.isCollection = true;
        self.isSource = true;
        self.items = this.toArray().map(i => (i.toJSON ? i.toJSON() : i));
        return self;
    }

    static getConfig(file, defaults) {
        defaults = defaults || {};
        if (!file) {
            return Promise.resolve(defaults);
        }
        return Data.readFile(file.path).then(c => _.defaultsDeep(c, defaults)).catch(err => {
            Log.error(`Error parsing data file ${file.path}: ${err}`);
            return defaults;
        });
    }


};
