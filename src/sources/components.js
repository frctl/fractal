var _           = require('lodash');
var minimatch   = require('minimatch');

var Directory   = require('../fs/directory');
var mixin       = require('./mixin');

module.exports = Components;

function Components(config, dir){
    this.config = config;
    this.directory = dir;
    this.components = null;
};

mixin.call(Components.prototype);

Components.prototype.init = function(){
    var self = this;
};

Components.prototype.getComponents = function(){
    if (!this.components) {
        var self = this;
        this.components = Directory.filterFiles(this.directory, function(file){
            return minimatch(file.fileInfo.base, self.config.matches);
        });
    }
    return this.components;
};