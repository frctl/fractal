'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const utils   = require('../utils');
const config  = require('../config');
const data    = require('../data');
const match   = require('../matchers');

module.exports = class Variant {

    constructor(props) {
        this.type     = 'variant';
        this.name     = props._name;
        this.handle   = props.handle || this.name.split(config.get('components.splitter'))[1];
        this.ref      = `@${props.parent.handle}${config.get('components.splitter')}${this.handle}`;
        this.order    = props.order || 10000;
        this.view     = props.view;
        this.viewPath = props.viewPath;
        this._parent  = props.parent;
        this._context = props.context || {};
        this._config  = props;

        const p      = this._parent;
        this._status  = props.status  || p._status;
        this.preview = props.preview || p._preview;
        this.display = props.display || p._display;

        const pfs = this._parent.files;
        this.files = {
            view:   pfs.variants.filter(f => f.base === this.view)[0] || pfs.view,
            binary: pfs.binary,
            other:  pfs.other,
        };
    }

    get context() {
        // need to resolve cascade
        return _.defaultsDeep(this._context, this._parent.context);
    }

    get parent() {
        return this._parent;
    }

    get status() {
        return this._status;
    }

    get siblings() {
        return this._parent.variants;
    }

    get viewContents() {
        return this.files.view.buffer.toString('UTF-8');
    }

    getVariant() {
        return this;
    }

    static create(props) {
        return Promise.resolve(new Variant(props));
    }

    toJSON() {
        return utils.toJSON(this);
    }

    static createFromFiles(view, files, defaults) {
        const configFile = match.findConfigFor(view.name, files);
        const props = _.cloneDeep(defaults);
        props._name = view.name;
        props.view  = view.base;
        props.viewPath = view.path;
        return data.getConfig(configFile, props).then(c => Variant.create(c));
    }
};
