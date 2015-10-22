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
 * Resolve a component name or path and return the component.
 *
 * @api public
 */

ComponentSource.prototype.resolve = function(str){

    return null;
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