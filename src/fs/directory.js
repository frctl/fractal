var promise     = require("bluebird");
var fs          = promise.promisifyAll(require("fs"));
var p           = require('path');
var crypto      = require('crypto');
var _           = require('lodash');

var File        = require('./file');
var mixin       = require('./mixin');

var finderCache = {
    file: {},
    directory: {},
};

module.exports = Directory;

function Directory(opts, children, root){
    this.type       = 'directory';
    this.isRoot     = !! root;
    this.path       = opts.path;
    this.relPath    = opts.relPath;
    this.stat       = opts.stat;
    this.children   = children;
};

mixin.call(Directory.prototype);

Directory.fromPath = function(path, relativeTo, root){
    relativeTo = relativeTo || path;
    var stat = fs.statAsync(path);    
    var children = fs.readdirAsync(path).map(function(child){
        var childPath = p.join(path, child);
        return fs.statAsync(childPath).then(function(childStat){
            if (childStat.isDirectory()) {
                return Directory.fromPath(childPath, relativeTo);
            } else {
                return File.fromPath(childPath, relativeTo);
            }
        });
    });
    return promise.join(stat, children, function(stat, children) {
        return new Directory({
            path:       p.resolve(path),
            relPath:    _.trimLeft(path.replace(new RegExp('^(' + relativeTo + ')'),""),['/']),
            stat:       stat,
        }, _.sortByOrder(children, ['type','order','path'], ['desc','asc','asc']), root).init();
    });
};

Directory.prototype.findFile = function(key, value, maxDepth){
    return this.find('file', key, value, maxDepth);
};

Directory.prototype.findDirectory = function(key, value, maxDepth){
    return this.find('directory', key, value, maxDepth);
};

Directory.prototype.hasChildren = function(){
    return !! this.children.length;
};

Directory.prototype.toJSON = function(){
    // TODO: do any conversion here?
    return this;
};

Directory.prototype.toString = function(){
    return this.toJSON();
};

Directory.prototype.find = function(type, key, value, maxDepth) {
    var searchId = key + value;
    if (_.isEmpty(finderCache[type][searchId])) {
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
        finderCache[type][searchId] = checkChildren(this.children);
    }
    return finderCache[type][searchId];
}