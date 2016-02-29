'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const utils   = require('../utils');
const data    = require('../data');
const md      = require('../markdown');

module.exports = class Variant {

    constructor(props, view, assets) {
        this.type        = 'variant';
        this.id          = utils.md5(props.name + props.viewPath);
        this.name        = props.name.toLowerCase();
        this.handle      = props.handle.toLowerCase();
        this.order       = props.order || 10000;
        this.view        = props.view;
        this.label       = props.label || utils.titlize(this.name);
        this.title       = props.title || this.label;
        this.viewPath    = props.viewPath;
        this.notes       = props.notes;
        this.display     = props.display || {};
        this.isDefault   = props.isDefault || false;
        this._parent     = props.parent;
        this._source     = this._parent._source;
        this._context    = props.context || {};
        this._config     = props;
        this._status     = props.status  || this._parent._status;
        this.preview     = props.preview || this._parent._preview;
        this.display     = props.display || this._parent._display;
        this.lang        = view.lang.name;
        this.editorMode  = view.lang.mode;
        this.editorScope = view.lang.scope;
        this._view       = view;
        this._assets     = assets;
    }

    get alias() {
        if (this.parent.variants().default().handle === this.handle) {
            return this.parent.handle;
        }
        return null;
    }

    get status() {
        return this._source.statusInfo(this._status);
    }

    get context() {
        return _.defaultsDeep(this._context, this._parent.context);
    }

    get parent() {
        return this._parent;
    }

    get siblings() {
        return this._parent.variants();
    }

    variant() {
        return this;
    }

    defaultVariant() {
        return this;
    }

    get content() {
        return this.getContentSync();
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
            viewPath:  this.viewPath,
            content:   this.getContentSync(),
            preview:   this.preview,
            context:   this.context,
            isDefault: this.isDefault,
            assets:    this.assets().toJSON()
        };
    }

};
