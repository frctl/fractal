'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const co      = require('co');
const Path    = require('path');
const Variant = require('./variant');
const logger  = require('../logger');
const data    = require('../data');
const utils   = require('../utils');

module.exports = class Component {

    constructor(props, files) {

        this.type          = 'component';
        this._config       = props;
        this.name          = utils.slugify(props.name);
        this.handle        = this.name; // component's handles are the same as their names
        this.order         = props.order;
        this.isHidden      = props.isHidden;
        this.label         = props.label || utils.titlize(this.name);
        this.title         = props.title || this.label;
        this.defaultName   = props.default || 'default';
        this.notes         = props.notes || props.readme || (files.readme ? files.readme.toString() : null);
        this._view         = props.view;
        this._viewName     = props.viewName;
        this._parent       = props.parent;
        this._source       = props.source;
        this._variants     = new Map();
        this._context      = props.context || {};
        this._tags         = props.tags || [];

        const p            = this._parent;
        this._status       = props.status  || p._status;
        this._preview      = props.preview || p._preview;
        this._display      = props.display || p._display;

        this.files = {
            view:     files.view,
            variants: files.varViews,
            binary:   files.other.filter(f => f.isBinary),
            other:    files.other.filter(f => !f.isBinary),
            readme:   files.readme || null
        };
    }

    get context() {
        return _.defaultsDeep(this._context, this._parent.context);
    }

    get tags() {
        return _.uniq(_.concat(this._tags, this._parent.tags));
    }

    hasTag(tag) {
        return _.includes(this.tags, tag);
    }

    get variants() {
        return this.getVariants();
    }

    get status(){
        const variantStatuses = _.compact(_.uniq(_.map(this.variants, v => v._status)));
        return this._source.statusInfo(variantStatuses);
    }

    get variantCount() {
        return this._variants.size;
    }

    get parent() {
        return this._parent;
    }

    flatten(){
        return this.getVariants();
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

    getVariant(name) {
        return (name && name !== this.defaultName) ? this._variants.get(name) : this.getDefaultVariant();
    }

    getVariantByHandle(handle) {
        const parts = handle.split(this._source.splitter);
        if (parts.length === 1 || parts[0] !== this.handle) {
            return null;
        }
        return this.getVariant(parts[1]);
    }

    getVariants() {
        return _.sortBy(Array.from(this._variants.values()), ['order', '_name']);
    }

    hasVariant(name) {
        return this._variants.has(name);
    }

    getDefaultVariant() {
        return this._variants.get(this.defaultName);
    }

    get content() {
        return this.getDefaultVariant().content;
    }

    toJSON() {
        return utils.toJSON(this);
    }

    static create(props, files) {

        const source   = props.source;
        const comp     = new Component(props, files);
        const varConfs = props.variants || [];
        const variants = [];

        // first figure out if we need a 'default' variant.
        const hasDefaultConfigured = _.find(varConfs, ['name', comp.defaultName]);

        if (!hasDefaultConfigured) {
            variants.push(new Variant({
                name:     comp.defaultName,
                handle:   `${comp.handle}${source.splitter}${comp.defaultName}`.toLowerCase(),
                view:     props.view,
                viewPath: Path.join(props.dir, props.view),
                dir:      props.dir,
                parent:   comp
            }));
        }

        varConfs.forEach(conf => {
            if (_.isUndefined(conf.name)) {
                logger.error(`Could not create variant of ${comp.handle} - 'name' value is missing`);
                return null;
            }
            const p = _.defaults(conf, {
                dir:    props.dir,
                parent: comp
            });
            if (!p.view) {
                // no view file specified
                const viewName = `${props.viewName}${source.splitter}${p.name}`.toLowerCase();
                const view     = _.find(files.varViews, f => f.name.toLowerCase() === viewName);
                p.view         = view ? view.base : props.view;
            }
            p.viewPath = Path.join(p.dir, p.view);
            p.handle = `${comp.name}${source.splitter}${p.name}`.toLowerCase();
            variants.push(new Variant(p));
        });

        const usedViews = variants.map(v => v.view);

        files.varViews.filter(f => !_.includes(usedViews, f.base)).forEach(f => {
            const name = f.name.split(source.splitter)[1];
            const variant = new Variant({
                name:     name.toLowerCase(),
                handle:   `${comp.handle}${source.splitter}${name}`.toLowerCase(),
                view:     f.base,
                viewPath: f.path,
                dir:      props.dir,
                parent:   comp
            });
            variants.push(variant);
        });

        comp.addVariants(variants);
        return comp;
    }
};
