/**
 * Module dependencies.
 */

var _           = require('lodash');

var Directory   = require('../filesystem/directory');
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
        ComponentSource.buildComponentTree(dir, config).then(function(tree){
            return new ComponentSource(tree).init();    
        });
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

    var markupFiles = _.filter(files, function(file){
        return file.matches(config.markup.matches);
    });

    
    // for (var i = markupFiles.length - 1; i >= 0; i--) {
    //     var file = markupFiles[i];
    //     if (!dir.isRoot) {
    //         if (file.fauxInfo.name === dir.fauxInfo.name) {
    //             // matches parent directory name so this whole directory is a component
    //             var item = Component.fromDirectory(dir);
    //             if (item) {
    //                 return item;    
    //             }
    //             continue;
    //         }
    //     }
    //     var item = Component.fromFile(file);
    //     if (item) {
    //         ret.push(item);    
    //     }
    // };

    // for (var i = directories.length - 1; i >= 0; i--) {
    //     var directory = directories[i];
    //     if ( directory.hasChildren()) {
    //         var children = getComponents(directory);
    //         if (!_.isArray(children)) {
    //             ret.push(children);
    //         } else {
    //             ret.push({
    //                 name: directory.fauxInfo.name,
    //                 title: directory.getTitle(),
    //                 order: directory.order,
    //                 depth: directory.depth,
    //                 id: directory.getId(),
    //                 isDirectory: true,
    //                 type: 'directory',
    //                 children: children
    //             });
    //         }
    //     }
    // };

    // return _.isArray(ret) ? _.sortByOrder(ret, ['type','order','title'], ['desc','asc','asc']) : ret;
};