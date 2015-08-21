var promise     = require("bluebird");
var fs          = promise.promisifyAll(require("fs"));
var _           = require('lodash');

var Directory  = require('./fs/directory');

module.exports = Source;

function Source(config, dir){
    this.config = config;
    this.dir = dir;
};

Source.fromConfig = function(config){
    if (config) {
        return Directory.fromPath(config.dir, null, true).then(function(dir){
            return new Source(config, dir);
        });
    }
    return null;
};

Source.prototype.getFiles = function(){
    return this.dir.children;
};

Source.prototype.findFile = function(key, value, maxDepth){
    return this.dir.findFile(key, value, maxDepth);
};

Source.prototype.findDirectory = function(key, value, maxDepth){
    return this.dir.findDirectory(key, value, maxDepth);
};