'use strict';

const _       = require('lodash');
const express = require('express');

module.exports = function(config, app){

    const server  = express();
    const theme = app.theme;
    const render = app.render(theme.views());
    const context = {
        theme: theme,
        error: null
    };

    /**
     * Set a few helpful properties on the request object
     */

    server.use((req, res, next) => {
        req.isPjax = !! req.header('X-PJAX');
        req.segments = _.compact(req.path.split('/'));
        context.request = req;
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
            req.params = {};
            return next(new Error('No matching route found')); // TODO: 404
        }
        req.params = match.params;
        const context = getContext(_.clone(match.route.context));
        render.template(match.route.view, context).then(v => res.send(v)).catch(err => next(err));
    });

    /**
     * Error handler
     */

    server.use((err, req, res, next) => {
        app.log.error(err.message);
        if (res.headersSent || !theme.error()) {
            return next(err);
        }
        const context = getContext(theme.error().context);
        context.frctl.browser.error = err;
        render.template(theme.error().view, context).then(v => res.send(v)).catch(err => next(err));
    });

    return {

        server: server,

        start: function(opts){
            opts = opts || {};
            var port = opts.port || config.port || 3000;
            server.listen(port, function(){
                app.log.success(`Fractal preview browser is now available at http://localhost:${port} - use ^c to exit.`);
            });
        },

        stop: function(){
            server.close(function(){
                app.log.end('Fractal preview browser is shutting down.');
            });
        }
    };

    function getContext(ctx) {
        ctx = ctx || {};
        ctx.frctl = ctx.frctl || {};
        ctx.frctl.browser = _.clone(context);
        return ctx;
    }
};
