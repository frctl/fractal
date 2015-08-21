var promise = require("bluebird");
var merge   = require('deepmerge');
var _       = require('lodash');
var path    = require('path');

var Source  = require('./src/source');
var config  = require('./src/config');

var sources = null;

module.exports = {

    set: function(){
        if (arguments.length === 1) {
            config.merge(arguments[0]);
        } else if (arguments.length === 2) {
            config.set(arguments[0], arguments[1]);
        } else {
            throw 'Invalid configuration';
        }
    },

    run: function(){
        var theme = config.get('theme');
        config.set('root', process.cwd());
        config.set('theme', merge(theme, getThemeConfig(theme.name)));
        return getService(process.argv[2]);
    },

    getSources: function(){
        if (!sources) {
            sources = promise.props(_.mapValues(config.get('source'), function(conf){
                return Source.fromConfig(conf);
            }));
        }
        return sources;
    },

    getConfig: function(){
        return config;
    }

};

function getService(serviceName){
    var service = (typeof serviceName === 'undefined' || serviceName == 'server') ? 'server' : 'export';
    return require('./src/services/' +  service)();
}

function getThemeConfig(themeName){
    var dir = path.parse(require.resolve(themeName)).dir;
    var themeJSON = require(themeName);
    return {
        views: path.join(dir, themeJSON.views),
        assets: path.join(dir, themeJSON.assets),
    };
}