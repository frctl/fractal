'use strict';

const _          = require('lodash');
const express    = require('express');
var favicon      = require('serve-favicon');

module.exports = function serve(config, app){

    const server = express();
    const theme  = app.theme;
    const log    = app.log;
    const render = app.render(theme.views());

    /**
     * Set the favicon to prevent pesky 404s
     */

    if (theme.favicon()){
        try {
            server.use(favicon(theme.favicon()));
        } catch(err){
            log.error(`Could not find favicon at ${theme.favicon()}`);
        }
    }

    /**
     * Set a few helpful properties on the request object
     */

    server.use((req, res, next) => {
        const request = {
            isPjax: !! req.header('X-PJAX'),
            segments: _.compact(req.path.split('/')),
            params: {},
            path: req.path,
            error: null,
            errorStatus: null,
            route: null,
        };
        res.locals.__request = request;
        next();
    });

    /**
     * Bind static paths
     */

    theme.static().forEach(s => {
        server.use(s.mount, express.static(s.path));
    });

    /**
     * Register theme routes
     */

    server.get(':path(*)', function(req, res, next){
        const match = app.theme.matchRoute(req.path);
        if (!match) {
            res.locals.__request.params = {};
            res.locals.__request.errorStatus = '404';
            return next(new Error(`No matching route found for ${req.path}`));
        }
        if (match.route.redirect) {
            return res.redirect(match.route.redirect);
        }
        res.locals.__request.params = match.params;
        res.locals.__request.route = match.route;
        render.template(match.route.view, match.route.context, getGlobals(res.locals)).then(v => res.send(v)).catch(err => next(err));
    });

    /**
     * Error handler
     */

    server.use((err, req, res, next) => {
        log.error(err.message);
        if (res.headersSent || !theme.error()) {
            return next(err);
        }
        res.locals.__request.error = err;
        if (res.locals.__request.errorStatus){
            res.sendStatus(res.locals.__request.errorStatus);
        }
        render.template(theme.error().view, theme.error().context, getGlobals(res.locals)).then(v => res.send(v)).catch(err => next(err));
    });

    return {

        server: server,

        start: function(opts){
            opts = opts || {};
            var port = opts.port || config.port || 3000;
            server.listen(port, function(){
                log.success(`Fractal preview browser is now available at http://localhost:${port} - use ^c to exit.`);
            });
        },

        stop: function(){
            server.close(function(){
                log.end('Fractal preview browser is shutting down.');
            });
        }
    };

    function getGlobals(context) {
        return {
            web: {
                theme: theme,
                request: context.__request
            }
        };
    }
};
