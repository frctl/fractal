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
var lz              = require('lz-string');

var output          = require('../output')
var fractal         = require('../../fractal');
var config          = fractal.getConfig();


module.exports = function(){
    
    var port = config.get('server.port') || process.env.PORT || 3000;
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
    var shared = {
        
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
            shared.req = req;    
            shared.sources = sources;
            tplData.navigation = generatePrimaryNav(sources, req);
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
        var compSource = shared.sources.components;
        var docs = shared.sources.docs;
        res.render('components/index', merge(tplData, {
            components: compSource ? compSource.getComponents() : null,
            page: docs ? docs.findByUrlPath('components') || null : null
        }));
    });
    
    app.get('/components/*', function (req, res, next) {

        var compSource      = shared.sources.components;
        var viewType        = req.query.view || 'component';
        var raw             = ! _.isUndefined(req.query.raw);
        var component       = compSource.findComponent('path', req.path.replace(new RegExp('^\/components\/'), ''));
        var variantName     = req.query.variant || (component.getDisplayStyle() === 'switch' ? 'base' : '_merged');
        var variant         = (variantName === '_merged') ? undefined : component.getVariant(variantName);

        if (component && ! component.hidden && ! _.isNull(variant)) {

            if (_.contains(['styles','behaviour','markup','template'], viewType) && raw) {
                res.setHeader("Content-Type", "text/plain");
            }
                        
            return component.getStaticSelf().then(function(c){
                switch(viewType) {
                    case 'styles':
                    case 'behaviour':
                    case 'template':
                        if (! c[viewType] ) return next(error('Invalid view type', 404));
                        return res.render(raw ? 'components/raw' : 'components/highlight', merge(tplData, {
                            content: raw ? c[viewType].raw : c[viewType].highlighted
                        }));
                    case 'preview':
                        return res.render('components/preview', merge(tplData, {
                            content: c.rendered[variantName].wrapped,
                            embedded: !_.isUndefined(req.query.embedded)
                        }));
                    case 'markup':
                        return res.render(raw ? 'components/raw' : 'components/highlight', merge(tplData, {
                            content: raw ? c.rendered[variantName].raw : c.rendered[variantName].highlighted
                        }));
                    case 'context':
                        if (raw) {
                            return res.json(c.contexts[variantName].raw);
                        } else {
                            return res.render('components/highlight', merge(tplData, {
                                content: c.contexts[variantName].highlighted
                            }));
                        }
                    default:
                        return res.render('components/component', merge(tplData, {
                            component: c,
                            components: compSource ? compSource.getComponents() : null,
                            external: _.invert(_.mapKeys(['preview','markup','template','styles','behaviour','context'], function(val){
                                return queryString.stringify(merge(req.query, {view:val}));
                            })),
                            merged: (variantName === '_merged'),
                            variant: variant,
                            variantMarkup: c.rendered[variantName].highlighted,
                            variantContext: c.contexts[variantName].highlighted
                        }));
                    break;
                }

            }).catch(function(e){
                return res.render('components/error', merge(tplData, {
                    components: compSource ? compSource.getComponents() : null,
                    error: e.message
                }));
            });

        } else {
            return next(error('Component not found', 404));
        }
        next(error('Error rendering component'));
    });

    // ASSETS -----------------------------------------------------------------------

    // app.get('/assets', function (req, res) {
    //     res.render('assets', merge(tplData, {
    //         sectionTitle: _.find(tplData.navigation, 'url', '/assets').title
    //     }));
    // });

    // app.get('/assets/*', function (req, res) {
    //     res.render('assets/asset', merge(tplData, {
    //         sectionTitle: _.find(tplData.navigation, 'url', '/assets').title
    //     }));
    // });
    
    // EMBED
    
    app.get('/_embed', function (req, res) {

        var content = lz.decompressFromEncodedURIComponent(req.query.content);
        var rendered = output.renderComponentContent(content, {}).then(function(str){
            return str + "\n" + '<script src="/_theme/preview.js"></script>';
        });

        if (req.query.layout && req.query.layout != 0) {
            var layout = shared.sources.components.tryFindComponent(req.query.layout);
            if (!layout) {
                layout = '{{{content}}}';
            }
            if (!_.isString(layout)) {
                layout = layout.files.markup.content.toString();
            }
            rendered = output.wrapWithLayout(rendered, promise.resolve(layout));
        }

        rendered.then(function(markup){
            res.send(markup);
        });
        return;
    });

    // PAGES -----------------------------------------------------------------------
    
    app.get('/', function (req, res, next) {
        var docs = shared.sources.docs;
        var page = docs ? docs.findByUrlPath('') || null : null;
        if (page) {
            var content = page.render({
                page: page.data || {},
                config: tplData.config
            });
            return content.then(function(c){
                res.render('index', merge(tplData, {
                    page: page,
                    content: c
                }));
            }); 
        }
        res.render('index', merge(tplData, {}));
    });

    app.get('(/*)', function (req, res, next) {
        var docs = shared.sources.docs;
        if (docs) {
            var page = docs.findByUrlPath(req.params[1]);
            if (page) {
                var dir = req.segments.length ? docs.findDirectoryByUrlPath(req.segments[0]) : docs.dir;
                var content = page.render({
                    page: page.data,
                    config: tplData.config
                });
                return content.then(function(c){
                    res.render('pages/page', merge(tplData, {
                        page: page,
                        content: c,
                        sectionTitle: req.segments[0],
                        sectionPages: _.get(dir, 'children', [])
                    }));
                }); 
            } else {
               return next(error('Page not found', 404));
            }
        } else {
            return next(error('No pages found', 404));
        }
        next(error('Error rendering page'));
    });

    app.use(function(err, req, res, next) {
        var data = merge(tplData, {
            message: err.message,
            error: err
        });
        res.status(err.status || 500);
        if (err.status === 404) {
            res.render('404', data);
        } else {
            res.render('error', data);    
        }
    });

    app.listen(port, function () {
        console.log('Fractal server is now running at http://localhost:%s', port);
    });

    return app;
};

function generatePrimaryNav(sources, req){
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

function error(msg, status) {
    var e = new Error(msg);
    e.status = status || 500;
    return e;
}


