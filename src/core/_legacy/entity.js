'use strict';

const _     = require('lodash');
const utils = require('./utils');

module.exports = class Entity {

    constructor(type, opts) {

        this.type     = type;
        this.name     = utils.slugify(opts.name.toLowerCase());
        this.order    = parseInt(opts.order, 10) || 10000;
        this.isHidden = opts.isHidden || opts.hidden || false;

        this._props   = new Map();
        this._parent  = opts.parent;
        this._source  = opts.parent.source;

        this.setProps(opts);

        for (let key of _.keys(this.source.setting('default'))) {
            Object.defineProperty(this, key, {
                get: function () {
                    return this.getProp(key);
                },
                set: function (value) {
                    this.setProp(key, value);
                },
                enumerable: true,
                configurable: true,
            });
        }

        Object.defineProperty(this, 'path', {
            enumerable: true,
            get() {
                let p = this.parent;
                let pathParts = [];
                while (p) {
                    pathParts.unshift(p.handle);
                    p = p.parent;
                }
                pathParts.push(this.handle);
                return _.trim(_.compact(pathParts).join('/').replace(/index$/i, ''), '/');
            }
        });

        Object.defineProperty(this, 'status', {
            enumerable: true,
            get() {
                return this.source.statusInfo(this.getProp('status'));
            }
        });
    }

    get parent() {
        return this._parent;
    }

    get source() {
        return this._source;
    }

    getProp(key) {
        const upstream = this.parent.getProp(key);
        const prop     = this._props.get(key);
        return utils.mergeProp(prop, upstream);
    }

    setProps(obj) {
        _.forEach(obj, (value, key) => {
            this.setProp(key, value);
        });
    }

    setProp(key, value) {
        if (!_.isUndefined(this.source.setting(`default.${key}`))) {
            this._props.set(key, value);
        }
    }

};
