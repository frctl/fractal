var promise = require("bluebird");
var merge   = require("deepmerge");
var _       = require("lodash");
var express = require('express');
var exphbs  = require('express-handlebars');
var path    = require('path');
var swag    = require('swag');
var fractal = require('../../fractal');

var config  = fractal.getConfig();

module.exports = function(){

    var port = config.get('port');
    var app = express();
    var hbs = exphbs.create({
        extname: 'hbs',
        partialsDir: [
            config.get('theme.views')
        ]
    });

    swag.registerHelpers(hbs.handlebars);

    app.engine('hbs', hbs.engine);
    app.set('views', config.get('theme.views'))
    app.set('view engine', 'hbs');

    app.use(express.static(config.get('theme.assets')));

    app.get('/components', function (req, res) {
        fractal.getStructure().then(function(data){
            res.render('components', {
                config: config.all(),
                req:  req,
                structure: data
            });
        });
    });

    app.get('/components/*', function (req, res) {
        fractal.getStructure().then(function(data){
            res.render('components/component', {
                config: config.all(),
                req:  req,
                structure: data
            });
        });
    });


    app.get('/assets', function (req, res) {
        fractal.getStructure().then(function(data){
            res.render('assets', {
                config: config.all(),
                req:  req,
                structure: data
            });
        });
    });

    app.get('/assets/*', function (req, res) {
        fractal.getStructure().then(function(data){
            res.render('assets/asset', {
                config: config.all(),
                req:  req,
                structure: data
            });
        });
    });

    // page request
    app.get('(/*)?', function (req, res) {
        fractal.getStructure().then(function(data){
            var page = null;
            if (data.pages.files.length) {
                var matcher = getPathMatcher(req.originalUrl, 'md');
                var page = _.find(data.pages.files, function(p){
                    return p.relPath.match(matcher);
                });
            }

            if (!page) {
                return throw404(req, res);
            }

            res.render('pages/page', {
                page: page,
                config: config.all(),
                req:  req,
                structure: data
            });

        });
    });

    app.listen(port, function () {
        console.log('Fractal server is running at http://localhost:%s', port);
    });

    return app;
};

function throw404(req, res){
    res.render('404', {
        req: req
    });
};

function getCurrentItem(req, data){
    // TODO: move this into a dedicated class? Need a router class perhaps.
    var pathParts = _.compact(req.originalUrl.split('/'));
    var trigger = pathParts[0];
    var current = {};
    switch(trigger) {
        case 'assets':

        break;
        case 'components':

        break;
        default:
            if (data.pages.files.length) {
                var matcher = getPathMatcher(req.originalUrl, 'md');
                var page = _.find(data.pages.files, function(p){
                    return p.relPath.match(matcher);
                });
                if (page) {
                    current = page;
                }
            }
        break;
    }
    return _.isEmpty(current) ? null : current;
}

function getPathMatcher(urlPath, ext){
    urlPath = urlPath.replace('/','');
    return _.trim(urlPath) ? new RegExp('^(' + urlPath + '(\/index)?\.' + ext + ')') : new RegExp('^(' + 'index.' + ext + ')');
}