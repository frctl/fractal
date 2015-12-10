/**
 * Module dependencies.
 */

var logger      = require('winston');
var os          = require('os');
var request     = require('request-promise');
var Promise     = require('bluebird');
var path        = require('path');
var fs          = require('fs');
var mkdirp      = Promise.promisify(require('mkdirp'));
var ncp         = Promise.promisify(require('ncp'));
var rimraf      = Promise.promisify(require('rimraf'));
var _           = require('lodash');

/*
 * Export the Builder.
 */

module.exports = new Builder;

/**
 * Initialize a new Builder instance.
 *
 * @api private
 */

function Builder(){

}

/**
 * Setup the Builder
 *
 * @api private
 */

Builder.prototype.init = function(fractal){

    this.app = fractal;

    return this;
};

/**
 * Run the Builder.
 *
 * @api public
 */

Builder.prototype.run = function(){

    var self = this;

    this.app.startServer(function(baseUrl, server){

        if (!self.app.get('build:dest')) {
            logger.error('You need to specify a build destination in your configuration.');
            server.close();
            process.exit();
            return;
        }

        var urls        = [];
        var base        = _.trim(baseUrl, '/');
        var buildDir    = path.resolve(self.app.get('build:dest'));
        var components  = self.app.getComponents();
        var pages       = self.app.getPages();

        var timestamp   = Date.now();
        var tmpExportPath = path.join(os.tmpdir(), 'fractal', 'export-' + timestamp);

        var makeTempDir = mkdirp(tmpExportPath);

        Promise.join(makeTempDir, components, pages, function(makeTempDir, components, pages){

            /**
             * Static pages
             */

            urls.push('/');
            urls.push('/components');
            urls.push('/components/list/all');
            urls.push('/components/list/all-no-variants');

            /**
             * Components
             */

            _.each(components.flatten().components, function(component){
                if (!component.hidden) {
                    _.each(component.getVariants(), function(variant){
                        // component detail
                        urls.push(path.join('/components/detail', variant.handlePath));
                        if (variant == component.default) {
                            urls.push(path.join('/components/detail', component.handlePath));
                        }
                        // component preview
                        urls.push(path.join('/components/preview', variant.handlePath));
                        urls.push(path.join('/components/preview', variant.handlePath, 'embed'));
                        if (variant == component.default) {
                            urls.push(path.join('/components/preview', component.handlePath));
                            urls.push(path.join('/components/preview', component.handlePath, 'embed'));
                        }
                    });
                }
            });

            /**
             * Run export...
             */

            var jobs = [];

            // 1. Copy theme assets

            jobs.push(ncp(self.app.get('theme:paths:assets'), path.join(tmpExportPath, '_theme')));

            // 2. Copy site static assets, if defined.

            if (self.app.get('static:path') && self.app.get('build:dest') !== self.app.get('static:path')) {
                jobs.push(ncp(self.app.get('static:path'), path.join(tmpExportPath, self.app.get('static:dest'))));
            }

            // 3. For each URL: make a GET request, save response to disk.

            _.each(urls, function(url){
                var requestUrl = base + url.trim('/');
                var exportPath = path.resolve(path.join(tmpExportPath, url, 'index.html'));
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
                // rimraf(buildDir).then(function(){
                //     mkdirp(buildDir).then(function(){
                        ncp(tmpExportPath, buildDir).then(function(){
                            server.close();
                            process.exit();
                        });
                //     });
                // });
            });

        }).catch(function(e){
            logger.error(e.message);
            server.close();
            process.exit();
        });

    });

};

Builder.prototype.onError = function(e){
    logger.error(e.message);
};

Builder.prototype.finish = function(){

};
