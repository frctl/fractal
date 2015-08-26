var promise         = require("bluebird");
var merge           = require("deepmerge");
var _               = require("lodash");
var express         = require('express');
var exphbs          = require('express-handlebars');
var path            = require('path');
var swag            = require('swag');
var Handlebars      = require('handlebars');
var queryString     = require('query-string')
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

    // UI LIBRARY -----------------------------------------------------------------------

    app.get('/components/?*', function (req, res, next) {
        tplData = merge(tplData, {
            sectionTitle: _.find(tplData.navigation, 'url', '/components').title,
            baseUrl: '/components'
        });
        next();
    });
    
    app.get('/components', function (req, res) {
        var compSource = tplData.sources.components;
        res.render('ui', merge(tplData, {
            components: compSource ? compSource.getComponents() : null
        }));
    });
    
    app.get('/components/*', function (req, res) {
        var compSource = tplData.sources.components;
        var component = compSource.findComponent('path', req.path.replace(new RegExp('^\/components\/'), ''));
        if (component) {
            var viewType            = req.query.view || 'component';
            var variant             = req.query.variant || 'default';
            var variants            = component.getVariants() || [];
            var rendered            = component.render(variant, true);
            var renderedWithLayout  = component.render(variant);
            var template            = component.getTemplateMarkup();
            return promise.join(rendered, renderedWithLayout, template, function(rend, rendWL, tpl){
                var data = merge(tplData, {
                    links: {
                        preview:    queryString.stringify(merge(req.query, {view:'preview'})),
                        highlight:  queryString.stringify(merge(req.query, {view:'highlight'})),
                        raw:        queryString.stringify(merge(req.query, {view:'raw'})),
                    },
                    component: {
                        title:              component.title,
                        id:                 component.id,
                        path:               component.path,
                        meta:               JSON.stringify(component.getMetaData(), null, 4),
                        rendered:           rend,
                        renderedWithLayout: rendWL,
                        template:           tpl,
                        data:               JSON.stringify(component.getPreviewData(variant), null, 4),
                        variant:            variant,
                        variants:           variants.length > 1 ? variants : null,
                        styles:             component.getStyles()
                    }
                });
                switch(viewType) {
                    case 'preview':
                        return res.render('ui/preview', data);
                    case 'raw':
                        // res.setHeader("Content-Type", "text/plain");
                        return res.render('ui/raw', data);
                    case 'highlight':
                        return res.render('ui/highlight', data);
                    default:
                        return res.render('ui/component', merge(data, {
                            components: compSource ? compSource.getComponents() : null
                        }));
                    break;
                }
            });
        }
        res.status(404).render('404', tplData);
    });

    // ASSETS -----------------------------------------------------------------------

    app.get('/assets', function (req, res) {
        res.render('assets', merge(tplData, {
            sectionTitle: _.find(tplData.navigation, 'url', '/assets').title
        }));
    });

    app.get('/assets/*', function (req, res) {
        res.render('assets/asset', merge(tplData, {
            sectionTitle: _.find(tplData.navigation, 'url', '/assets').title
        }));
    });

    // PAGES -----------------------------------------------------------------------
    
    app.get('(/*)?', function (req, res) {
        var docs = tplData.sources.docs;
        if (docs) {
            var page = docs.findByUrlPath(req.params[1]);
            if (page) {
                var dir = req.segments.length ? docs.findDirectoryByUrlPath(req.segments[0]) : docs.dir;
                return res.render(req.path === '/' ? 'index' : 'pages/page', merge(tplData, {
                    page: page,
                    sectionTitle: req.segments[0],
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
            title: "Components",
            url: "/components",
        },
        {
            title: "Assets",
            url: "/assets",
        }
    ];
    if (sources.docs) {
        sources.docs.getTopLevelSets().forEach(function(child){
            nav.push({
                title: child.title,
                url: path.join('/', child.fauxInfo.urlStylePath)
            });
        });
    }
    return nav;
}



