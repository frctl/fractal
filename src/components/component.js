'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const co      = require('co');
const Path    = require('path');
const Variant = require('./variant');
const cli     = require('../cli');
const data    = require('../data');
const utils   = require('../utils');
const md      = require('../markdown');

module.exports = class Component {

    constructor(props, assets) {
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
        this._variants   = new Map();
        this._context    = _.clone(props.context) || {};
        this._tags       = props.tags || [];
        this._status     = props.status  || props.parent._status;
        this._preview    = props.preview || props.parent._preview;
        this._display    = props.display || props.parent._display;
        this._assets     = assets;
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

    get variantCount() {
        return this._variants.size;
    }
    
    get parent() {
        return this._parent;
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

    addVariants(variants) {
        variants.forEach(v => this.addVariant(v));
        return this;
    }

    addVariant(variant) {
        if (!this._variants.has(variant.name)) {
            this._variants.set(variant.name, variant);
        }
        return this;
    }

    variant(name) {
        return (name && name !== this.defaultName) ? this._variants.get(name) : this.defaultVariant();
    }

    getVariant(name) {
        cli.debug('Component.getVariant() is deprecated. Use Component.variant() instead.');
        return this.variant(name);
    }

    getVariantByHandle(handle) {
        const parts = handle.split(this._source.splitter);
        if (parts.length === 1 || parts[0] !== this.handle) {
            return null;
        }
        return this.variant(parts[1]);
    }

    variants() {
        return _.sortBy(Array.from(this._variants.values()), ['order', '_name']);
    }

    hasVariant(name) {
        return this._variants.has(name);
    }

    defaultVariant() {
        return this._variants.get(this.defaultName);
    }

    getDefaultVariant() {
        cli.debug('Component.getDefaultVariant() is deprecated. Use Component.defaultVariant() instead.');
        return this.defaultVariant();
    }

    get content() {
        return this.defaultVariant().getContentSync();
    }

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
            variants: this.variants().map(v => v.toJSON())
        };
    }

    static create(props, files, assets) {

        const source   = props.source;
        props.notes    = props.notes || props.readme || (files.readme ? files.readme.readSync() : null);
        const comp     = new Component(props, assets);
        const varConfs = props.variants || [];
        const variants = [];

        // first figure out if we need a 'default' variant.
        const hasDefaultConfigured = _.find(varConfs, ['name', comp.defaultName]);
        const defaultViewFile = files.view;

        function isRelated(variantHandle) {
            return function(file) {
                if (f.name.includes(source.splitter)) {
                    return f.name === variantHandle;
                }
                return true;
            }
        }

        if (!hasDefaultConfigured) {
            variants.push(new Variant({
                name:      comp.defaultName,
                handle:    `${comp.handle}${source.splitter}${comp.defaultName}`.toLowerCase(),
                view:      props.view,
                viewPath:  Path.join(props.dir, props.view),
                dir:       props.dir,
                isDefault: true,
                parent:    comp
            }, defaultViewFile, assets));
        }

        varConfs.forEach(conf => {
            let viewFile = null;
            if (_.isUndefined(conf.name)) {
                cli.error(`Could not create variant of ${comp.handle} - 'name' value is missing`);
                return null;
            }
            const p = _.defaults(conf, {
                dir:    props.dir,
                parent: comp
            });
            if (!p.view) {
                // no view file specified
                const viewName = `${props.viewName}${source.splitter}${p.name}`.toLowerCase();
                viewFile       = _.find(files.varViews, f => f.name.toLowerCase() === viewName);
                p.view         = viewFile ? viewFile.base : props.view;
            }
            viewFile = viewFile || defaultViewFile;
            p.isDefault = (p.name === comp.defaultName);
            p.viewPath  = Path.join(p.dir, p.view);
            p.handle    = `${comp.handle}${source.splitter}${p.name}`.toLowerCase();
            variants.push(
                new Variant(p, viewFile, assets.filter(isRelated(p.handle)))
            );
        });

        const usedViews = variants.map(v => v.view);

        files.varViews.filter(f => !_.includes(usedViews, f.base)).forEach(viewFile => {
            const name = viewFile.name.split(source.splitter)[1];
            const p = {
                name:     name.toLowerCase(),
                handle:   `${comp.handle}${source.splitter}${name}`.toLowerCase(),
                view:     viewFile.base,
                viewPath: viewFile.path,
                dir:      props.dir,
                parent:   comp,
            };
            variants.push(
                new Variant(p, viewFile, assets.filter(isRelated(p.handle)))
            );
        });

        comp.addVariants(variants);
        return comp;
    }
};
