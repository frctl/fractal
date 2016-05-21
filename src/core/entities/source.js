'use strict';

const _            = require('lodash')
const anymatch     = require('anymatch');

const utils        = require('../utils');
const Log          = require('../log');
const Data         = require('../data');
const mix          = require('../mixins/mix');
const Source       = require('../mixins/source');
const Heritable    = require('../mixins/heritable');

module.exports = class EntitySource extends mix(Source, Heritable) {

    constructor(name, app){
        super();

        this._engine        = null;
        this._defaultEngine = '@frctl/handlebars-adapter';

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

    getProp(key) {
        const upstream = this.get(`default.${key}`);
        const prop     = this._props.get(key);
        return utils.mergeProp(prop, upstream);
    }

    statusInfo(handle) {
        if (handle) {
            return {
                label: handle
            };
        }
        return null;
    }

    toJSON() {
        const self        = super.toJSON();
        self.name         = this.name;
        self.label        = this.label;
        self.title        = this.title;
        self.viewExt      = this.get('ext');
        self.isLoaded     = this.isLoaded;
        self.isCollection = true;
        self.isSource     = true;
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
