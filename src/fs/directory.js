var promise     = require("bluebird");
var fs          = promise.promisifyAll(require("fs"));
var p           = require('path');
var crypto      = require('crypto');
var _           = require('lodash');

var File        = require('./file');
var mixin       = require('./mixin');

module.exports = Directory;

function Directory(opts, children, root){
    this.type       = 'directory';
    this.isRoot     = !! root;
    this.path       = opts.path;
    this.relativeTo = opts.relativeTo;
    this.relPath    = opts.relPath;
    this.stat       = opts.stat;
    this.children   = children;
    this.finderCache = {
        file: {},
        directory: {},
    };
};

mixin.call(Directory.prototype);

Directory.fromPath = function(path, relativeTo, root){
    relativeTo = relativeTo || path;
    var stat = fs.statAsync(path);    
    var children = fetchChildren(path, relativeTo);
    return promise.join(stat, children, function(stat, children) {
        return new Directory({
            path:       p.resolve(path),
            relPath:    _.trimLeft(path.replace(new RegExp('^(' + relativeTo + ')'),""),['/']),
            stat:       stat,
            relativeTo: relativeTo,
        }, _.sortByOrder(children, ['type','order','path'], ['desc','asc','asc']), root).init();
    });
};

Directory.filterFiles = function(directory, callback){
    function filter(dir, callback){
        var filtered = [];
        dir.children.forEach(function(item){
            if (item.isFile() && callback(item)) {
                filtered.push(item);
            } else if (item.isDirectory()) {
                var d = Directory.filterFiles(item, callback);
                if (d.hasChildren()){
                    filtered.push(d);
                }
            }
        });
        dir.children = filtered;
    }
    filter(directory, callback);
    return directory;
};

Directory.removeEmptyDirectories = function(directory){
    function filter(dir){
        var filtered = [];
        dir.children.forEach(function(item){
            if (item.isFile()) {
                filtered.push(item);
            } else if (item.isDirectory() && item.hasChildren()) {
                filtered.push(Directory.removeEmptyDirectories(item));
            }
        });
        dir.children = filtered;
    }
    filter(directory);
    return directory;
};

Directory.prototype.hasChildren = function(){
    return !! this.children.length;
};

Directory.prototype.find = function(type, key, value, maxDepth) {
    var searchId = this.path + key + value;
    if (_.isEmpty(this.finderCache[type][searchId])) {
        var currentDepth = 0;
        maxDepth = maxDepth || 10000000;
        var found = null;
        function checkChildren(children){
            if (found) return found;
            for (var i = 0; i < children.length; i++) {
                var child = children[i];
                if (child.isType(type) && _.get(child, key) === value) {
                    found = child;
                    break;
                } else if (child.isDirectory() && currentDepth < maxDepth) {
                    currentDepth++;
                    checkChildren(child.children);
                }
            };
            return found;
        }
        this.finderCache[type][searchId] = checkChildren(this.children);
    }
    return this.finderCache[type][searchId];
};

Directory.prototype.findFile = function(key, value, maxDepth){
    return this.find('file', key, value, maxDepth);
};

Directory.prototype.findDirectory = function(key, value, maxDepth){
    return this.find('directory', key, value, maxDepth);
};

Directory.prototype.toJSON = function(){
    // TODO: do any conversion here?
    return this;
};

Directory.prototype.toString = function(){
    return this.toJSON();
};

function fetchChildren(path, relativeTo){
    return fs.readdirAsync(path).map(function(child){
        var childPath = p.join(path, child);
        return fs.statAsync(childPath).then(function(childStat){
            if (childStat.isDirectory()) {
                return Directory.fromPath(childPath, relativeTo);
            } else {
                return File.fromPath(childPath, relativeTo);
            }
        });
    });
}