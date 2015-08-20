var promise = require("bluebird");
var fs      = promise.promisifyAll(require("fs"));
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
        if ( req.originalUrl === '/favicon.ico') {
            // TODO: send favicon
            return res.status(404).render('404', tplData);
        }
        req.segments = _.compact(req.originalUrl.split('/'));
        tplData.req = req;
        fractal.getStructure().then(function(structure){
            tplData.structure = structure;
            tplData.navigation = generatePrimaryNav(structure);

            // TEMP LOGGING ----
            // var output = JSON.stringify(structure, null, 4)
            // fs.writeFileAsync(path.join(__dirname, "/output.json"), output, function(err) {
            //   console.log('file saved');
            // }); 
            // TEMP LOGGING ----

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
        var pages = tplData.structure.pages;
        if (pages) {
            var urlPath = _.trim(req.originalUrl, '/');
            var page = pages.findFileBy('fauxInfo.urlStylePath', urlPath);
            if (page) {
                var dir = req.segments.length ? pages.findDirBy('fauxInfo.urlStylePath', req.segments[0]) : pages;
                return res.render(req.originalUrl === '/' ? 'index' : 'pages/page', merge(tplData, {
                    page: page,
                    sectionName: req.segments[0],
                    sectionPages: _.get(dir, 'children', [])
                }));
            }
        }
        res.status(404).render('404', tplData);
    });

    app.listen(port, function () {
        console.log('Fractal server is running at http://localhost:%s', port);
    });

    return app;
};

function navHelper(context, options){

}

function generatePrimaryNav(structure)
{
    var nav = [
        {
            title: "UI Components",
            url: "/components",
        },
        {
            title: "Assets",
            url: "/assets",
        }
    ];
    if (structure.pages) {
        structure.pages.children.forEach(function(child){
            if (child.isDirectory() && child.hasChildren()) {
                nav.push({
                    title: child.title,
                    url: path.join('/', child.fauxInfo.relative)
                });
            }
        });
    }
    return nav;
}



