var _           = require('lodash');

var mixin       = require('./mixin');

module.exports = Views;

function Views(config, dir){
    this.config = config;
    this.directory = dir;
};

mixin.call(Views.prototype);