/**
 * Module dependencies.
 */

var express       = require('express');
var server        = express();
var logger        = require('winston');
var path          = require('path');
var _             = require('lodash');
var chalk         = require('chalk');
var Promise       = require('bluebird');
var favicon       = require('serve-favicon');

var app           = require('../application');
var NotFoundError = require('../errors/notfound');
var highlighter   = require('../highlighter');
var api           = require('../api');
var theme         = require('../theme/theme');
var engine        = require('../view');

/**
 * General setup.
 */

var instance = null;

engine.express(server);
server.set('view engine', 'nunj');
server.engine('nunj', engine.render);

/**
 * Static paths for the theme.
 */

_.forEach(theme.staticPaths, function(directory, route){
    server.use(route, express.static(directory));
});

try {
    server.use(favicon(theme.favicon));
} catch(e){
    logger.warn('Favicon not found at %s', theme.favicon);
}

/**
 * Static paths for the components.
 */

try {
    if (app.get('static.path')){
        var dest = '/' + _.trim(app.get('static.dest'), '/');
        server.use(dest, express.static(app.get('static.path')));
    }
} catch(e){
    logger.warn('Static assets path %s does not exist', app.get('static.path'));
}

/**
 * Play nicely with PJAX
 */

server.use(function (req, res, next) {
    if (req.header('X-PJAX')) {
        req._pjax = true;
    }
    req.segments  = _.compact(req.path.split('/'));
    next();
});

/**
 * Specify routes
 */

// Theme-provided routes

_.forEach(theme.routes, function(route, name){
    server.get(route.path, function(req, res, next){
        api.load().then(function(api){
            req._api = api;
            req.params = _.defaults(route.params || {}, req.params);
            var context = {
                request: req,
                api: api,
                route: route
            };
            context._context = context;
            res.render(route.view, context, function(e, html){
                if (e) {
                    if (! (e instanceof NotFoundError) && _.contains(e.message, 'NotFoundError')) {
                        next(new NotFoundError(e.message, e))
                    } else {
                        next(e)
                    }
                } else {
                    res.send(html);
                }
            });
        });
    });
});

/**
 * Error handler
 */

server.use(function(e, req, res, next) {
    logger.error(e.message);
    if (res.headersSent) {
        return next(e);
    }
    var context = {
        message: e.message,
        stack: highlighter(e.stack),
        error: e,
        api: req._api
    };
    var cb = function(err, html){
        res.send(html);
    };
    if (e instanceof NotFoundError || _.contains(e.message, 'NotFoundError')) {
        return res.status(404).render(theme.notFoundView, context, cb);
    } else {
        return res.render(theme.errorView, context, cb);
    }
});

/**
 * Export control methods
 */

module.exports = {

    server: server,

    start: function(opts){
        var port = opts.port || app.get('server.port') || 3000;
        if (!instance) {
            instance = server.listen(port, function(){
                console.log(chalk.green('Fractal server is now running at http://localhost:' + port + ' - use ^c to exit.'));
            });
        }
    },

    stop: function(){
        if (instance) {
            instance.close(function(){
                logger.info('Fractal server is shutting down.');
            });
            instance = null;
        }
    }

};
