/**
 * Module dependencies.
 */

var Directory = require('../filesystem/directory');

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

/*
 * Return a new ComponentSource instance from a directory path.
 *
 * @api public
 */

ComponentSource.fromPath = function(path){
    return Directory.fromPath(path).then(function(dir){
        var componentTree = ComponentSource.buildComponentTreeFromDirectory(dir);
        return new ComponentSource(componentTree);
    });
};


ComponentSource.prototype.find = function(){
    
};

ComponentSource.prototype.fuzzyFind = function(){
    
};

/*
 * Takes a directory and converts it into a components
 *
 * @api public
 */

ComponentSource.buildComponentTreeFromDirectory = function(dir){
    return dir;
};