var _           = require('lodash');

var mixin       = require('./mixin');

module.exports = Assets;

function Assets(config, dir){
    this.config = config;
    this.directory = dir;
};

mixin.call(Assets.prototype);