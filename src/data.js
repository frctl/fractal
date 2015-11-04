/**
 * Module dependencies.
 */

var Promise = require('bluebird');
var yaml    = require('js-yaml');
var _       = require('lodash');
var path    = require('path');
var logger  = require('winston');
var fs      = Promise.promisifyAll(require('fs'));

/*
 * Export the data object.
 */

module.exports = {

    /*
     * Load data from file, optionally with a set of defaults applied.
     * Returns a promise.
     *
     * @api private
     */

    load: function(filePath, defaults){
        defaults = defaults || {};
        var pathInfo = path.parse(filePath);
        var ext = pathInfo.ext.toLowerCase();

        if (ext == '.js') {
            try {
                var data = Promise.resolve(require(filePath));
            } catch(e) {
                var data = Promise.reject(e);
            }
        } else {
            var data = fs.readFileAsync(filePath).then(function(contents){
                switch(ext) {
                    case ".json":
                        return JSON.parse(contents);
                    break;
                    case ".yml":
                    case ".yaml":
                        return yaml.safeLoad(contents);
                    break;
                }
            });
        }

        return data.catch(function(e){
            logger.error('Error loading data file ' + filePath + ': ' + e.message);
            return {};
        }).then(function(data){
            return _.defaultsDeep(data, defaults);
        });

    }

};


            
                