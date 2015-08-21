var _           = require('lodash');
var minimatch   = require('minimatch');

var Directory   = require('../fs/directory');

// Mixin for Source objects
module.exports = function(){
    
    

    this.getFiles = function(){
        return this.directory.children;
    };

    this.findFile = function(key, value, maxDepth){
        return this.directory.findFile(key, value, maxDepth);
    };

    this.findDirectory = function(key, value, maxDepth){
        return this.directory.findDirectory(key, value, maxDepth);
    };

    return this;
};
