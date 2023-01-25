'use strict';

const _ = require('lodash');
const express = require('express');
const WebError = require('./error');
const Log = require('../core').Log;
const mix = require('../core').mixins.mix;
const Emitter = require('../core').mixins.emitter;

module.exports = class Server extends mix(Emitter) {
    constructor(theme, engine, config, app) {
        super(app);
        this._app = app;
        this._engine = engine;
        this._config = config;
        this._theme = theme;
        this._server = express();
        this._instance = null;
        this._ports = {};
        this._urls = {};
        this._connections = {};
        this._init();
    }

    get port() {
        return this._ports.server;
    }

    get ports() {
        return this._ports;
    }

    get urls() {
        return this._urls;
    }

    get url() {
        return this._urls.server;
    }

    get isListening() {
        return !!this._instance;
    }

    start() {
        return this._app.load().then(() => {
            if (this._config.watch) {
                this._app.watch();
            }

            this._ports = findPorts(this._config.port);

            return new Promise((resolve, reject) => {
                this._instance = this._server.listen(this._ports.server, (err) => {
                    if (err) {
                        return reject(err);
                    }

                    this._urls.server = `http://localhost:${this._ports.server}`;

                    this.emit('ready');

                    resolve(this._instance);
                });

                this._instance.on('error', (err) => {
                    this._instance.close(err);
                    if (this._config.watch) {
                        this._app.unwatch();
                    }
                    reject(err);
                });

                this._instance.destroy = (cb) => {
                    this._instance.close(cb);
                    for (const key in this._connections) {
                        this._connections[key].destroy();
                    }
                    this._instance.emit('destroy');
                };

                this._instance.on('connection', (conn) => {
                    const key = `${conn.remoteAddress}:${conn.remotePort}`;
                    this._connections[key] = conn;
                    conn.on('close', () => delete this._connections[key]);
                });
            });
        });
    }

    use() {
        this._server.use.apply(this._server, Array.from(arguments));
    }

    stop() {
        if (this._instance) {
            this._instance.destroy();
            this._instance = null;
            this._ports = null;
            this._urls = null;
            this._connections = {};
        }
        this.emit('stopped');
    }

    _onRequest(req, res, next) {
        this._engine.setGlobal('env', {
            server: true,
            address: this._urls.server,
            port: this._ports.server,
            host: 'localhost',
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
            const staticPath = _.isFunction(match.route.static)
                ? match.route.static(match.params, this._app)
                : match.route.static;
            return res.sendFile(decodeURI(staticPath));
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
            .then((v) => res.send(v))
            .catch((err) => next(err));
    }

    _onError(err, req, res, next) {
        if (res.headersSent || !this._theme.errorView()) {
            return next(err);
        }

        if (err.status) {
            res.status(err.status);
        }

        this._render(this._theme.errorView(), { error: err })
            .then((v) => res.send(v))
            .catch((err) => next(err));

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

        this._theme.static().forEach((s) => {
            this._server.use(`/${_.trimStart(s.mount, '/')}`, express.static(s.path));
        });

        this._server.get(':path(*)', this._onRequest.bind(this));

        this._server.use(this._onError.bind(this));
    }
};

function findPorts(serverPort) {
    return {
        server: serverPort || 3000,
    };
}
