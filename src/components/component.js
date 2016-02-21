'use strict';

const Promise           = require('bluebird');
const _                 = require('lodash');
const co                = require('co');
const Path              = require('path');
const Variant           = require('./variant');
const cli               = require('../cli');
const data              = require('../data');
const utils             = require('../utils');
const md                = require('../markdown');
const VariantCollection = require('../variants/collection');

module.exports = class Component {

    constructor(props, files, assets) {
        this.type        = 'component';
        this.name        = utils.slugify(props.name);
        this.handle      = props.parent._prefix ? `${props.parent._prefix}-${this.name}` : this.name;
        this.order       = props.order;
        this.isHidden    = props.isHidden;
        this.label       = props.label || utils.titlize(props.name);
        this.title       = props.title || this.label;
        this.defaultName = props.default || 'default';
        this.notes       = props.notes ? md(props.notes) : null;
        this._parent     = props.parent;
        this._source     = props.source;
        // this._variants   = new Map();
        this._context    = _.clone(props.context) || {};
        this._tags       = props.tags || [];
        this._status     = props.status  || props.parent._status;
        this._preview    = props.preview || props.parent._preview;
        this._display    = props.display || props.parent._display;
        this._assets     = assets;

        this._variants = VariantCollection.create(this, files.view, props.variants, files.varViews, props);
    }

    get context() {
        return _.defaultsDeep(this._context, this._parent.context);
    }

    get tags() {
        return _.uniq(_.concat(this._tags, this._parent.tags));
    }

    get status() {
        const variantStatuses = _.compact(_.uniq(_.map(this.variants(), v => v._status)));
        return this._source.statusInfo(variantStatuses);
    }

    get parent() {
        return this._parent;
    }

    get content() {
        return this.defaultVariant().getContentSync();
    }

    hasTag(tag) {
        return _.includes(this.tags, tag);
    }

    assets() {
        return this._assets;
    }

    flatten() {
        return this.variants();
    }

    variants() {
        return this._variants;
    }

    //
    // get variantCount() {
    //     return this._variants.size;
    // }
    //
    // addVariants(variants) {
    //     variants.forEach(v => this.addVariant(v));
    //     return this;
    // }
    //
    // addVariant(variant) {
    //     if (!this._variants.has(variant.name)) {
    //         this._variants.set(variant.name, variant);
    //     }
    //     return this;
    // }
    //
    // variant(name) {
    //     return (name && name !== this.defaultName) ? this._variants.get(name) : this.defaultVariant();
    // }
    //
    // getVariant(name) {
    //     cli.debug('Component.getVariant() is deprecated. Use Component.variant() instead.');
    //     return this.variant(name);
    // }
    //
    // getVariantByHandle(handle) {
    //     const parts = handle.split(this._source.splitter);
    //     if (parts.length === 1 || parts[0] !== this.handle) {
    //         return null;
    //     }
    //     return this.variant(parts[1]);
    // }
    //
    // variants() {
    //     return _.sortBy(Array.from(this._variants.values()), ['order', '_name']);
    // }
    //
    // hasVariant(name) {
    //     return this._variants.has(name);
    // }
    //
    // defaultVariant() {
    //     return this._variants.get(this.defaultName);
    // }
    //
    // getDefaultVariant() {
    //     cli.debug('Component.getDefaultVariant() is deprecated. Use Component.defaultVariant() instead.');
    //     return this.defaultVariant();
    // }

    toJSON() {
        return {
            type:     this.type,
            name:     this.name,
            handle:   this.handle,
            label:    this.label,
            title:    this.title,
            notes:    this.notes,
            status:   this.status,
            tags:     this.tags,
            isHidden: this.isHidden,
            order:    this.order,
            preview:  this._preview,
            display:  this._display,
            variants: this.variants().toJSON()
        };
    }

    static create(props, files, assets) {
        props.notes    = props.notes || props.readme || (files.readme ? files.readme.readSync() : null);
        return new Component(props, files, assets);
    }
};
