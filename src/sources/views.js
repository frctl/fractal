var _           = require('lodash');
var minimatch   = require('minimatch');

var Directory   = require('../fs/directory');
var mixin       = require('./mixin');

module.exports = Views;

function Views(config, dir){
    this.config = config;
    this.directory = dir;
    this.views = null;
};

mixin.call(Views.prototype);

Views.prototype.init = function(){
    var self = this;
};

Views.prototype.getViews = function(){
    if (!this.views) {
        var self = this;
        this.views = Directory.filterFiles(this.directory, function(file){
            return minimatch(file.fileInfo.base, self.config.matches);
        });
    }
    return this.views;
};