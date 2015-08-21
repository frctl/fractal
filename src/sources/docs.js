var _           = require('lodash');
var minimatch   = require('minimatch');

var Directory   = require('../fs/directory');
var mixin       = require('./mixin');

module.exports = Docs;

function Docs(config, dir){
    this.config = config;
    this.directory = dir;
};

mixin.call(Docs.prototype);

Docs.prototype.init = function(){

    var self = this;
    
    this.directory = Directory.filterFiles(this.directory, function(file){
        return minimatch(file.fileInfo.base, self.config.matches);
    });

};