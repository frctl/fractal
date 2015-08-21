var _           = require('lodash');

var mixin       = require('./mixin');

module.exports = Docs;

function Docs(config, dir){
    this.config = config;
    this.directory = dir;
};

mixin.call(Docs.prototype);

