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
        this.handle   = `${props.handle || this.name.split(config.get('components.splitter'))[1]}`;
        this.ref      = `@${props.parent.handle}${config.get('components.splitter')}${this.handle}`;
        this.status   = props.status;
        this.order    = props.order;
        this.view     = props.view;
        this.preview  = props.preview;
        this.display  = props.display;
        this._parent  = props.parent;
        this._context = props.context;
        this._config  = props;
    }

    get context(){
        return this._context;
    }

    get parent(){
        return this._parent;
    }

    get siblings(){
        return this._parent.variants;
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
        return data.getConfig(configFile, props).then(c => Variant.create(c));
    }
};
