/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');

var mixin       = require('./entity');
var utils       = require('../utils');
var data        = require('../data');
var app         = require('../application');

/*
 * Export the group.
 */

module.exports = Group;

/*
 * Group constructor.
 *
 * @api private
 */

function Group(dir, config, children){
    this.type       = 'group';
    this._dir       = dir;
    this._config    = config;
    this.handle     = dir.name || config.handle;
    this.label      = config.label || utils.titlize(this.handle);
    this.title      = config.title || this.label;
    this.order      = dir.order || config.order || null;
    this.depth      = dir.depth || config.depth || null;
    this.children   = children;
    this.path       = utils.fauxPath(dir.path);
};

mixin.call(Group.prototype);

/*
 * Return the immediate child subgroups, if there are any.
 *
 * @api public
 */

Group.prototype.getSubGroups = function(){
    return _.filter(this.children, function(child){
        return child.type === 'group';
    });
};

/*
 * Return the immediate child sub entities (i.e. not groups), if there are any.
 *
 * @api public
 */

Group.prototype.getSubEntities = function(toJSON){
    var subEntities = _.filter(this.children, function(child){
        return child.type !== 'group';
    });
    return toJSON ? _.map(subEntities, function(item){
        return item.toJSON();
    }) : subEntities;
};

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

/*
 * Factory method to create a new group instance from a directory.
 * Returns a promise.
 *
 * @api public
 */

Group.fromDirectory = function(dir, children){
    var configFile = _.find(dir.getFiles(), function(entity){
        return entity.matches(app.get('components.config'), {
            name: dir.name
        });
    });
    var groupConfig = configFile ? data.load(configFile.absolutePath) : Promise.resolve({});
    return groupConfig.then(function(groupConfig){
        return new Group(dir, groupConfig, children);
    });
};


Group.fromConfig = function(config, children){
    return new Group({}, config, children);
};
