var promise = require("bluebird");
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
        this.getStructure().then(function(data){
            return getService(process.argv[2]);
        });
    },

    getStructure: function(){
        return this.getAllSourceFiles().then(function(files){
            // TODO: need to cache data building if the underlying file trees have not changed
            return {
                components: {
                    files: files.components
                },
                assets: {
                    files: files.assets
                },
                pages: {
                    files: files.pages,
                    sets: getPageSets(files.pages)
                },
                views: {
                    files: files.views
                },
            }
        });
    },

    getSource: function(sourceKey){
        if (!_.contains(config.get('sources'), sourceKey)) {
            throw 'Source type ' + sourceKey + ' not found';
        }
        if (_.isUndefined(sources[sourceKey])) {
            if (config.get(sourceKey)) {
                sources[sourceKey] = new Source(config.get(sourceKey), sourceKey);
                sources[sourceKey].build();
            } else {
                sources[sourceKey] = null;
            }
        }
        return sources[sourceKey];
    },

    getAllSources: function(){
        var self = this;
        var srcs = {};
        config.get('sources').map(function(key){
            srcs[key] = self.getSource(key);
        });
        return srcs;
    },

    getSourceFiles: function(key){
        var src = this.getSource(key);
        return src.files;
    },
    
    getAllSourceFiles: function(){
        var files = {};
        _.each(this.getAllSources(), function(src){
            files[src.name] = src.files;
        });
        return promise.props(files);
    },

    getConfig: function(){
        return config;
    }

};

function getService(serviceName){
    var service = (typeof serviceName === 'undefined' || serviceName == 'server') ? 'server' : 'export';
    return require('./src/services/' +  service)();
}

function getPageSets(files){
    if (!files) return {};
    var sets = _.map(files, function(file){
        return file.parentDirs[0] || null;        
    });
    return _.map(_.unique(_.compact(sets)), function(key){
        return {
            name: key
        }
    });
}