'use strict';

const Promise     = require('bluebird');
const _           = require('lodash');
const express     = require('express');
const chokidar    = require('chokidar');
const Path        = require('path');
const favicon     = require('serve-favicon');
const portscanner = Promise.promisifyAll(require('portscanner'));
const engine      = require('./render');
let browserSync, bs;

module.exports = function serve(config, theme, app) {

    const server     = express();
    const render     = engine(theme.views, config.engine, theme, app);
    const console    = app.console;
    const useSync    = !! config.sync;
    const syncOpts   = _.isObject(config.sync) ? config.sync : {};
    if (useSync) {
        browserSync  = require("browser-sync");
        bs           = browserSync.create();
    }
    const watchers   = {};

    let serverPort;
    let syncPort;

    /**
     * Set up Browsersync
     */

    if (useSync) {
        app.on('source:updated', (source, data) => {
            if (bs && bs.active && data && data.type !== 'asset') {
                bs.reload();
            }
        });
    }

    /**
     * Set the favicon to prevent pesky 404s
     */

    if (theme.favicon) {
        try {
            server.use(favicon(theme.favicon));
        } catch (err) {
            console.notice(`Could not find favicon at ${theme.favicon}`);
        }
    }

    /**
     * Set a few helpful properties on the request object
     */

    server.use((req, res, next) => {
        const request = {
            isPjax: !!req.header('X-PJAX'),
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
        if (useSync) {
            const pathMatch = new RegExp(`^${s.path}`);
            console.debug(`Watching assets directory - ${s.path}`);
            watchers[s.path] = chokidar.watch(s.path, {
                ignored: /[\/\\]\./
            });
            watchers[s.path].on('change', (filepath) => {
                const assetUrlPath = Path.join(s.mount, filepath.replace(pathMatch, ''));
                bs.reload(assetUrlPath);
            });
            watchers[s.path].on('add', (filepath) => {
                bs.reload();
            });
        }
    });

    _.forEach(config.middleware || [], mw => {
        server.use(mw);
    });

    /**
     * Register theme routes
     */

    server.get(':path(*)', function (req, res, next) {
        const match = theme.matchRoute(req.path);
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
        getGlobals(res.locals).then(function(globals){
            render.template(match.route.view, match.route.context, globals).then(v => res.send(v).end()).catch(err => next(err));
        });
    });

    /**
     * Error handler
     */

    server.use((err, req, res, next) => {
        if (res.headersSent || !theme.error) {
            return next(err);
        }
        res.locals.__request.error = err;
        if (res.locals.__request.errorStatus) {
            res.status(res.locals.__request.errorStatus);
        }
        if (res.locals.__request.errorStatus === '404') {
            console.notice(`404: ${err.message}`);
        } else {
            console.error(err.message);
        }
        getGlobals(res.locals).then(function(globals){
            render.template(theme.error.view, theme.error.context, globals).then(v => res.send(v).end()).catch(err => next(err));
        });
    });

    let instance = null;

    if (!useSync && config.port) {
        syncPort = Promise.resolve(null);
        serverPort = Promise.resolve(config.port);
    } else if (useSync && config.port) {
        syncPort = Promise.resolve(config.port);
        serverPort = portscanner.findAPortNotInUseAsync(config.port, parseInt(config.port, 10) + 30, '127.0.0.1');
    } else if (!useSync && !config.port) {
        syncPort = Promise.resolve(null);
        serverPort = portscanner.findAPortNotInUseAsync(3000, 3030, '127.0.0.1');
    } else if (useSync && !config.port) {
        syncPort = portscanner.findAPortNotInUseAsync(3000, 3030, '127.0.0.1');
        serverPort = syncPort.then(port => {
            return portscanner.findAPortNotInUseAsync(port + 1, port + 30, '127.0.0.1');
        });
    }

    return Promise.join(serverPort, syncPort, function(serverPort, syncPort){

        return {

            server: server,

            start: function (done) {
                    var inst = server.listen(serverPort, function () {

                    const callback = function(){

                        const header    = "Fractal web UI server is running!";
                        const footer    = app.interactive ? `Use the 'stop' command to stop the server.` : `Use ^C to stop the server.`;
                        const url       = `http://localhost:${serverPort}`;

                        let body      = '';
                        let successStyle = console.themeValue('success.style', str => str);

                        if (!useSync) {
                            body += `Local URL: ${successStyle(url)}`;
                        } else {
                            const bsUrls = bs.getOption('urls');
                            body += `Local URL:      ${successStyle(bsUrls.get('local'))}`;
                            body += `\nNetwork URL:    ${successStyle(bsUrls.get('external'))}`;
                            body += `\nBrowserSync UI: ${successStyle(bsUrls.get('ui'))}`;
                            // body += `\nProxying:       ${url}`;
                        }

                        console.box(header, body, footer).unslog();

                        done();
                    };

                    if (useSync) {
                        bs.init({
                            port:     syncPort,
                            logLevel: syncOpts.logLevel || 'silent',
                            browser:  syncOpts.browser || [],
                            notify:   syncOpts.notify || false,
                            proxy:    `http://localhost:${serverPort}`,
                            socket: {
                                port: syncPort
                            }
                        }, callback);
                    } else {
                        callback();
                    }
                });
                instance = makeDestroyable(inst);
            },

            stop: function (done) {
                instance.destroy(function(){
                    if (bs) {
                        bs.exit();
                    }
                    _.forEach(watchers, w => {
                        w.close();
                    });
                    console.success(`Fractal web UI server on port ${serverPort} has shut down.`);
                    done(serverPort);
                    instance = null;
                });
            }
        };
    });

    function getGlobals(context) {
        return Promise.join(serverPort, syncPort, function(serverPort, syncPort){
            return {
                web: {
                    server: {
                        address: `http://localhost:${serverPort}`,
                        port: serverPort,
                        syncPort: syncPort,
                        host: 'localhost',
                        sync: useSync
                    },
                    request: context.__request
                }
            };
        });
    }

    function makeDestroyable(server) {
        let connections = {};
        server.on('connection', function(conn) {
            var key = conn.remoteAddress + ':' + conn.remotePort;
            connections[key] = conn;
            conn.on('close', function() {
                delete connections[key];
            });
        });
        server.destroy = function(cb) {
            server.close(cb);
            for (var key in connections)
            connections[key].destroy();
        };
        return server;
    }
};
