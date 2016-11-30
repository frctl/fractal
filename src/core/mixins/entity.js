'use strict';

const _ = require('lodash');
const utils = require('../utils');
const mixin = require('mixwith').Mixin;

module.exports = mixin((superclass) => class Entity extends superclass {

    constructor() {
        super();
        super.addMixedIn('Entity');

        Object.defineProperty(this, 'path', {
            enumerable: true,
            get() {
                let p = this.parent;
                const pathParts = [];
                while (p) {
                    if (p && ! p.isSource) pathParts.unshift(p.name);
                    p = p.parent;
                }
                if (!this.isIndex) {
                    pathParts.push(this.name);
                }
                return _.trim(_.compact(pathParts).join('/'), '/');
            },
        });
    }

    initEntity(name, config, parent) {
        this._parent = parent;
        this._source = parent.source;
        this._app = parent.source._app;
        this.name = utils.slugify(name.toLowerCase());
        this.handle = this._handle(config);
        this.label = config.label || this._label(config);
        this.title = config.title || this._title(config);
        this.order = _.isNaN(parseInt(config.order, 10)) ? 10000 : parseInt(config.order, 10);
        this._isHidden = config.isHidden || config.hidden || false;
        this.id = this._id(config);
    }

    get alias() {
        return null;
    }

    get source() {
        return this._source;
    }

    get parent() {
        return this._parent;
    }

    get isHidden() {
        if (this._isHidden) {
            return true;
        }
        let p = this.parent;
        while (p) {
            if (p && ! p.isSource) {
                if (p._isHidden) {
                    return true;
                }
            }
            p = p.parent;
        }
        return false;
    }

    _id(config) {
        return utils.md5([this.source.name, this.path, this.handle].join('-'));
    }

    _handle(config) {
        if (config.handle) {
            return utils.slugify(config.handle).toLowerCase();
        }
        return this.name;
    }

    _label(config) {
        return utils.titlize(this.name);
    }

    _title(config) {
        return this.label;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            handle: this.handle,
            label: this.label,
            title: this.title,
            order: this.order,
            isHidden: this.isHidden,
            alias: this.alias,
        };
    }

});
