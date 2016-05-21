'use strict';

const _            = require('lodash')
const anymatch     = require('anymatch');

const utils        = require('../../core/utils');
const Log          = require('../../core/log');
const mix          = require('../../core/mixins/mix');
const Configurable = require('../../core/mixins/configurable');
const Collection   = require('../../core/mixins/collection');
const Emitter      = require('../../core/mixins/emitter');
const Source       = require('./source');

module.exports = class AssetSourceCollection extends mix(Configurable, Collection, Emitter) {

    constructor(app){
        super('assets', app);
        this.name = 'assets';
        this._app = app;
        this.config(app.get(this.name));
    }

    get label() {
        return this.get('label') || utils.titlize(this.name);
    }

    get title() {
        return this.get('title') || this.label;
    }

    add(name, config) {
        if (_.isString(config)) {
            config = { path: config };
        }
        config = _.defaults(config, {
            filter: '*'
        });
        this.pushItem(new Source(name, config, this._app));
        return this;
    }

    remove(name) {
        for (let item of this.items()) {
            if (item.name === name) {
                this.removeItem(item);
            }
        }
        return this;
    }

    sources() {
        return this.toArray();
    }

    toJSON() {
        const self        = super.toJSON();
        self.name         = this.name;
        self.label        = this.label;
        self.title        = this.title;
        self.isCollection = true;
        self.items        = this.toArray().map(i => (i.toJSON ? i.toJSON() : i));
        return self;
    }

};
