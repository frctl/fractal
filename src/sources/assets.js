var _           = require('lodash');

var mixin       = require('./mixin');

module.exports = Assets;

function Assets(dir, config){
    this.config = config;
    this.directory = dir;
};

Assets.fromDirectory = function(directory, config){
    return directory.then(function(dir){
        return new Assets(dir, config);
    });
};

// mixin.call(Assets.prototype);

Assets.prototype.init = function(){
    var self = this;
    return this;
};