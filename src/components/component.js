'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const logger  = require('../logger');
const utils   = require('../utils');
const config  = require('../config');

module.exports = class Component {

    constructor(props, related) {
        this.type     = 'component';
        this._config  = props;
        this._related = related;
        this.name     = props.name;
        this.order    = props.order;
        this.isHidden = props.isHidden;
        this.label    = props.label || utils.titlize(props.name);
        this.title    = props.title || this.label;
    }

    static create(props, related){
        return Promise.resolve(new Component(props, related));
    }

    toJSON(){
        return utils.toJSON(this);
    }
}
