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
        ],
        helpers: {
            nav: navHelper,
        }
    });

    swag.registerHelpers(hbs.handlebars);

    var tplData = {
        config: config.all(),
    };

    app.engine('hbs', hbs.engine);
    app.set('views', config.get('theme.views'))
    app.set('view engine', 'hbs');

    app.use(express.static(config.get('theme.assets')));

    app.use(function (req, res, next) {
        req.segments = _.compact(req.originalUrl.split('/'));
        tplData.req = req;
        fractal.getStructure().then(function(structure){
            tplData.structure = structure;
            // TODO add avialble main nav items here
            next();
        });
    });

    app.get('/components', function (req, res) {
        res.render('components', merge(tplData, {
            sectionName: 'UI Components'
        }));
    });

    app.get('/components/*', function (req, res) {    
        res.render('components/component', merge(tplData, {
            sectionName: 'UI Components'
        }));
    });

    app.get('/assets', function (req, res) {
        res.render('assets', merge(tplData, {
            sectionName: 'Assets'
        }));
    });

    app.get('/assets/*', function (req, res) {
        res.render('assets/asset', merge(tplData, {
            sectionName: 'Assets'
        }));
    });

    // Page request
    app.get('(/*)?', function (req, res) {
        if (tplData.structure.pages.files) {
            var page = tplData.structure.pages.findFileBy('', req.originalUrl);
            if (page) {

                // TODO!!!
                
                // return res.render(req.originalUrl === '/' ? 'index' : 'pages/page', merge(tplData, {
                //     page: page,
                //     sectionName: req.segments[0],
                //     sectionPages: makeFileTree(_.filter(tplData.structure.pages.files, function(file){
                //         return file.parentUrlDirs[0] == req.segments[0];
                //     }))
                // }));
            }
        }
        res.render('404', tplData);
    });

    app.listen(port, function () {
        console.log('Fractal server is running at http://localhost:%s', port);
    });

    return app;
};

function navHelper(context, options){

}




