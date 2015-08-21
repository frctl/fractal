var _           = require('lodash');

var mixin       = require('./mixin');

module.exports = Components;

function Components(config, dir){
    this.config = config;
    this.directory = dir;
};

mixin.call(Components.prototype);