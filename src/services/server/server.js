/**
 * Module dependencies.
 */

var express     = require('express');
var server      = express();
var logger      = require('winston');
var path        = require('path');
var _           = require('lodash');
var chalk       = require('chalk');
var Promise     = require('bluebird');

var app         = require('../../application');
var components  = require('./handlers/components');
var pages       = require('./handlers/pages');
var misc        = require('./handlers/misc');
var renderer    = require('../../view');

/**
 * General setup.
 */

var instance = null;

var nunjucks = renderer(app.get('theme:paths:views'), app);
nunjucks.express(server);

server.set('app', app);
server.set('view engine', 'nunj');
server.engine('nunj', nunjucks.render);

// TODO: enable view cache when not in dev mode
// server.enable('view cache');

server.use('/_theme', express.static(app.get('theme:paths:assets')));
try {
    if (app.get('static:path')){
        var dest = '/' + _.trim(app.get('static:dest'), '/');
        server.use(dest, express.static(app.get('static:path')));
    }
} catch(e){}

/**
 * Set up some shared request data and locals.
 */

server.use(function (req, res, next) {

    if (req.header('X-PJAX')) {
        req.pjax = true;
    }
    server.locals.noLayout = req.pjax || false;
    req._segments    = _.compact(req.path.split('/'));

    var components  = app.getComponents();
    var pages       = app.getPages();
    Promise.join(components, pages, function(components, pages){

        req._components = components;
        req._pages = pages.filter('hidden', false);

        server.locals.components = components.filter('hidden', false).flattenWithGroups().toJSON();
        server.locals.pages = pages.toJSON();

        server.locals.navigation = [];

        _.each(req._pages.pages, function(entity){
            if (entity.type == 'page') {
                server.locals.navigation.push({
                    handle: entity.handle,
                    label: entity.label,
                    url: '/' + entity.path,
                });
            } else {
                server.locals.navigation.push({
                    handle: entity.handle,
                    label: entity.label,
                    url: '/' + entity.path,
                    items: entity.getSubEntities(true)
                });
            }
        });

        next();
    });
});

/**
 * Bind routes and parameters to handlers.
 */

// Components
server.use('/components', components.common);

server.param('component', components.params.component);
server.param('componentFile', components.params.componentFile);

// server.get('/components', components.index);
server.get('/components/list/:collection', components.list);
server.get('/components/detail/:component(*)', components.detail);
server.get('/components/raw/:componentFile(*)', components.raw);
server.get('/components/preview/:component(*)/embed', components.previewEmbed);
server.get('/components/preview/:component(*)', components.preview);
server.get('/components/highlight/:componentFile(*)', components.highlight);

// Favicon
server.get('/favicon.ico', misc.favicon);

// All other requests are assumed to be page requests

server.param('page', pages.params.page);
server.get('/:page(*)', pages.page);

// finally the error handler
server.use(misc.error);

/**
 * Export control methods
 */

module.exports = {

    server: server,

    start: function(opts){
        var port = opts.port || app.get('server:port') || 3000;
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
