var promise     = require("bluebird");
var fs          = promise.promisifyAll(require("fs"));
var p           = require('path');
var crypto      = require('crypto');
var _           = require('lodash');

var File        = require('./file');
var mixin       = require('./mixin');

module.exports = Directory;

function Directory(opts, children){
    this.type       = 'directory';
    this.path       = opts.path;
    this.relPath    = opts.relPath;
    this.stat       = opts.stat;
    this.children   = children;
    this.init();
};

mixin.call(Directory.prototype);

Directory.fromPath = function(path, relativeTo){
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
        }, _.sortByAll(children, ['order','path']));
    });
};

Directory.prototype.findFileBy = function(key, value){
    console.log('FINDING FILE');
    return null;
};

Directory.prototype.toJSON = function(){
    // TODO: do any conversion here?
    return this;
};

Directory.prototype.toString = function(){
    return this.toJSON();
};