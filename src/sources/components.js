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
    var files           = _.filter(dir.children, 'type', 'file');
    var primaryMatcher  = _.find(config.files, 'primary', true).matches;

    var primaryFiles = _.filter(files, function(file){
        return file.matches(primaryMatcher);
    });
    
    for (var i = primaryFiles.length - 1; i >= 0; i--) {
        var file = primaryFiles[i];
        if (!dir.isRoot && file.name === dir.name) {
            // matches parent directory name so this whole directory is a component
            var entity = Component.createFromDirectory(dir, config);
            if (entity) {
                return entity;    
            }
            continue;
        }
        var entity = Component.createFromFile(file, config);
        if (entity) {
            ret.push(entity);    
        }
    };

    for (var i = directories.length - 1; i >= 0; i--) {
        var directory = directories[i];
        if ( directory.hasChildren()) {
            var children = ComponentSource.buildComponentTree(directory, config);
            if (!_.isArray(children)) {
                ret.push(children);
            } else {
                ret.push(new Group(directory, children));
                // ret.push({
                //     name: directory.fauxInfo.name,
                //     title: directory.getTitle(),
                //     order: directory.order,
                //     depth: directory.depth,
                //     id: directory.getId(),
                //     isDirectory: true,
                //     type: 'directory',
                //     children: children
                // });
            }
        }
    };

    return ret;
    // return _.isArray(ret) ? _.sortByOrder(ret, ['type','order','title'], ['desc','asc','asc']) : ret;
};