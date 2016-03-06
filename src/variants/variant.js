'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const utils   = require('../utils');
const data    = require('../data');
const md      = require('../markdown');
const Entity  = require('../entity');

module.exports = class Variant extends Entity {

    constructor(opts, view, assets) {
        super('variant', opts);
        this.id          = utils.md5(opts.name + opts.viewPath);
        this.handle      = opts.handle.toLowerCase();
        this.order       = opts.order || 10000;
        this.view        = opts.view;
        this.label       = opts.label || utils.titlize(this.name);
        this.title       = opts.title || `${opts.parent.title}: ${this.label}`;
        this.viewPath    = opts.viewPath;
        this.notes       = opts.notes || this.parent.notes;
        this.isDefault   = opts.isDefault || false;
        this.lang        = view.lang.name;
        this.editorMode  = view.lang.mode;
        this.editorScope = view.lang.scope;
        this._view       = view;
        this._assets     = assets;
    }

    get alias() {
        if (this.isDefault) {
            return this.parent.handle;
        }
        return null;
    }

    get siblings() {
        return this.parent.variants();
    }
    
    get content() {
        return this.getContentSync();
    }

    variant() {
        return this;
    }

    defaultVariant() {
        return this;
    }

    assets() {
        return this._assets;
    }

    getContent() {
        return this._view.read().then(c => c.toString());
    }

    getContentSync() {
        return this._view.readSync().toString();
    }

    toJSON() {
        return {
            type:      this.type,
            id:        this.id,
            name:      this.name,
            handle:    this.handle,
            alias:     this.alias,
            label:     this.label,
            title:     this.title,
            notes:     this.notes,
            status:    this.status,
            display:   this.display,
            isDefault: this.isDefault,
            isHidden:  this.isHidden,
            viewPath:  this.viewPath,
            content:   this.getContentSync(),
            preview:   this.preview,
            context:   this.context,
            isDefault: this.isDefault,
            assets:    this.assets().toJSON()
        };
    }

};
