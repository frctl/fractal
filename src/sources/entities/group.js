/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var mixin       = require('./entity');
var utils       = require('../../utils');

/*
 * Export the group.
 */

module.exports = Group;

/*
 * Group constructor.
 *
 * @api private
 */

function Group(source, children){
    this.type = 'group';
    this.source = source;
    this.children = children;
    this.name = source.name;
    this.title = utils.titlize(source.name);
    this.order = source.order;
    this.depth = source.depth;
};

mixin.call(Group.prototype);