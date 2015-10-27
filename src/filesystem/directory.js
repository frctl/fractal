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
    this.finderCache = {
        file: {},
        directory: {},
    };
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
 * Get the child files from the directory (non-recursive).
 *
 * @api public
 */

Directory.prototype.getFiles = function(){
    return _.filter(this.children, 'type', 'file');
};

/*
 * Get the child files from the directory (non-recursive).
 *
 * @api public
 */

Directory.prototype.getDirectories = function(){
    return _.filter(this.children, 'type', 'directory');
};

/*
 * Recursively find an entity in the directory.
 *
 * @api public
 */

Directory.prototype.find = function(type, key, value, maxDepth) {
    var searchId = this.path + key + value;
    var startingDepth = this.depth || 0;
    if (_.isEmpty(this.finderCache[type][searchId])) {
        maxDepth = _.isUndefined(maxDepth) ? 10000 : maxDepth;
        var found = null;
        function checkChildren(children){
            if (found) return found;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.isType(type) && _.get(child, key) === value) {
                    found = child;
                    break;
                } else if (child.isDirectory() && (child.depth - startingDepth) < maxDepth) {
                    checkChildren(child.children);
                }
            };
            return found;
        }
        this.finderCache[type][searchId] = checkChildren(this.children);
    }
    return this.finderCache[type][searchId];
};

/*
 * Recursively find an file in the directory.
 *
 * @api public
 */

Directory.prototype.findFile = function(key, value, maxDepth){
    return this.find('file', key, value, maxDepth);
};

/*
 * Recursively find a directory in the directory.
 *
 * @api public
 */

Directory.prototype.findDirectory = function(key, value, maxDepth){
    return this.find('directory', key, value, maxDepth);
};

/*
 * Get a static, JSON-style object representation of the directory.
 * Good for using with templating languages.
 *
 * @api public
 */

Directory.prototype.toJSON = function(){
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
        // filter out hidden files
        return _.filter(items, function(item){
            return ! (/(^|\/)\.[^\/\.]/g).test(item.absolutePath);
        });
    }).then(function(items){
        // sort files
        return _.sortByOrder(items, ['type','order','path'], ['desc','asc','asc']);
    });
};