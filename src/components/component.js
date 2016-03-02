'use strict';

const Promise           = require('bluebird');
const _                 = require('lodash');
const co                = require('co');
const Path              = require('path');
const console           = require('../console');
const data              = require('../data');
const utils             = require('../utils');
const md                = require('../markdown');
const VariantCollection = require('../variants/collection');

module.exports = class Component {

    constructor(props, files, assets) {
        this.type        = 'component';
        this.id          = utils.md5(files.view.path);
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
        this._context    = _.clone(props.context) || {};
        this._tags       = props.tags || [];
        this._status     = props.status  || props.parent._status;
        this._preview    = props.preview || props.parent._preview;
        this._display    = props.display || props.parent._display;
        this._collated   = props.collated || props.parent._collated;
        this._assets     = assets;

        this._variants = null;
    }

    setVariants(variantCollection){
        this._variants = variantCollection;
    }

    get context() {
        return _.defaultsDeep(this._context, this._parent.context);
    }

    get tags() {
        return _.uniq(_.concat(this._tags, this._parent.tags));
    }

    get status() {
        const variantStatuses = _.compact(_.uniq(_.map(this.variants().toArray(), v => v._status)));
        return this._source.statusInfo(variantStatuses);
    }

    get parent() {
        return this._parent;
    }

    get content() {
        return this.variants().default().getContentSync();
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

    toJSON() {
        return {
            type:     this.type,
            id:       this.id,
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

    static *create(props, files, assets) {

            props.notes = props.notes || props.readme;
            if (!props.notes && files.readme) {
                props.notes = yield files.readme.read();
            }
            if (props.notes) {
                props.notes = yield props.source._app.docs.renderString(props.notes);
            }
            const comp = new Component(props, files, assets);
            const variants = yield VariantCollection.create(comp, files.view, props.variants, files.varViews, props);
            comp.setVariants(variants);
            return comp;
    }
};
