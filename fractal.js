var merge   = require('deepmerge');
var _       = require('lodash');
var path    = require('path');

var Source  = require('./src/source');
var config  = require('./src/config');

var sources = {};

module.exports = {

    configure: function(userConfig){
        config.merge(userConfig);
    },

    run: function(){
        config.set('root', process.cwd());
        return getService(process.argv[2]);
    },

    getAssets: function(){
        return getSource('assets');
    },

    getComponents: function(){
        return getSource('components');
    },

    getViews: function(){
        return getSource('views');
    },

    getPages: function(){
        return getSource('pages');
    },

    getConfig: function(){
        return config;
    }

};

function getSource(key){
    if (_.isUndefined(sources[key])) {
        sources[key] = new Source(config.get(key));
    }
    return sources[key].build();
}

function getService(serviceName){
    var service = (typeof serviceName === 'undefined' || serviceName == 'server') ? 'server' : 'export';
    return require('./src/services/' +  service)();
}
