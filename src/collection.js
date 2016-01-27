'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const utils   = require('./utils');

module.exports = class Collection {

    constructor(props, items) {
        this.type     = 'collection';
        this._config  = props;
        this.name     = props.name;
        this.order    = props.order;
        this.isHidden = props.isHidden;
        this.items    = items || [];
        this.label    = props.label || utils.titlize(props.name);
        this.title    = props.title || this.label;
    }

    static create(props, items){
        return Promise.resolve(new Collection(props, items));
    }

    toJSON(){
        return utils.toJSON(this);
    }

    find(predicate, opts){
        
    }

    flatten(){

    }

}
