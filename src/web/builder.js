'use strict';

const Promise = require('bluebird');
const Path    = require('path');
const co      = require('co');
const _       = require('lodash');
const fs      = Promise.promisifyAll(require('fs-extra'));
const Log     = require('../core/log');
const mix     = require('../core/mixins/mix');
const Emitter = require('../core/mixins/emitter');

module.exports = class Builder extends mix(Emitter) {

    constructor(theme, config, app) {
        super(app);
        this._app      = app;
        this._config   = config;
        this._theme    = theme;
        this._targets  = [];
        this._throttle = require('throat')(Promise)(config.concurrency || 100);
        this._errorCount = 0;
    }

    build() {
        try {
            this._validate();
        } catch (e) {
            return Promise.reject(e);
        }

        this.emit('start');

        let setup = fs.removeAsync(this._config.dest).then(() => fs.ensureDirAsync(this._config.dest));

        return setup.then(() => {

            this._addTargets();

            this._theme.emit('build', this, this._app);

            let copyStatic = this._theme.static().map(p => this._copyStatic(p.path, p.mount));
            return Promise.all(copyStatic.concat(this._buildTargets()));
        }).then(() => {
            let stats = {
                errorCount: this._errorCount
            };
            this.emit('end', stats);
            return stats;
        }).catch(e => {
            this.emit('error', e);
            throw e;
        }).finally(() => {
            this._errorCount = 0;
        });
    }

    _copyStatic(source, dest) {
        dest = _.trimEnd(Path.join(this._config.dest, dest), '/');
        source = Path.resolve(source);
        return fs.copyAsync(source, dest, {
            clobber: true
        }).then(() => {
            Log.debug(`Copied static asset directory '${source}' ==> '${dest}'`);
        }).catch(e => {
            this._errorCount++;
        });
    }

    addRoute(name, params) {
        const url = this._theme.urlFromRoute(name, params, true);
        const route = _.clone(this._theme.matchRoute(url));
        if (route) {
            route.url = url;
            this._targets.push(route);
            return this;
        } else {
            Log.debug(`Could not add route '${name}' to builder - route not found.`);
        }
    }

    _addTargets() {
        this._theme.routes().forEach(route => {
            if (route.params && route.params.length) {
                for (let params of route.params) {
                    this.addRoute(route.handle, params);
                }
            } else {
                this.addRoute(route.handle);
            }
        });
    }

    _buildTargets() {
        const jobs = [];
        const web = {
            server: null,
            builder: {},
            request: {}
        };

        for (let target of this._targets) {
            const savePath = Path.join(this._config.dest, target.url) + (target.url == '/' ? 'index.html' : '.html');
            const pathInfo = Path.parse(savePath);
            const job = this._throttle(() => {

                return fs.ensureDirAsync(pathInfo.dir).then(() => {

                    web.request = this._fakeRequest(target);
                    this._theme.engine.setGlobal('web', web);

                    function write(html) {
                        return fs.writeFileAsync(savePath, html).then(() => Log.debug(`Exported '${target.url}' ==> '${savePath}'`));
                    }

                    return this._theme.render(target.route.view, target.route.context).then(html => write(html)).catch(e => {

                        Log.error(`Failed to export url ${target.url} - ${e.message}`);

                        this._errorCount++;
                        web.request.error = e;

                        return this._theme.render(this._theme.error().view, this._theme.error().context).then(html => write(html));
                    });

                });

            });
            jobs.push(job);
        }
        return jobs;
    }

    _validate() {
        if (!this._config.dest) {
            throw new Error('You need to specify a build destination in your configuration.');
        }
        for (let stat of this._theme.static()) {
            if (stat.path == this._theme.dest) {
                throw new Error(`Your build destination directory (${Path.resolve(stat.path)}) cannot be the same as any of your static assets directories.`);
            }
        }
    }

    _fakeRequest(target) {
        return {
            headers:     {},
            query:       {},
            url:         target.url,
            segments:    _.compact(target.url.split('/')),
            params:      target.params,
            path:        target.url,
            error:       null,
            errorStatus: null,
            route:       target.route,
        }
    }

}
