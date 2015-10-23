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

function Group(dir, children){
    this.type       = 'group';
    this._dir       = dir;
    this.children   = children;
    this.handle     = dir.name;
    this.label      = utils.titlize(dir.name);
    this.title      = this.label;
    this.order      = dir.order;
    this.depth      = dir.depth;
};

mixin.call(Group.prototype);

/*
 * Get a static, JSON-style object representation of the group.
 * Good for using with templating languages.
 *
 * @api public
 */

Group.prototype.toJSON = function(){
    var obj = {};
    _.forOwn(this, function(value, key){
        if (!_.startsWith(key, '_')) {
            obj[key] = value;
        }
    });
    _.map(obj.children, function(item){
        return item.toJSON();
    });
    return obj;
};

