'use strict';

const _    = require('lodash');
const mix  = require('mixwith').mix;

class Base {

    constructor(){
        this._mixedIn = [];
    }

    hasMixedIn(name) {
        return _.includes(this._mixedIn, name);
    }

    addMixedIn(name) {
        this._mixedIn.push(name);
        this._mixedIn = _.uniq(this._mixedIn);
    }

}

module.exports = function(){

    return mix(Base).with(...arguments);

};
