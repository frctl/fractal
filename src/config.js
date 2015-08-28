var merge       = require('deepmerge');
var path        = require('path');
var _           = require('lodash');

var config =  require('../config.json');

module.exports = {

    all: function(){
        return config;
    },

    get: function(key, fallback){
        return _.get(config, key) || fallback || null;
    },

    set: function(key, val){
        _.set(config, key, val);
    },

    merge: function(toMerge){
        config = merge(config, toMerge);
    },

    pick: function(){
        var args = Array.prototype.slice.call(arguments);
        args.unshift(config);
        return _.pick.apply(_, args);
    }

};
