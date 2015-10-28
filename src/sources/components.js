/**
 * Module dependencies.
 */

var _           = require('lodash');
var logger      = require('winston');

var Directory   = require('../filesystem/directory');
var Component   = require('./entities/component');
var Group       = require('./entities/group');
var mixin       = require('./source');

/*
 * Export the component source.
 */

module.exports = ComponentSource;

/*
 * ComponentSource constructor.
 *
 * @api private
 */

function ComponentSource(components, app){
    this.components = components;
    this.app = app;
};

mixin.call(ComponentSource.prototype);

/*
 * Resolve a component by handle or path and return the component.
 * If a the handle specified a variant then that will be returned in place of the component.
 *
 * @api public
 */

ComponentSource.prototype.resolve = function(str){
    if (_.startsWith(str, '@')) {
        return this.findByHandle(str);
    } else {
        return this.findByPath(str);
    }
};

/*
 * Find a component by it's path.
 * If a the path specifies a variant then that will be returned in place of the component.
 * Throws an error if the component/variant is not found.
 *
 * Path format: my/component/path::optional-variant-handle
 * 
 * @api public
 */

ComponentSource.prototype.findByPath = function(componentPath){
    var pathParts = componentPath.split('::', 2);
    var component = this.findByKey('path', pathParts[0]);
    return (pathParts.length === 2) ? component.getVariant(pathParts[1]) : component;
};

/*
 * Find a component by it's handle.
 * If a the handle specifies a variant then that will be returned in place of the component.
 * Throws an error if the component/variant is not found.
 *
 * Handle format: @component-handle::optional-variant-handle
 *
 * @api public
 */

ComponentSource.prototype.findByHandle = function(handle){
    handle = handle.replace(/^@/, '');
    var handleParts = handle.split('::', 2);
    var component = this.findByKey('handle', handleParts[0]);
    return (handleParts.length === 2) ? component.getVariant(handleParts[1]) : component;
};

/*
 * Find a component by a key.
 * Throws an error if the component is not found.
 *
 * @api public
 */

ComponentSource.prototype.findByKey = function(key, value) {
    var found = null;
    function checkChildren(children){
        if (found) return found;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.type === 'component' && _.get(child, key) === value) {
                found = child;
                break;
            } else if (child.type == 'group') {
                checkChildren(child.children);
            }
        };
        return found;
    }
    var result = checkChildren(this.components);
    if (!result) {
        throw new Error('The component ' + key + ':' + value + ' could not be found.');
    }
    return result;
};

/*
 * Returns a flattened array of all components in the system
 *
 * @api public
 */

ComponentSource.prototype.flatten = function(){
    function list(items) {
        return _.map(items, function(item){
            return item.type === 'group' ? list(item.children) : item;
        });
    }
    return new ComponentSource(_.flatten(list(this.components)), this.app);
};

/*
 * Returns a new component tree filtered by key:value
 *
 * @api public
 */

ComponentSource.prototype.filter = function(key, value){
    function filter(items){
        var ret = [];
        _.each(items, function(item){
            if (item.type === 'component') {
                if (item[key] === value) {
                    ret.push(item);
                }
            } else {
                var children = filter(item.children);
                if (children.length) {
                    ret.push(new Group(item._dir, children));
                }
            }
        }); 
        return _.compact(ret);
    }
    return new ComponentSource(filter(this.components), this.app);
};

/*
 * Returns a JSON representation of all the components
 *
 * @api public
 */

ComponentSource.prototype.toJSON = function(){
    return _.map(this.components, function(entity){
        return entity.toJSON();
    });
};

/*
 * Get a JSON-formatted string representation of the components.
 *
 * @api public
 */
    
ComponentSource.prototype.toString = function(){
    return JSON.stringify(this.toJSON(), null, 4);
};

/*
 * Return a new ComponentSource instance from a directory path.
 *
 * @api public
 */

ComponentSource.build = function(app){
    return Directory.fromPath(app.get('components').path).then(function(dir){
        var tree = ComponentSource.buildComponentTree(dir, app);
        return new ComponentSource(tree, app).init();
    });
};

/*
 * Takes a directory and recursively converts it into a tree of components
 *
 * @api public
 */

ComponentSource.buildComponentTree = function(dir, app){

    var config          = app.get('components');
    var ret             = [];
    var files           = dir.getFiles();
    var directories     = dir.getDirectories();

    // If there are files in there, it's a component!
    if (files.length) {
        try {
            return new Component(dir, app);    
        } catch(e){
            logger.warn('Component could not be created from directory ' + dir.path + ': ' + e.message);
            return null;
        }
    }

    // Otherwise recurse through any directories...
    for (var i = directories.length - 1; i >= 0; i--) {
        var directory = directories[i];
        if (directory.hasChildren()) {
            var subtree = ComponentSource.buildComponentTree(directory, app);
            if (!_.isArray(subtree)) {
                ret.push(subtree);
            } else {
                ret.push(new Group(directory, subtree));
            }
        }
    }

    ret = _.compact(ret);
    return _.isArray(ret) ? _.sortByOrder(ret, ['type','order','title'], ['desc','asc','asc']) : ret;
};