'use strict';

var path       = require('path');
const _        = require('lodash');

const defaults = require('./defaults');

var theme = {};
var config = {};
var rootPath = null;
var exporter = function(){};

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
        var self = this;
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
