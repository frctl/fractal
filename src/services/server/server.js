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
    
    this.nunjucks = renderer(fractal.get('theme:paths:views'));
    this.nunjucks.express(srv);

    this.port = fractal.get('server:port') || this.port;
    
    srv.set('fractal', fractal);
    srv.set('view engine', 'nunj');
    srv.engine('nunj', this.nunjucks.render);
    // TODO: enable view cache when not in dev mode
    // srv.enable('view cache'); 

    srv.use('/_theme', express.static(fractal.get('theme:paths:assets')));
    if (fractal.get('static:path')){
        var dest = '/' + _.trim(fractal.get('static:dest'), '/');
        srv.use(dest, express.static(fractal.get('static:path')));
    }
    
    /**
     * Set up some shared request data and locals.
     */
    
    srv.locals.config = fractal.get();
    srv.locals.statuses = fractal.getStatuses();
    srv.locals.navigation = [{
        handle: 'home',
        label: 'Overview',
        url: '/'
    },
    {
        handle: 'components',
        label: 'Components',
        url: '/components'
    }];

    srv.use(function (req, res, next) {
        req._segments    = _.compact(req.path.split('/'));
        var components  = fractal.getComponents();
        var pages       = fractal.getPages();
        Promise.join(components, pages, function(components, pages){
            req._components = components;
            req._pages = pages;
            srv.locals.components = components.toJSON();
            // srv.locals.pages = pages.toJSON();
            srv.locals.pages = [];
            next();
        });
    });

    /**
     * Bind routes and parameters to handlers.
     */
    
    // Homepage
    srv.get('/', pages.index);

    // Components
    srv.use('/components', components.common);
    
    srv.param('component', components.params.component);
    srv.param('componentFile', components.params.componentFile);
    
    srv.get('/components', components.index);
    srv.get('/components/list/:collection', components.list);
    srv.get('/components/detail/:component(*)', components.detail);
    srv.get('/components/raw/:componentFile(*)', components.raw);
    srv.get('/components/preview/:component(*)/embed', components.previewEmbed);
    srv.get('/components/preview/:component(*)', components.preview);
    srv.get('/components/highlight/:componentFile(*)', components.highlight);

    // Favicon
    srv.get('/favicon.ico', misc.favicon);

    // All other requests are assumed to be page requests
    srv.get('/*', pages.page);

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