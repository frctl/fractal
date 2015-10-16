/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var mixin       = require('./entity');

/*
 * Export the component.
 */

module.exports = Component;

/*
 * Group constructor.
 *
 * @api private
 */

function Component(source){
    this.type = 'component';
    this.source = source;
    this.files = {};
    

    // if (this.source.isFile()) {

    // } else {

    // }
};

mixin.call(Component.prototype);

