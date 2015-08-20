var promise     = require("bluebird");
var fs          = promise.promisifyAll(require("fs"));
var p           = require('path');
var crypto      = require('crypto');
var _           = require('lodash');

var mixin       = require('./mixin');
// var config  = require('./config');
// var parsers = _.sortBy(config.get('parsers'), 'priority');
// var parserObjs = {};

module.exports = File;

function File(opts){
    var content;

    this.type       = 'file';
    this.path       = opts.path;
    this.relPath    = opts.relPath;
    this.stat       = opts.stat;
    this.content    = this.raw = opts.content;
    this.meta       = {};
    this.previewData = {};
};

mixin.call(File.prototype);

File.fromPath = function(path, relativeTo){
    var stat = fs.statAsync(path);    
    var content = fs.readFileAsync(path);
    return promise.join(stat, content, function(stat, content) {
        return new File({
            path:       p.resolve(path),
            relPath:    _.trimLeft(path.replace(new RegExp('^(' + relativeTo + ')'),""),['/']),
            stat:       stat,
            content:    content,
        }).init();
    });
};

File.prototype.toJSON = function(){
    var clone = _.clone(this);
    clone.content = clone.content.toString();
    clone.raw = clone.raw.toString();
    return clone;
};

File.prototype.toString = function(){
    return this.toJSON();
};