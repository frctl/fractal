/**
 * Module dependencies.
 */

var logger      = require('winston');
var request     = require('request-promise');
var Promise     = require('bluebird');
var path        = require('path');
var fs          = require('fs');
var mkdirp      = Promise.promisify(require('mkdirp'));
var ncp         = Promise.promisify(require('ncp'));
var _           = require('lodash');

/*
 * Export the exporter.
 */

module.exports = new Exporter;

/**
 * Initialize a new Exporter instance.
 *
 * @api private
 */

function Exporter(){

}

/**
 * Setup the Exporter
 *
 * @api private
 */

Exporter.prototype.init = function(fractal){

    this.app = fractal;

    return this;
};

/**
 * Run the exporter.
 *
 * @api public
 */

Exporter.prototype.export = function(){

    var self = this;

    this.app.startServer(function(baseUrl, server){

        var urls        = [];
        var base        = _.trim(baseUrl, '/');
        var components  = self.app.getComponents();
        var pages       = self.app.getPages();

        Promise.join(components, pages, function(components, pages){

            /**
             * Static pages
             */
            
            urls.push('/');
            urls.push('/components');

            /**
             * Components
             */

            _.each(components.flatten().components, function(component){
                if (!component.hidden) {
                    _.each(component.getVariants(), function(variant){
                        var variantPath = (variant == component.default) ? component.handlePath : variant.handlePath;
                        urls.push(path.join('/components/detail', variantPath));
                    });
                }
            });

            /**
             * Run export...
             */
            
            var jobs = [];

            // copy theme assets
            
            var job = ncp(self.app.get('theme:paths:assets'), path.join('export', '_theme'));
            jobs.push(job);
            
            // run through all urls and save static versions of them

            _.each(urls, function(url){
                var requestUrl = base + url.trim('/');
                var exportPath = path.resolve(path.join('export', (url == '/' ? 'index' : url) + '.html'));
                var exportPathInfo = path.parse(exportPath);
                logger.info('Exporting response from ' + requestUrl);
                var job = mkdirp(exportPathInfo.dir).then(function(){
                    return request(requestUrl).then(function(response){
                        return fs.writeFileAsync(exportPath, response);
                    }).catch(self.onError);
                }).catch(self.onError);
                jobs.push(job);
            });

            Promise.all(jobs).then(function(){
                server.close();
                process.exit();
            });

        }).catch(function(e){
            logger.error(e.message);
            server.close();
            process.exit();
        });

    });

};

Exporter.prototype.onError = function(e){
    logger.error(e.message);
};

Exporter.prototype.finish = function(){

};