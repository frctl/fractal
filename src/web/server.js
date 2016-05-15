'use strict';

const Promise      = require('bluebird');
const _            = require('lodash');
const express      = require('express');
const chokidar     = require('chokidar');
const Path         = require('path');
const util         = require('util');
const portscanner  = Promise.promisifyAll(require('portscanner'));
const Log          = require('../core/log');
const mix          = require('../core/mixins/mix');
const Emitter      = require('../core/mixins/emitter');

module.exports = class Server extends mix(Emitter) {

    constructor(theme, config, app){
        super(app);
        this._app         = app;
        this._config      = config;
        this._theme       = theme;
        this._server      = express();
        this._instance    = null;
        this._sync        = false;
        this._ports       = {};
        this._urls        = {};
        this._connections = {};
        this._init();
    }

    get isSynced() {
        return this._sync;
    }

    get ports() {
        return this._ports;
    }

    get urls() {
        return this._urls;
    }

    get isListening() {
        return !! this._instance;
    }

    start(sync) {

        return Promise.props(findPorts(this._config.port, sync)).then(ports => {

            this._ports = ports;
            this._sync  = sync;

            return new Promise((resolve, reject) => {

                this._instance = this._server.listen(ports.server, (err) => {

                    if (err) {
                        return reject(err);
                    }

                    this._urls.server = `http://localhost:${ports.server}`;

                    if (this._sync) {
                        return this._startSync();
                    }

                    this.emit('ready');

                    resolve(this._instance);
                });

                this._instance.destroy = cb => {
                    this._instance.close(cb);
                    for (var key in this._connections) {
                        this._connections[key].destroy();
                    }
                    this._instance.emit('destroy');
                };

                this._instance.on('connection', conn => {
                    const key = `${conn.remoteAddress}:${conn.remotePort}`;
                    this._connections[key] = conn;
                    conn.on('close', () => delete this._connections[key]);
                });

            });

        });
    }

    stop() {
        if (this._instance) {
            this._instance.destroy();
            this._instance    = null;
            this._sync        = false;
            this._ports       = null;
            this._urls        = null;
            this._connections = {};
        }
    }

    _startSync() {

        const syncServer = require('browser-sync').create();
        const watchers   = {};
        const bsConfig   = _.defaultsDeep({
            logLevel:  this._config.debug ? 'debug' : 'silent',
            browser:   [],
            logPrefix: 'Fractal',
            browser:   'default',
            open:      false,
            notify:    false,
            port:      this._ports.sync,
            proxy:     this._urls.server,
            socket: {
                port: this._ports.sync
            }
        }, this._config.syncOptions || {});

        // listen out for source changes
        this._app.on('source:updated', (source, data) => syncServer.reload());

        // listen out for changes in the static assets directories
        this._theme.static().forEach(s => {
            Log.debug(`Watching assets directory - ${s.path}`);
            const pathMatch = new RegExp(`^${s.path}`);
            const monitor = chokidar.watch(s.path, {
                ignored: /[\/\\]\./
            });
            monitor.on('change', filepath => syncServer.reload(Path.join(s.mount, filepath.replace(pathMatch, ''))));
            monitor.on('add', filepath => syncServer.reload());
            watchers[s.path] = monitor;
        });

        // cleanup
        this._instance.on('destroy', () => {
            syncServer.exit();
            _.forEach(watchers, w => {
                w.close();
            });
            watchers = {};
        });

        syncServer.init(bsConfig, () => {
            const urls   = syncServer.getOption('urls');
            this._urls.sync = {
                'local':    urls.get('local'),
                'external': urls.get('external'),
                'ui':       urls.get('ui')
            };
            this.emit('ready');
        });

    }

    _onRequest(req, res, next) {

        this._theme.engine.setGlobal('web', {
            server: {
                address: this._urls.server,
                port: this._ports.server,
                syncPort: this._ports.sync,
                host: 'localhost',
                sync: this.isSynced
            },
            builder: null,
            request: res.locals.__request
        });

        const match = this._theme.matchRoute(req.path);

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

        this._theme.render(match.route.view, match.route.context)
              .then(v => res.send(v).end())
              .catch(err => next(err));
    }

    _onError(err, req, res, next) {

        if (res.headersSent || !this._theme.error) {
            return next(err);
        }

        res.locals.__request.error = err;
        if (res.locals.__request.errorStatus) {
            res.status(res.locals.__request.errorStatus);
        }
        if (res.locals.__request.errorStatus === '404') {
            Log.write(`404: ${err.message}`);
        } else {
            Log.error(err.message);
        }

        this._theme.render(this._theme.error().view, this._theme.error().context)
              .then(v => res.send(v).end())
              .catch(err => next(err));
    }

    _init() {

        this._server.use((req, res, next) => {
            res.locals.__request = {
                headers:      req.headers,
                segments:    _.compact(req.path.split('/')),
                params:      {},
                path:        req.path,
                query:       req.query,
                url:         req.url,
                error:       null,
                errorStatus: null,
                route:       null,
            };
            next();
        });

        this._theme.static().forEach(s => {
            this._server.use(s.mount, express.static(s.path));
        });

        this._server.get(':path(*)', this._onRequest.bind(this));

        if (!this._app.debug) {
            this._server.use(this._onError.bind(this));
        }
    }

}

function findPorts(serverPort, useSync) {
    const findPort = portscanner.findAPortNotInUseAsync;
    const ip       = '127.0.0.1';
    const from     = 3000;
    const range    = 50;
    const until    = from + range;
    if (!useSync && serverPort) {
        return {
            sync: Promise.resolve(null),
            server: Promise.resolve(serverPort)
        }
    }
    if (useSync && serverPort) {
        return {
            sync: Promise.resolve(serverPort),
            server: findPort(serverPort, parseInt(serverPort, 10) + range, ip)
        }
    } else if (!useSync && !serverPort) {
        return {
            sync: Promise.resolve(null),
            server: findPort(from, until, ip)
        }
    } else if (useSync && !serverPort) {
        const syncPort = findPort(from, until, ip);
        return {
            sync: syncPort,
            server: syncPort.then(port => {
                return findPort(port++, port + range, ip);
            })
        }
    }
}
