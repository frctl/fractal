'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const utils   = require('../utils');
const data    = require('../data');

module.exports = class Variant {

    constructor(props) {
        this.type     = 'variant';
        this.name     = props.name;
        this.handle   = props.handle;
        this.order    = props.order || 10000;
        this.view     = props.view;
        this.label    = props.label || utils.titlize(this.name);
        this.title    = props.title || this.label;
        this.viewPath = props.viewPath;
        this.notes    = props.notes || null;
        this.display  = props.display || {};
        this._parent  = props.parent;
        this._source  = this._parent._source;
        this._context = props.context || {};
        this._config  = props;

        const p      = this._parent;
        this._status = props.status  || p._status;
        this.preview = props.preview || p._preview;
        this.display = props.display || p._display;

        const pfs = this._parent.files;

        const isRelated = (f) => {
            if (f.name.includes(this._source.splitter)) {
                return f.name === this.handle;
            }
            return true;
        };

        this.files = {
            view:   pfs.variants.filter(f => f.base === this.view)[0] || pfs.view,
            binary: pfs.binary,
            other:  pfs.other.filter(isRelated).sort((f) => {
                return f.name.includes(this._source.splitter);
            }),
        };
    }

    get alias() {
        if (this.parent.getDefaultVariant().handle === this.handle) {
            return this.parent.handle;
        }
        return null;
    }

    get status(){
        return this._source.statusInfo(this._status);
    }

    get context() {
        return _.defaultsDeep(this._context, this._parent.context);
    }

    get parent() {
        return this._parent;
    }

    get siblings() {
        return this._parent.variants;
    }

    get content() {
        return this.files.view.buffer.toString('utf8');
    }

    getVariant() {
        return this;
    }

    toJSON() {
        return utils.toJSON(this);
    }

};
