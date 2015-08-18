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
        fractal.getStructure().then(function(structure){
            res.render('components', {
                sectionName: 'UI Components',
                config: config.all(),
                req: getRequest(req),
                structure: structure
            });
        });
    });

    app.get('/components/*', function (req, res) {
        fractal.getStructure().then(function(structure){
            res.render('components/component', {
                sectionName: 'UI Components',
                config: config.all(),
                req: getRequest(req),
                structure: structure
            });
        });
    });


    app.get('/assets', function (req, res) {
        fractal.getStructure().then(function(structure){
            res.render('assets', {
                sectionName: 'Assets',
                config: config.all(),
                req: getRequest(req),
                structure: structure
            });
        });
    });

    app.get('/assets/*', function (req, res) {
        fractal.getStructure().then(function(structure){
            res.render('assets/asset', {
                sectionName: 'Assets',
                config: config.all(),
                req: getRequest(req),
                structure: structure
            });
        });
    });

    // page request
    app.get('(/*)?', function (req, res) {
        fractal.getStructure().then(function(structure){
            var page = null;
            
            if (structure.pages.files.length) {
                var matcher = getPathMatcher(req.originalUrl, 'md');
                var page = _.find(structure.pages.files, function(p){
                    return p.relPath.match(matcher);
                });
            }

            if (!page) {
                return throw404(req, res);
            }

            var newReq = getRequest(req);

            res.render(req.originalUrl === '/' ? 'index' : 'pages/page', {
                page: page,
                sectionName: newReq.segments[0],
                config: config.all(),
                req: newReq,
                structure: structure
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
        req: getRequest(req)
    });
};

function getPathMatcher(urlPath, ext){
    urlPath = urlPath.replace('/','');
    return _.trim(urlPath) ? new RegExp('^(' + urlPath + '(\/index)?\.' + ext + ')') : new RegExp('^(' + 'index.' + ext + ')');
}

function getRequest(req){
    req.segments = _.compact(req.originalUrl.split('/'));
    return req;
}