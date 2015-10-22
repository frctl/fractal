/**
 * Module dependencies.
 */

var _           = require('lodash');

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
 * Throws an error if the component/variant is not found.
 *
 * @api public
 */

ComponentSource.prototype.findByPath = function(componentPath){
    return this.findByKey('path', componentPath);
};

/*
 * Find a component by it's handle.
 * If a the handle specified a variant then that will be returned in place of the component.
 * Throws an error if the component/variant is not found.
 *
 * Handle format: @component-handle::optional-variant-handle
 *
 * @api public
 */

ComponentSource.prototype.findByHandle = function(handle){
    handle = handle.replace(/^@/, '');
    handleParts = handle.split('::', 2);
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

ComponentSource.prototype.all = function(){
    function list(items) {
        return _.map(items, function(item){
            return item.type === 'group' ? list(item.children) : item;
        });
    }
    return _.flatten(list(this.components));
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
        return new Component(dir, app).init();
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
    };

    ret = _.compact(ret);
    return _.isArray(ret) ? _.sortByOrder(ret, ['type','order','title'], ['desc','asc','asc']) : ret;
};