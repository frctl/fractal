'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const co      = require('co');
const Path    = require('path');
const Variant = require('./variant');
const status  = require('./status');
const match   = require('../matchers');
const logger  = require('../logger');
const data    = require('../data');
const utils   = require('../utils');
const config  = require('../config');

module.exports = class Component {

    constructor(props, files) {
        this.type          = 'component';
        this._config       = props;
        this.name          = props._name;
        this.handle        = props.handle || utils.slugify(this.name);
        this.ref           = `@${this.handle}`;
        this.order         = props.order;
        this.isHidden      = props.isHidden;
        this.label         = props.label || utils.titlize(this.name);
        this.title         = props.title || this.label;
        this.defaultHandle = props.default || 'default';
        this._parent       = props.parent;
        this._variants     = new Map();
        this._context      = props.context || {};

        const p      = this._parent;
        this._status  = props.status  || p.status;
        this._preview = props.preview || p.preview;
        this._display = props.display || p.display;

        let filtered = files.filter(f => ! match.configs(f));
        this.files = {
            view:     filtered.filter(f => f.base === props.view)[0],
            variants: match.findVariantsOf(this.name, filtered),
            binary:   filtered.filter(f => f.isBinary),
            other:    filtered.filter(f => (f.base !== props.view) && !f.isBinary),
        };
    }

    get context(){
        return _.defaultsDeep(this._context, this._parent.context);
    }

    get variants() {
        return this.getVariants();
    }

    get statuses(){
        return status(_.compact(_.uniq(_.map(this.variants, v => v._status))));
    }

    addVariants(variants) {
        variants.forEach(v => this.addVariant(v));
        return this;
    }

    addVariant(variant) {
        if (!this._variants.has(variant.handle)) {
            this._variants.set(variant.handle, variant);
        }
        return this;
    }

    getVariant(handle) {
        return (handle && handle !== this.defaultHandle) ? this._variants.get(handle) : this.getDefaultVariant();
    }

    getVariants() {
        return _.sortBy(Array.from(this._variants.values()), ['order', '_name']);
    }

    hasVariant(handle) {
        return this._variants.has(handle);
    }

    getDefaultVariant() {
        let vars = this._variants;
        if (vars.has(this.defaultHandle)) {
            return vars.get(this.defaultHandle);
        }
        vars = this.getVariants();
        for (let val of vars) {
            // return the first component with a matching view template
            if (val.view === this._view) {
                return val;
            }
        }
        return vars[0];
    }

    toJSON() {
        return utils.toJSON(this);
    }

    static create(props, relatedFiles) {
        return co(function* () {

            const comp     = new Component(props, relatedFiles);

            const vDefaults = {
                view:    props.view,
                dir:     props.dir,
                parent:  comp
            };

            const confVars = yield variantsFromConfig(comp.name, props.variants || [], vDefaults);
            const fileVars = yield comp.files.variants.map(v => Variant.createFromFiles(v, relatedFiles, vDefaults));
            const variants = _.concat(fileVars, confVars);
            if (!variants.length) {
                const defaultVariant = yield Variant.create(_.defaultsDeep({
                    name: comp.defaultHandle,
                    handle: comp.defaultHandle,
                    viewPath: props.view,
                }, vDefaults));
                variants.push(defaultVariant);
            }
            comp.addVariants(variants);
            return comp;
        });
    }
};

function variantsFromConfig(name, configSet, defaults) {
    let variants = configSet.map(conf => {
        if (_.isUndefined(conf.handle)) {
            logger.error(`Could not create variant of ${name} - handle value is missing`);
            return null;
        }
        const props = _.defaultsDeep(conf, defaults);
        props._name = conf.handle;
        props.viewPath = Path.join(defaults.dir, props.view);
        return Variant.create(props);
    });;
    return Promise.all(_.compact(variants));
}
