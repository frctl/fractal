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
var output          = require('../output')
var fractal         = require('../../fractal');
var config          = fractal.getConfig();

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

    if (config.get('static')) {
        app.use(express.static(config.get('static')));    
    }

    app.use(function (req, res, next) {
        if ( req.path === '/favicon.ico') {
            // TODO: send favicon rather than 404 :-)
            return res.status(404).render('404', tplData);
        }
        req.segments = _.compact(req.path.split('/'));
        
        fractal.getSources().then(function(sources){
            tplData.req = req;    
            tplData.sources = sources;
            tplData.navigation = generatePrimaryNav(sources, req);

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
        res.render('components/index', merge(tplData, {
            components: compSource ? compSource.getComponents() : null
        }));
    });
    
    app.get('/components/*', function (req, res) {
        var compSource = tplData.sources.components;
        var component = compSource.findComponent('path', req.path.replace(new RegExp('^\/components\/'), ''));
        if (component && ! component.hidden) {
            var data                = component.getData();
            var viewType            = req.query.view || 'component';
            var variant             = component.getVariant(req.query.variant) || (component.getDisplayStyle() === 'switch' ? component.getVariant('base') : null);
            var concat              = (component.getDisplayStyle() === 'concat' && ! variant);
            var variants            = variant ? component.getVariants() || [] : [];
            var rendered            = concat ? component.renderAll(true) : component.render(variant.name, true);
            var renderedWithLayout  = concat ? component.renderAll() : component.render(variant.name);
            var template            = component.getTemplateMarkup();
            var raw                 = false;
            return promise.join(rendered, renderedWithLayout, template, function(rend, rendWL, tpl){
                if (_.contains(['styles','markup','template'], viewType) && !_.isUndefined(req.query.raw)) {
                    res.setHeader("Content-Type", "text/plain");
                    raw = true;
                }
                switch(viewType) {
                    case 'preview':
                        return res.render('components/preview', merge(data, {
                            content: rendWL,
                            embedded: !_.isUndefined(req.query.embedded)
                        }));
                    case 'styles':
                        return res.render(raw ? 'components/raw' : 'components/highlight', merge(data, {
                            content: raw ? component.getStyles() : output.highlight(component.getStyles(), 'scss')
                        }));
                    case 'markup':
                        return res.render(raw ? 'components/raw' : 'components/highlight', merge(data, {
                            content: raw ? rend : output.highlight(rend, 'html')
                        }));
                    case 'template':
                        return res.render(raw ? 'components/raw' : 'components/highlight', merge(data, {
                            content:  raw ? tpl : output.highlight(tpl, 'html')
                        }));
                    case 'context':
                        var cont = concat ? component.getAllTemplateContexts() : component.getTemplateContext(variant.name);
                        if (!_.isUndefined(req.query.raw)) {
                            return res.json(cont);   
                        } else {
                            return res.render('components/highlight', merge(data, {
                                content:  output.highlight(cont, 'json')
                            }));
                        }
                    default:
                        function makeUrl(viewKey) {
                            return queryString.stringify(merge(req.query, {view:viewKey}));
                        }
                        var data = merge(tplData, {
                            external: {
                                preview:    makeUrl('preview'),
                                markup:     makeUrl('markup'),
                                template:   makeUrl('template'),
                                raw:        makeUrl('raw'),
                                styles:     makeUrl('styles'),
                                context:    makeUrl('context'),
                            },
                            concat:                 concat,
                            "switch":               ! concat,
                            component: {
                                title:              component.title,
                                id:                 component.id,
                                status:             component.status,
                                path:               component.path,
                                data:               data,
                                markup:             rend,
                                markupWithLayout:   rendWL,
                                template:           tpl,
                                variant:            variant,
                                variants:           variants.length > 0 ? variants : null,
                                variantsCount:      variants.length,
                                notes:              component.getNotes(),
                                highlighted: {
                                    styles:     output.highlight(component.getStyles(), 'scss'),
                                    context:    output.highlight(concat ? component.getAllTemplateContexts() : component.getTemplateContext(variant.name), 'json'),
                                    data:       output.highlight(component.getData(), 'json'),
                                    markup:     output.highlight(rend, 'html'),
                                    template:   output.highlight(tpl, 'hbs'),
                                }
                            }
                        });
                        return res.render('components/component', merge(data, {
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

function generatePrimaryNav(sources, req)
{
    var nav = [];
    nav.push({
        title: "Overview",
        url: "/",
    });
    if (sources.components) {
        nav.push({
            title: "Components",
            url: "/components",
        });
    }
    if (sources.assets) {
        nav.push({
            title: "Assets",
            url: "/assets",
        });
    }
    if (sources.docs) {
        sources.docs.getTopLevelSets().forEach(function(child){
            nav.push({
                title: child.title,
                url: path.join('/', child.fauxInfo.urlStylePath)
            });
        });
    }
    nav.forEach(function(item){
        if ('/' + req.segments[0] === item.url || (req.segments.length === 0 && item.url == '/')) {
            item.current = true;
        }
    });
    return nav;
}



