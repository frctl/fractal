'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const co      = require('co');
const Variant = require('./variant');
const match   = require('../matchers');
const logger  = require('../logger');
const data    = require('../data');
const utils   = require('../utils');
const config  = require('../config');

module.exports = class Component {

    constructor(props, files) {
        this.type      = 'component';
        this._config   = props;
        this._files    = files;
        this.name      = props._name;
        this.handle    = props.handle || utils.slugify(this.name);
        this.ref       = `@${this.handle}`;
        this.order     = props.order;
        this.isHidden  = props.isHidden;
        this.label     = props.label || utils.titlize(this.name);
        this.title     = props.title || this.label;
        this.defaultHandle  = props.default || 'default';
        this._variants = new Map();
        this._view     = props.view;
        this._parent   = props.parent;
        // TODO: filter files
    }

    get variants() {
        return this.getVariants();
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
        return handle ? this._variants.get(handle) : this.getDefaultVariant();
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
                status:  props.status  || config.get('components.status.default'),
                preview: props.preview || config.get('components.preview.layout'),
                view:    props.view,
                context: props.context || {},
                display: props.display || {},
                parent:  comp,
                order:   100000
            };

            const confVars = yield variantsFromConfig(comp.name, props.variants || [], vDefaults);
            const fileVars = yield variantsFromFiles(comp.name, relatedFiles, vDefaults);
            const variants = _.concat(fileVars, confVars);
            if (!variants.length) {
                const defaultVariant = yield Variant.create(_.defaultsDeep({
                    name: comp.defaultHandle,
                    handle: comp.defaultHandle
                }, vDefaults));
                variants.push(defaultVariant);
            }
            comp.addVariants(variants);
            return comp;
        });
    }
};

function variantsFromFiles(name, files, defaults) {
    let variants = match.findVariantsOf(name, files);
    return Promise.all(variants.map(view => {
        return Variant.createFromFiles(view, files, defaults);
    }));
}

function variantsFromConfig(name, configSet, defaults) {
    let variants = configSet.map(conf => {
        if (_.isUndefined(conf.handle)) {
            logger.error(`Could not create variant of ${name} - handle value is missing`);
            return null;
        }
        const props = _.defaultsDeep(conf, defaults, {
            _name: conf.handle
        })
        return Variant.create(props);
    });;
    return Promise.all(_.compact(variants));
}
