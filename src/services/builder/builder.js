/**
 * Module dependencies.
 */

var logger      = require('winston');
var os          = require('os');
// var request     = require('request-promise');
var Promise     = require('bluebird');
var chalk       = require('chalk');
var path        = require('path');
var fs          = require('fs');
var _           = require('lodash');
var mkdirp      = Promise.promisify(require('mkdirp'));
var ncp         = Promise.promisify(require('ncp'));
var rimraf      = Promise.promisify(require('rimraf'));

var request     = require('./supertest');

/**
 * Export the builder
 */

module.exports = function(app){

    if (!app.get('build:dest')) {
        logger.error('You need to specify a build destination in your configuration.');
        server.close();
        process.exit(1);
        return;
    }

    var urls        = [];
    var jobs        = [];
    var buildDir    = path.resolve(app.get('build:dest'));
    var components  = app.getComponents();
    var pages       = app.getPages();

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

        /**
         * Components
         */

        _.each(components.flatten().components, function(component){
            if (!component.hidden) {
                urls.push(path.join('/components/detail', component.handlePath));
                // urls.push(path.join('/components/preview', component.handlePath));
                // urls.push(path.join('/components/preview', component.handlePath, 'embed'));
                _.each(component.getVariants(), function(variant){
                    // urls.push(path.join('/components/detail', variant.handlePath));
                    urls.push(path.join('/components/preview', variant.handlePath));
                    urls.push(path.join('/components/preview', variant.handlePath, 'embed'));
                });
            }
        });

        /**
         * Pages
         */

        _.each(pages.flatten().pages, function(page){
            if (!page.hidden) {
                urls.push(path.join('/', page.handlePath));
            }
        });

        /**
         * Run export...
         */

        // 1. Copy theme assets

        jobs.push(ncp(app.get('theme:paths:assets'), path.join(tmpExportPath, '_theme')));

        // 2. Copy site static assets, if defined.

        if (app.get('static:path') && app.get('build:dest') !== app.get('static:path')) {
            jobs.push(ncp(app.get('static:path'), path.join(tmpExportPath, app.get('static:dest'))));
        }

        // 3. For each URL: make a GET request, save response to disk.

        var req = request(app.server);

        var onError = function(e){
            logger.error(e.message);
            app.stopServer();
            process.exit(1);
        };

        _.each(urls, function(url){
            var exportPath = path.resolve(path.join(tmpExportPath, url, 'index.html'));
            var exportPathInfo = path.parse(exportPath);
            var job = mkdirp(exportPathInfo.dir).then(function(){
                return req.get(url).end().then(function(response){
                    logger.info('Exporting response from %s', url);
                    return fs.writeFileAsync(exportPath, response.text);
                }).catch(onError);
            }).catch(onError);
            jobs.push(job);
        });

        Promise.all(jobs).then(function(){
            rimraf(buildDir).then(function(){
                return mkdirp(buildDir);
            }).then(function(){
                return ncp(tmpExportPath, buildDir);
            }).finally(function(){
                app.stopServer();
                console.log(chalk.green('A static version of your component library has been exported into ' + buildDir));
                process.exit(0);
            });
        });

    }).catch(function(e){
        logger.error(e.message);
        app.stopServer();
        process.exit(1);
    });
};
