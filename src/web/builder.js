'use strict';

const Promise = require('bluebird');
const Path = require('path');
const co = require('co');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs-extra'));
const Log = require('../core/log');
const mix = require('../core/mixins/mix');
const Emitter = require('../core/mixins/emitter');

module.exports = class Builder extends mix(Emitter) {

    constructor(theme, engine, config, app) {
        super(app);

        this._app = app;
        this._engine = engine;
        this._config = config;
        this._theme = theme;

        this._static = [];

        this._throttle = require('throat')(Promise)(config.concurrency || 100);

        this._errorCount = 0;
        this._jobsCount = 0;
        this._progressCount = 0;

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

        // Make sure the sources have loaded
        return this._app.load().then(() => {

            this.emit('start');

            // remove and recreate build dir
            const setup = fs.removeAsync(this._config.dest).then(() => fs.ensureDirAsync(this._config.dest));

            let jobs = [];

            // 1. Start any static copy jobs
            //
            jobs.push(this._static.map(p => this._copy(p.path, Path.join(Path.sep, p.mount))));

            // 2. Run the requests in parallel

            jobs.concat(this._requests.map(r => this._onRequest(r)));




            return setup.then(() => {

            });

        });
    }

    stop() {
        // can we stop it once running?
    }

    use() {

    }

    _init() {
        this._static = this._static.concat(this._theme.static());
        this._engine.setGlobal('env', {
            builder: true,
        });
    }

    _onRequest(req) {

        if (req.route.redirect) {
            req.route.context = {
                redirectUrl: req.route.redirect
            };
            req.route.view = this._theme.redirectView();
        }

        if (req.route.static) {
            const staticPath = _.isFunction(req.route.static) ? req.route.static(req.params, this._app) : req.route.static;
            return this._copy(staticPath, req.url);
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

            this._render(req.route.view, context)
                .then(this._write)
                .then(() => {
                    self.emit('exported', req);
                    Log.debug(`Exported '${req.url}' ==> '${dest}'`);
                    this._updateProgress();
                })
                .catch(err => this._onError(err, req));
        }

    }

    _onError(err, req) {
        this._errorCount++;
        this.emit('error', new Error(`Failed to export url ${req.url} - ${err.message}`));
        return this._render(this._theme.errorView(), { error: err }).then(this._write).catch(err => {
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

    _copy(source, dest) {
        dest = _.trimEnd(Path.join(this._config.dest, dest), Path.sep);
        source = Path.resolve(source);
        this._jobsCount++;
        return fs.copyAsync(source, dest, {
            clobber: true,
        }).then(() => {
            this._updateProgress();
            Log.debug(`Copied '${source}' ==> '${dest}'`);
        }).catch(e => {
            Log.debug(`Error copying '${source}' ==> '${dest}'`);
            this._errorCount++;
        });
    }

    _write(contents, dest) {
        dest = _.trimEnd(Path.join(this._config.dest, dest), Path.sep);
        const pathInfo = Path.parse(savePath);
        return fs.ensureDirAsync(pathInfo.dir).then(() => fs.writeFileAsync(dest, contents));
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
        return {
            headers: {},
            query: {},
            url: url,
            segments: _.compact(url.split('/')),
            params: params,
            path: url,
            error: null,
            errorStatus: null,
            route: null,
        };
    }

};
