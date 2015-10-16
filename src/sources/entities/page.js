/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var mixin       = require('./entity');

/*
 * Export the page.
 */

module.exports = Page;

/*
 * Group constructor.
 *
 * @api private
 */

function Page(){
    this.type = 'page';
};

mixin.call(Page.prototype);

