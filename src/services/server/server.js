/**
 * Module dependencies.
 */

var express     = require('express');
var srv         = express();
var logger      = require('winston');
var path        = require('path');
var _           = require('lodash');
var Promise     = require('bluebird');

var components  = require('./handlers/components');
var pages       = require('./handlers/pages');
var misc        = require('./handlers/misc');
var renderer    = require('../../views/renderer');


/*
 * Export the server.
 */

module.exports = new Server;

/**
 * Initialize a new Server instance.
 *
 * @api private
 */

function Server(){
    this.port = 3000;
    this.srv = srv;
}

/**
 * Build the initial set of routes and responses.
 *
 * @api public
 */

Server.prototype.init = function(fractal){

    /**
     * General configuration.
     */

    this.nunjucks = renderer(fractal.get('theme:paths:views'), fractal);
    this.nunjucks.express(srv);

    this.port = fractal.get('server:port') || this.port;

    srv.set('fractal', fractal);
    srv.set('view engine', 'nunj');
    srv.engine('nunj', this.nunjucks.render);
    // TODO: enable view cache when not in dev mode
    // srv.enable('view cache');

    srv.use('/_theme', express.static(fractal.get('theme:paths:assets')));
    try {
        if (fractal.get('static:path')){
            var dest = '/' + _.trim(fractal.get('static:dest'), '/');
            srv.use(dest, express.static(fractal.get('static:path')));
        }
    } catch(e){}


    /**
     * Set up some shared request data and locals.
     */

    srv.use(function (req, res, next) {
        if (req.header('X-PJAX')) {
            req.pjax = true;
        }
        srv.locals.noLayout = req.pjax || false;
        req._segments    = _.compact(req.path.split('/'));
        var components  = fractal.getComponents();
        var pages       = fractal.getPages();
        var themePages  = fractal.getThemePages();
        Promise.join(components, pages, themePages, function(components, pages, themePages){
            req._components = components;
            req._pages = pages.filter('hidden', false);
            req._themePages = themePages;

            srv.locals.components = components.toJSON();
            srv.locals.pages = pages.toJSON();
            // srv.locals.themePages = themePages.toJSON();

            srv.locals.navigation = [{
                handle: 'home',
                label: 'Overview',
                url: '/'
            },
            {
                handle: 'components',
                label: 'Component Library',
                url: '/components',
                items: components.filter('hidden', false).flattenWithGroups().toJSON()
            }];

            next();
        });
    });

    /**
     * Bind routes and parameters to handlers.
     */


    // Components
    srv.use('/components', components.common);

    srv.param('component', components.params.component);
    srv.param('componentFile', components.params.componentFile);

    // srv.get('/components', components.index);
    srv.get('/components/list/:collection', components.list);
    srv.get('/components/detail/:component(*)', components.detail);
    srv.get('/components/raw/:componentFile(*)', components.raw);
    srv.get('/components/preview/:component(*)/embed', components.previewEmbed);
    srv.get('/components/preview/:component(*)', components.preview);
    srv.get('/components/highlight/:componentFile(*)', components.highlight);

    // Favicon
    srv.get('/favicon.ico', misc.favicon);

    // All other requests are assumed to be page requests

    srv.param('page', pages.params.page);
    // srv.get(':page', pages.page);
    srv.get('/:page(*)', pages.page);

    return this;
};

/**
 * Start the server listening to requests.
 *
 * @api public
 */

Server.prototype.listen = function(callback){
    var port = this.port;
    callback = callback || function(){};
    var instance = srv.listen(port, function(){
        logger.info('Fractal server is now running at http://localhost:%s', port);
        callback('http://localhost:' + port, instance);
    });
    return instance;
};

/**
 * Stop the server
 *
 * @api public
 */

Server.prototype.close = function(){
    srv.close();
};
