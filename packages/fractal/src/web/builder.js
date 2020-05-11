'use strict';

const Promise = require('bluebird');
const anymatch = require('anymatch');
const Path = require('path');
const co = require('co');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs-extra'));
const Log = require('../core/log');
const mix = require('../core/mixins/mix');
const Emitter = require('../core/mixins/emitter');
const throat = require('throat');

module.exports = class Builder extends mix(Emitter) {

    constructor(theme, engine, config, app) {
        super(app);

        this._app = app;
        this._engine = engine;
        this._config = config;
        this._theme = theme;

        this._static = [];
        this._requests = [];

        this._throttle = throat(config.concurrency || 100);

        this._init();
    }

    /*
     * Deprecated. Use start() instead.
     */
    build() {
        return this.start();
    }

    start() {

        this._validate();
        this._reset();

        // Make sure the sources have loaded
        return this._app.load().then(() => {

            this._buildRequests();

            this.emit('start');

            // remove and recreate build dir
            const setup = fs.removeAsync(this._config.dest).then(() => fs.ensureDirAsync(this._config.dest));

            return setup.then(() => {

                let jobs = [];

                // 1. Start any static copy jobs
                jobs.push(this._static.map(p => this._throttle(() => this._copy(p.path, Path.join(Path.sep, p.mount)))));

                // 2. Run the requests in parallel
                this._requests.forEach(r => {
                    let req = this._throttle(() => this._onRequest(r));
                    if (req) {
                        this._jobsCount++;
                        jobs.push(req);
                    }
                });

                return Promise.all(_.flatten(jobs));
            });

        }).then(() => {
            const stats = {
                errorCount: this._errorCount,
            };
            this.emit('end', stats);
            return stats;
        }).catch(e => {
            this.emit('error', e);
            throw e;
        });
    }

    stop() {
        // can we stop it once running?
    }

    use() {

    }

    _reset() {
        this._errorCount = 0;
        this._jobsCount = 0;
        this._progressCount = 0;
    }

    _init() {
        this._static = this._static.concat(this._theme.static());
        this._engine.setGlobal('env', {
            builder: true,
        });
    }

    _buildRequests() {
        const routes = this._theme.routes();
        const resolvers = _.isFunction(this._theme.resolvers) ? this._theme.resolvers() : this._getLegacyResolvers(routes);
        let requests = [];

        _.forEach(resolvers, (routeResolvers, handle) => {
            const route = _.find(routes, {handle: handle});

            if (!route) {
                Log.debug(`No route found for handle '${handle}'`);
                return;
            }

            for (let resolver of routeResolvers) {
                let resolverSet = _.isFunction(resolver) ? resolver(this._app) : [].concat(resolver);
                for (const params of resolverSet) {
                    const url = this._theme.urlFromRoute(route.handle, params, true);
                    const req = Builder.Request(url, params, route);
                    this._requests.push(req);
                }
            }

        });
    }

    _getLegacyResolvers(routes) {
        let resolvers = {};
        for (let route of routes) {
            _.set(resolvers, route.handle, [].concat(route.params || null));
        }
        return resolvers;
    }

    _onRequest(req) {

        if (req.route.redirect && this._theme.redirectView) {
            req.route.context = {
                redirectUrl: req.route.redirect
            };
            req.route.view = this._theme.redirectView();
        }

        if (req.route.static) {
            const staticPath = _.isFunction(req.route.static) ? req.route.static(req.params, this._app) : req.route.static;
            return this._copy(unescape(staticPath), unescape(req.url), false);
        }

        if (req.route.view) {
            const ext = this._app.web.get('builder.ext');
            const dest = req.url + (req.url == '/' ? `index${ext}` : ext);
            const context = req.route.context || {};

            context.request = req;
            context.renderEnv = {
                request: context.request,
                builder: true,
                server: false,
            };

            return this._render(req.route.view, context)
                    .then(contents => this._write(contents, dest) )
                    .then(() => {
                        this.emit('exported', req);
                        Log.debug(`Exported '${req.url}' ==> '${dest}'`);
                        this._updateProgress();
                    })
                    .catch(err => this._onError(err, req, dest));
        }

    }

    _onError(err, req, dest) {
        this._errorCount++;
        this._updateProgress();
        this.emit('error', new Error(`Failed to export url ${req.url} - ${err.message}`));
        return this._render(this._theme.errorView(), { error: err }).then(contents => this._write(contents, dest)).catch(err => {
            this.emit('error', err);
        });
    }

    _render(view, context) {
        if (_.isFunction(view)) {
            return this._engine.renderString(view(), context);
        } else {
            return this._engine.render(view, context);
        }
    }

    _copy(source, dest, addToJobCount) {
        let ignored = this._config.static.ignored;
        dest = _.trimEnd(Path.join(this._config.dest, dest), Path.sep);
        source = Path.resolve(source);
        if (addToJobCount !== false) {
            this._jobsCount++;
        }
        return fs.copyAsync(source, dest, {
            clobber: true,
            filter: function(path){
                return ! anymatch(ignored, path);
            }
        }).then(() => {
            this._updateProgress();
            Log.debug(`Copied '${source}' ==> '${dest}'`);
        }).catch(e => {
            this._updateProgress();
            Log.error(`Error copying '${source}' ==> '${dest}'`);
            this._errorCount++;
        });
    }

    _write(contents, dest) {
        dest = _.trimEnd(Path.join(this._config.dest, dest), Path.sep);
        return fs.ensureDirAsync(Path.parse(dest).dir).then(() => fs.writeFileAsync(dest, contents));
    }

    _updateProgress() {
        this._progressCount++;
        this.emit('progress', this._progressCount, this._jobsCount);
    }

    _validate() {
        if (!this._config.dest) {
            throw new Error('You need to specify a build destination in your configuration.');
        }
        for (const stat of this._theme.static()) {
            if (stat.path == this._config.dest) {
                throw new Error(`Your build destination directory (${Path.resolve(stat.path)}) cannot be the same as any of your static assets directories.`);
            }
        }
    }

    static Request(url, params, route) {
        route = _.clone(route);
        return {
            headers: {},
            query: {},
            url: url,
            segments: _.compact(url.split('/')),
            params: params,
            path: url,
            error: null,
            errorStatus: null,
            route: route,
        };
    }

};
