'use strict';

const Promise = require('bluebird');
const _       = require('lodash');
const utils   = require('../utils');
const config  = require('../config');

module.exports = class Variant {

    constructor(props) {
        this.type     = 'variant';
    }

    static create(props){

        return Promise.resolve(new Variant(props));
    }

    toJSON(){
        return utils.toJSON(this);
    }
}
