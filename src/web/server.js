'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const express = require('express');
const chokidar = require('chokidar');
const Path = require('path');
const util = require('util');
const portscanner = Promise.promisifyAll(require('portscanner'));
const WebError = require('./error');
const Log = require('../core/log');
const mix = require('../core/mixins/mix');
const mime = require('mime');
const Emitter = require('../core/mixins/emitter');

module.exports = class Server extends mix(Emitter) {

    constructor(theme, engine, config, app) {
        super(app);
        this._app = app;
        this._engine = engine;
        this._config = config;
        this._theme = theme;
        this._server = express();
        this._instance = null;
        this._sync = false;
        this._ports = {};
        this._urls = {};
        this._connections = {};
        this._init();
    }

    get isSynced() {
        return this._sync;
    }

    get port() {
        return this._sync ? this._ports.sync : this._ports.server;
    }

    get ports() {
        return this._ports;
    }

    get urls() {
        return this._urls;
    }

    get url() {
        return this._sync ? this._urls.sync.local : this._urls.server;
    }

    get isListening() {
        return !! this._instance;
    }

    start(sync) {
        sync = _.isUndefined(sync) ? (this._config.sync || false) : sync;

        return this._app.load().then(() => {
            if (this._config.watch) {
                this._app.watch();
            }

            return Promise.props(findPorts(this._config.port, sync)).then(ports => {
                this._ports = ports;
                this._sync = sync;

                return new Promise((resolve, reject) => {
                    this._instance = this._server.listen(ports.server, (err) => {
                        if (err) {
                            return reject(err);
                        }

                        this._urls.server = `http://localhost:${ports.server}`;

                        if (this._sync) {
                            return this._startSync(resolve, reject);
                        }

                        this.emit('ready');

                        resolve(this._instance);
                    });

                    this._instance.destroy = cb => {
                        this._instance.close(cb);
                        for (const key in this._connections) {
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
        });
    }

    stop() {
        if (this._instance) {
            this._instance.destroy();
            this._instance = null;
            this._sync = false;
            this._ports = null;
            this._urls = null;
            this._connections = {};
        }
        this.emit('stopped');
    }

    _startSync(resolve, reject) {
        const syncServer = require('browser-sync').create();
        const bsConfig = _.defaultsDeep(this._config.syncOptions || {}, {
            logLevel: this._config.debug ? 'debug' : 'silent',
            logPrefix: 'Fractal',
            browser: 'default',
            open: false,
            notify: false,
            port: this._ports.sync,
            server: false,
            proxy: {
                target: this._urls.server
            },
            socket: {
                port: this._ports.sync,
            },
        });
        let watchers = {};

        this._app.watch();

        // listen out for source changes
        this._app.on('source:updated', (source, data) => syncServer.reload());

        // listen out for changes in the static assets directories
        this._theme.static().forEach(s => {
            Log.debug(`Watching assets directory - ${s.path}`);
            const pathMatch = new RegExp(`^${s.path}`);
            const monitor = chokidar.watch(s.path, {
                ignored: /[\/\\]\./,
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

        syncServer.init(bsConfig, (err, bs) => {
            if (err) {
                reject(err);
                return;
            }
            const urls = bs.getOption('urls');
            this._urls.sync = {
                'local': urls.get('local'),
                'external': urls.get('external'),
                'ui': urls.get('ui'),
            };
            this.emit('ready');
            resolve(this._instance);
        });
    }

    _onRequest(req, res, next) {
        this._engine.setGlobal('env', {
            server: true,
            address: this._urls.server,
            port: this._ports.server,
            syncPort: this._ports.sync,
            host: 'localhost',
            sync: this.isSynced,
        });

        Log.debug(`Request for '${req.url}'`);

        const match = this._theme.matchRoute(req.path);

        if (!match) {
            return next(new WebError(404, `No matching route found for ${req.path}`));
        }

        if (match.route.redirect) {
            return res.redirect(match.route.redirect);
        }

        if (match.route.static) {
            const staticPath = _.isFunction(match.route.static) ? match.route.static(match.params, this._app) : match.route.static;
            return res.sendFile(staticPath);
        }

        res.locals.__request.params = match.params;
        res.locals.__request.route = match.route;

        this.emit('request', res.locals.__request);

        const context = match.route.context || {};
        context.request = _.clone(res.locals.__request);
        context.renderEnv = {
            request: context.request,
            server: true,
            builder: false,
        };

        this._render(match.route.view, context)
            .then(v => res.send(v).end())
            .catch(err => next(err));
    }

    _onError(err, req, res, next) {
        if (res.headersSent || !this._theme.errorView()) {
            return next(err);
        }

        if (err.status) {
            res.status(err.status);
        }

        this._render(this._theme.errorView(), { error: err })
            .then(v => res.send(v).end())
            .catch(err => next(err));

        this.emit('error', err, res.locals.__request);
    }

    _render(view, context) {
        if (_.isFunction(view)) {
            return this._engine.renderString(view(), context);
        } else {
            return this._engine.render(view, context);
        }
    }

    _init() {
        this._server.use((req, res, next) => {
            res.locals.__request = {
                headers: req.headers,
                segments: _.compact(req.path.split('/')),
                params: {},
                path: req.path,
                query: req.query,
                url: req.url,
                route: null,
            };
            next();
        });

        this._theme.static().forEach(s => {
            this._server.use(`/${_.trimStart(s.mount, '/')}`, express.static(s.path));
        });

        this._server.get(':path(*)', this._onRequest.bind(this));

        this._server.use(this._onError.bind(this));
    }

};

function findPorts(serverPort, useSync) {
    const findPort = portscanner.findAPortNotInUseAsync;
    const ip = '127.0.0.1';
    const from = 3000;
    const range = 50;
    const until = from + range;
    if (!useSync && serverPort) {
        return {
            sync: Promise.resolve(null),
            server: Promise.resolve(serverPort),
        };
    }
    if (useSync && serverPort) {
        return {
            sync: Promise.resolve(serverPort),
            server: findPort(serverPort + 1, parseInt(serverPort, 10) + range, ip),
        };
    } else if (!useSync && !serverPort) {
        return {
            sync: Promise.resolve(null),
            server: findPort(from, until, ip),
        };
    } else if (useSync && !serverPort) {
        const syncPort = findPort(from, until, ip);
        return {
            sync: syncPort,
            server: syncPort.then(port => {
                return findPort(port + 1, port + range, ip);
            }),
        };
    }
}
