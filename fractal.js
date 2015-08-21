var promise         = require("bluebird");
var merge           = require('deepmerge');
var _               = require('lodash');
var p               = require('path');
var chokidar        = require('chokidar');

var SourceFactory   = require('./src/sources/factory');
var config          = require('./src/config');

var sources         = {};
var monitors        = {};

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

        _.each(config.get('source'), function(conf, key){
            sources[key] = null;
            monitors[key] = chokidar.watch(p.resolve(conf.dir), {ignored: /[\/\\]\./});
            monitors[key].on('ready', function(){
                monitors[key].on('all', function(event, path) {
                    sources[key] = null;
                });
            });
        });

        return getService(process.argv[2]);
    },

    getSources: function(){
        return promise.props(_.mapValues(config.get('source'), function(conf, key){
            if (!sources[key]) {
                sources[key] = SourceFactory.getSource(key, conf);
            }
            return sources[key];
        }));
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
    var dir = p.parse(require.resolve(themeName)).dir;
    var themeJSON = require(themeName);
    return {
        views: p.join(dir, themeJSON.views),
        assets: p.join(dir, themeJSON.assets),
    };
}