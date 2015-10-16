/**
 * Module dependencies.
 */

var express     = require('express')();
var logger      = require('winston');
var _           = require('lodash');

var components  = require('./components');
var pages       = require('./pages');
var misc        = require('./misc');

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
    this.express = express;
}

/**
 * Build the initial set of routes and responses.
 *
 * @api private
 */

Server.prototype.init = function(options){

    options = options || {};
    this.port = options.port || this.port;
    
    express.use(function (req, res, next) {
        req.segments = _.compact(req.path.split('/'));
        next();
    });
    
    // Homepage
    express.get('/', pages.index);

    // Components
    express.get('/components', components.index);
    express.get('/components/*', components.component);

    // Favicon
    express.get('/favicon.ico', misc.favicon);

    // All other requests are assumed to be page requests
    express.get('/*', pages.page);

    return this;
};

/**
 * Start the server listening to requests.
 *
 * @api public
 */

Server.prototype.listen = function(){
    var port = this.port;
    express.listen(port, function() {
        logger.info('Fractal server is now running at http://localhost:%s', port);
    });
};
