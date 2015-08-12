var util = require('util');
var crypto = require('crypto');

var File  = require('./file');

module.exports = Component;

function Component(rootPath, relDir){
    if (!(this instanceof Component)) return new Component(rootPath);
    File.call(this, rootPath, relDir);
};

util.inherits(Component, File);

Component.prototype.parse = function(){
    var self = this;
    return Component.super_.prototype.parse.call(this).then(function(instance){

        self.uuid = generateUUID(self.rootPath);
        self.id = self.meta.id || self.uuid;

        return self;
    });
};

function generateUUID(path){
    var shasum = crypto.createHash('sha1')
    shasum.update(path);
    return shasum.digest('hex').slice(0, 6); 
}