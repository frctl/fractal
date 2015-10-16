var _           = require('lodash');

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

Assets.prototype.init = function(){
    var self = this;
    return this;
};