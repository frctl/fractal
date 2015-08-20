var promise = require("bluebird");
var merge   = require('deepmerge');
var _       = require('lodash');
var path    = require('path');

// var Source  = require('./src/source');
var Directory  = require('./src/fs/directory');
var config  = require('./src/config');

var structure = null;

module.exports = {

    configure: function(userConfig){
        config.merge(userConfig);
    },

    run: function(){
        config.set('root', process.cwd());
        return getService(process.argv[2]);
    },

    getStructure: function(){
        if (!structure) {
            structure = promise.props({
                pages:      config.get('pages') ? Directory.fromPath(config.get('pages').dir, null, true) : null,
                views:      config.get('views') ? Directory.fromPath(config.get('views').dir, null, true) : null,
                assets:     config.get('assets') ? Directory.fromPath(config.get('assets').dir, null, true) : null,
                components: config.get('components') ? Directory.fromPath(config.get('components').dir, null, true) : null,
            });
        }
        return structure;
    },

    getConfig: function(){
        return config;
    }

};

function getService(serviceName){
    var service = (typeof serviceName === 'undefined' || serviceName == 'server') ? 'server' : 'export';
    return require('./src/services/' +  service)();
}