/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var path        = require('path');
var _           = require('lodash');
var fs          = Promise.promisifyAll(require('fs'));

var File        = require('./file');
var mixin       = require('./entity');

/*
 * Export the directory.
 */

module.exports = Directory;

/*
 * Directory constructor.
 *
 * @api private
 */

function Directory(directoryPath, children, meta){
    this.type = 'directory';
    this.absolutePath = directoryPath;
    this.children = children;
    this.stat = meta.stat;
    this.path = meta.relativePath;
    this.isRoot = this.path === '';
};

mixin.call(Directory.prototype);

/*
 * Check whether the directory contains files or subdirectories.
 *
 * @api public
 */

Directory.prototype.hasChildren = function(){
    return !! this.children.length;
};

/*
 * Return a new Directory instance from a path.
 *
 * @api public
 */

Directory.fromPath = function(directoryPath, relativeTo){
    directoryPath = path.resolve(directoryPath);
    relativeTo = relativeTo || directoryPath;
    var stat = fs.statAsync(directoryPath);
    var children = Directory.fetchChildren(directoryPath, relativeTo);
    return Promise.join(stat, children, function(stat, children) {
        return new Directory(directoryPath, children, {
            stat: stat,
            relativePath: path.relative(relativeTo, directoryPath),
        }).init();
    });
};

/*
 * Asynchronously generate a directory tree
 *
 * @api private
 */

Directory.fetchChildren = function(directoryPath, relativeTo){
    return fs.readdirAsync(directoryPath).map(function(child){
        var childPath = path.join(directoryPath, child);
        return fs.statAsync(childPath).then(function(childStat){
            if (childStat.isDirectory()) {
                return Directory.fromPath(childPath, relativeTo);
            } else {
                return File.fromPath(childPath, relativeTo);
            }
        });
    }).then(function(items){
        return items;
        // return _.sortByOrder(items, ['type','order','path'], ['desc','asc','asc'])
    });
};