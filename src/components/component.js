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
        this._name    = props.name;
        this.handle   = props.handle || utils.slugify(props.name);
        this.atHandle = `@${this.handle}`;
        this.order    = props.order;
        this.isHidden = props.isHidden;
        this.label    = props.label || utils.titlize(props.name);
        this.title    = props.title || this.label;
        this.variants = new Map();

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

    get variantProps(){
        return this._variantProps;
    }

    addVariants(variants){
        variants.forEach(v => this.addVariant(v));
    }

    addVariant(variant){
        this.variants.set(variant.handle, variant);
    }

    getVariant(handle){
        return this.variants.get(handle);
    }

    hasVariant(handle){
        return this.variants.has(handle);
    }

    toJSON(){
        return utils.toJSON(this);
    }

    static create(props, relatedFiles){
        return co(function* (){
            const c = new Component(props, relatedFiles);
            const fileVariants = yield variantsFromFiles(c, relatedFiles, c.variantProps);
            fileVariants.length ? logger.dump(fileVariants) : null;
            c.addVariants(fileVariants);
            return c;
        });
    }
}

function variantsFromFiles(component, files, defaults){
    defaults = defaults || {};
    let variants = match.findVariantsOf(component.name, files);
    return Promise.all(variants.map(v => {
        const defs = _.clone(defaults);
        defs.name = v.name;
        defs.view = v.base;
        logger.dump(defs);
        return source.loadConfigFile(v.name, files, defs).then(c => Variant.create(c));
    }));
}
