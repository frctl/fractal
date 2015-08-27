var _           = require('lodash');
var minimatch   = require('minimatch');

var Directory   = require('../fs/directory');

module.exports = Docs;

function Docs(dir, config){
    this.config = config;
    this.directory = dir;
};


Docs.fromDirectory = function(directory, config){
    return directory.then(function(dir){
        var docs = new Docs(dir, config);
        docs.init();
        return docs;
    });
};

Docs.prototype.init = function(){
    var self = this;
    this.directory = Directory.filterFiles(this.directory, function(file){
        return minimatch(file.fileInfo.base, self.config.matches);
    });
    return this;
};

Docs.prototype.getTopLevelSets = function(){
    return _.filter(this.directory.children, function(child){
        return child.isDirectory() && child.hasChildren();
    });
};

Docs.prototype.findByUrlPath = function(path){
    return this.directory.findFile('fauxInfo.urlStylePath', path);
};

Docs.prototype.findDirectoryByUrlPath = function(path){
    return this.directory.findDirectory('fauxInfo.urlStylePath', path);
};