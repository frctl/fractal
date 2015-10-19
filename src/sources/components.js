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

function ComponentSource(components){
    this.components = components;
};

mixin.call(ComponentSource.prototype);

/*
 * Return a new ComponentSource instance from a directory path.
 *
 * @api public
 */

ComponentSource.build = function(config){
    return Directory.fromPath(config.path).then(function(dir){
        var tree = ComponentSource.buildComponentTree(dir, config);
        return new ComponentSource(tree).init();
    });
};

/*
 * Takes a directory and recursively converts it into a tree of components
 *
 * @api public
 */

ComponentSource.buildComponentTree = function(dir, config){

    var ret             = [];
    var directories     = _.filter(dir.children, 'type', 'directory');
    var preview         = config.files['preview'] || null;

    if (!preview) {
        throw new Error('No preview file definition found');
    }

    if (!dir.isRoot) {
        var previewFile = null;
        for (var i = 0; i < dir.children.length; i++) {
            var entity = dir.children[i];
            if (entity.isFile() && entity.matches(preview.matches, {
                name: dir.name
            })) {
                previewFile = entity;
                break;
            }
        };
        if (previewFile) {
            var entity = Component.createFromDirectory(dir, config);
            if (entity) {
                return entity;
            }
        }
    }

    for (var i = directories.length - 1; i >= 0; i--) {
        var directory = directories[i];
        if ( directory.hasChildren()) {
            var children = ComponentSource.buildComponentTree(directory, config);
            if (!_.isArray(children)) {
                ret.push(children);
            } else {
                ret.push(new Group(directory, children));
            }
        }
    };

    return _.isArray(ret) ? _.sortByOrder(ret, ['type','order','title'], ['desc','asc','asc']) : ret;
};