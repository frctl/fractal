'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const utils   = require('../utils');
const config  = require('../config');

module.exports = class Variant {

    constructor(props) {
        this._config  = props;
        this.type     = 'variant';
        this.name     = props._name;
        this.handle   = `${props.parent.handle}${config.get('components.splitter')}${props.handle || this.name.split(config.get('components.splitter'))[1]}`;
        this.atHandle = `@${this.handle}`;
        this.status   = props.status;
        this.order    = props.order;
        this.view     = props.view;
        this.preview  = props.preview;
        this.context  = props.context;
        this.display  = props.display;
        this._parent  = props.parent;
    }

    static create(props){
        return Promise.resolve(new Variant(props));
    }

    toJSON(){
        return utils.toJSON(this);
    }
}
