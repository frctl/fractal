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
const source  = require('../source');

module.exports = class Component {

    constructor(props, files) {
        this.type     = 'component';
        this._config  = props;
        this._files   = files;
        this.name     = props._name;
        this.handle   = props.handle || utils.slugify(this.name);
        this.atHandle = `@${this.handle}`;
        this.order    = props.order;
        this.isHidden = props.isHidden;
        this.label    = props.label || utils.titlize(this.name);
        this.title    = props.title || this.label;
        this.variants = new Map();
        this.default  = props.config || 'default';

        this._variantProps = {
            status:  props.status  || config.get('components.status.default'),
            preview: props.preview || config.get('components.preview.layout'),
            view:    props.view,
            context: props.context || {},
            display: props.display || {},
            parent:  this,
            order:   100000
        };

    }

    get variantProps() {
        return this._variantProps;
    }

    addVariants(variants) {
        variants.forEach(v => this.addVariant(v));
        return this;
    }

    addVariant(variant) {
        this.variants.set(variant.handle, variant);
        return this;
    }

    getVariant(handle) {
        return this.variants.get(handle);
    }

    getVariants() {
        return _.sortBy(Array.from(this.variants.values()), ['order', '_name']);
    }

    hasVariant(handle) {
        return this.variants.has(handle);
    }

    toJSON() {
        return utils.toJSON(this);
    }

    static create(props, relatedFiles) {
        return co(function* () {
            const comp     = new Component(props, relatedFiles);
            const confVars = yield variantsFromConfig(comp, props.variants || []);
            const skip     = confVars.map(v => v.name);
            const fileVars = yield variantsFromFiles(comp, relatedFiles, skip);
            comp.addVariants(_.concat(fileVars, confVars));
            logger.dump(comp.getVariants());
            return comp;
        });
    }
};

function variantsFromFiles(component, files, skip) {
    skip = skip || [];
    let variants = match.findVariantsOf(component.name, files);
    variants = variants.map(v => {
        if (_.includes(skip, v.name)) {
            // skip any variants that have been specified in the component config
            return null;
        }
        const props = _.clone(component.variantProps);
        props._name = v.name;
        props.view  = v.base;
        return source.loadConfigFile(v.name, files, props).then(c => Variant.create(c));
    });
    return Promise.all(_.compact(variants));
}

function variantsFromConfig(component, varConfs) {
    let variants = varConfs.map(conf => {
        if (_.isUndefined(conf.handle)) {
            logger.error(`Could not create variant of ${component.handle} - handle value is missing`);
        }
        return Variant.create(_.defaults(conf, component.variantProps, {
            _name: conf.handle
        }));
    });
    return _.compact(variants);
}
