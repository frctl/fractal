var promise         = require("bluebird");
var fs              = promise.promisifyAll(require("fs"));
var merge           = require("deepmerge");
var _               = require("lodash");
var express         = require('express');
var exphbs          = require('express-handlebars');
var path            = require('path');
var swag            = require('swag');
var Handlebars      = require('handlebars');
var beautifyHTML    = require('js-beautify').html;

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
        helpers: {}
    });

    swag.registerHelpers(hbs.handlebars);

    var tplData = {
        config: config.all(),
    };

    app.engine('hbs', hbs.engine);
    app.set('views', config.get('theme.views'))
    app.set('view engine', 'hbs');

    app.use('/_theme', express.static(config.get('theme.assets')));

    app.use(function (req, res, next) {
        if ( req.path === '/favicon.ico') {
            // TODO: send favicon rather than 404 :-)
            return res.status(404).render('404', tplData);
        }
        req.segments = _.compact(req.path.split('/'));
        tplData.req = req;
        fractal.getSources().then(function(sources){
            
            tplData.sources = sources;
            tplData.navigation = generatePrimaryNav(sources);

            // TEMP LOGGING ----
            // var output = JSON.stringify(sources.components.getComponents(), null, 4)
            // fs.writeFileAsync(path.join(__dirname, "/output.json"), output, function(err) {
            //   console.log('file saved');
            // }); 
            // TEMP LOGGING ----

            next();
        });
    });
    
    app.get('/ui', function (req, res) {
        var compSource = tplData.sources.components;
        res.render('ui', merge(tplData, {
            sectionName: 'UI Components',
            baseUrl: '/ui',
            components: compSource ? compSource.getComponents() : null
        }));
    });
    
    app.get('/ui/*', function (req, res) {
        var compSource = tplData.sources.components;
        var component = compSource.findComponent('path', req.path.replace(new RegExp('^\/ui\/'), ''));
        if (component) {
            var viewType = req.query.view || 'component';
            var variant = req.query.variant || 'default';
            var variants = component.getVariants() || [];
            var data = merge(tplData, {
                component: {
                    title:      component.title,
                    path:       component.path,
                    meta:       JSON.stringify(component.meta, null, 4),
                    rendered:   component.render(variant),
                    template:   component.getTemplateMarkup(),
                    data:       JSON.stringify(component.getPreviewData(variant), null, 4),
                    variant:    variant,
                    variants:   variants.length > 1 ? variants : null 
                }
            });
            
            switch(viewType) {
                case 'preview':
                    return res.render('ui/preview', data);
                default:
                    return res.render('ui/component', merge(data, {
                        sectionName: 'UI Components',
                        baseUrl: '/ui',
                        components: compSource ? compSource.getComponents() : null
                    }));
                break;
            }
        }
        res.status(404).render('404', tplData);
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
        var docs = tplData.sources.docs;
        if (docs) {
            var page = docs.findFile('fauxInfo.urlStylePath', req.params[1]);
            if (page) {
                var dir = req.segments.length ? docs.findDirectory('fauxInfo.urlStylePath', req.segments[0]) : docs.dir;
                return res.render(req.path === '/' ? 'index' : 'pages/page', merge(tplData, {
                    page: page,
                    sectionName: req.segments[0],
                    sectionPages: _.get(dir, 'children', [])
                }));
            }
        }
        res.status(404).render('404', tplData);
    });

    app.listen(port, function () {
        console.log('Fractal server is now running at http://localhost:%s', port);
    });

    return app;
};

function generatePrimaryNav(sources)
{
    var nav = [
        {
            title: "UI Library",
            url: "/ui",
        },
        {
            title: "Assets",
            url: "/assets",
        }
    ];
    if (sources.docs) {
        sources.docs.getFiles().forEach(function(child){
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



