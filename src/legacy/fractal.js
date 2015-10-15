var promise         = require("bluebird");
var merge           = require('deepmerge');
var fs              = require('fs');
var _               = require('lodash');
var p               = require('path');
var chokidar        = require('chokidar');

var SourceFactory   = require('./src/sources/factory');
var config          = require('./src/config');
var vc              = require('./src/vc');

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
        this.startMonitor();
        return getService(process.argv[2]);
    },

    getSources: function(){
        var src = _.mapValues(config.pick('components', 'docs'), function(conf, key){
            if (!sources[key] && dirExists(conf.dir)) {
                sources[key] = SourceFactory.getSource(key, conf);
            }
            return sources[key];
        });
        src['assets'] = promise.resolve(false);
        
        // TODO: add in assets source here
        return promise.props(src);
    },
    
    getConfig: function(){
        return config;
    },

    startMonitor: function(){
        var dirs = _.map(config.pick('components', 'docs'), function(conf, key){
            var path = dirExists(conf.dir);
            if (path) {
                sources[key] = null;
                monitors[key] = chokidar.watch(path, {ignored: /[\/\\]\./});
                monitors[key].on('ready', function(){
                    monitors[key].on('all', function(event, path) {
                        sources[key] = null;
                    });
                });
            }
        });
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

function dirExists(path){
    if ( path ) {
        try {
            var path = p.resolve(path).toString();
            var stats = fs.lstatSync(path);
            if (stats.isDirectory()) {
                return path;
            }
        } catch (e) {}
    }
    return false;
}