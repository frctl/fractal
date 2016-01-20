'use strict';

const path         = require('path');
const logger       = require('winston');
const _            = require('lodash');
const pathToRegexp = require('path-to-regexp')

const defaults     = require('./defaults');

var theme          = {};
var config         = {};
var rootPath       = null;
var exporter       = function(){};

module.exports = {

    get name(){
        return theme.name;
    },

    get version(){
        return theme.version;
    },

    get routes(){
        return config.routes;
    },

    get staticPaths(){
        let self = this;
        return _.mapValues(config.static, function(directory){
            return makePath(directory);
        }, this);
    },

    get favicon(){
        return makePath(config.favicon);
    },

    get viewsPath(){
        return makePath(config.paths.views);
    },

    get pagesPath(){
        return makePath(config.paths.pages);
    },

    get notFoundView(){
        return config.errors['404'];
    },

    get errorView(){
        return config.errors['500'];
    },

    export: function(api){
        return exporter(api);
    },

    routeFromPath: function(urlPath){
        urlPath = '/' + cleanUrlPath(urlPath.replace(/^\//,''));
        for (let i = 0; i < config.routes.length; i++) {
            let route = config.routes[i];
            try {
                let re = pathToRegexp(route.path);
                if (re.test(urlPath)) {
                    return route;
                }
            } catch(e){
                logger.warn(e.message);
            }
        }
        return null;
    },

    urlFromRoute: function(routeName, params){
        let route = _.find(config.routes, 'handle', routeName);
        params = _.mapValues(params, function(param){
            return cleanUrlPath(param);
        });
        if (route) {
            let compiler = pathToRegexp.compile(route.path);
            return cleanUrlPath(compiler(params));
        }
        return null;
    },

    init: function(moduleName){
        theme    = require(moduleName);
        config   = _.defaultsDeep({}, theme.config || {}, defaults);
        rootPath = path.parse(require.resolve(moduleName)).dir;
        exporter = _.isFunction(theme.export) ? theme.export.bind(this) : function(){};
    }
};

function makePath(filePath){
    return path.join(rootPath, filePath);
}

function cleanUrlPath(urlPath){
    return urlPath.replace(/\%2F/g, '/');
}
