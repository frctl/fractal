/**
 * Module dependencies.
 */

var express     = require('express');
var srv         = express();         
var logger      = require('winston');
var _           = require('lodash');

var components  = require('./handlers/components');
var pages       = require('./handlers/pages');
var misc        = require('./handlers/misc');
var renderer    = require('../../views/handlebars');


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

    var hbs = renderer(fractal.get('theme:paths:partials'));

    this.port = fractal.get('server:port') || this.port;
 
    srv.locals.fractal = fractal;

    srv.engine('hbs', hbs.engine);
    srv.set('views', fractal.get('theme:paths:views'));
    srv.set('view engine', 'hbs');

    srv.use('/_theme', express.static(fractal.get('theme:paths:assets')));
    if (fractal.get('static')){
        srv.use(express.static(fractal.get('static')));
    }
    
    srv.use(function (req, res, next) {
        req.segments = _.compact(req.path.split('/'));
        next();
    });
    
    // Homepage
    srv.get('/', pages.index);

    // Components
    srv.get('/components', components.index);
    srv.get('/components/*', components.component);

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

Server.prototype.listen = function(){
    var port = this.port;
    srv.listen(port, function() {
        logger.info('Fractal server is now running at http://localhost:%s', port);
    });
};
