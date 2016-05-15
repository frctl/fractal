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
    }

    build() {
        if (!this._validate()) {
            return Promise.reject(false);
        }

        this.emit('start');

        let setup = fs.removeAsync(this._config.dest).then(() => fs.ensureDirAsync(this._config.dest));
        let errorCount = 0;

        return setup.then(() => {
            this._theme.emit('build', this, this._app);
            let copyJobs = this._theme.static().map(p => this._copyStatic(p.path, p.mount));
            let routeJobs = this._buildRoutes();
            return Promise.join(copyJobs, routeJobs).catch(e => {
                errorCount++;
            });
        }).then(() => {
            let stats = {
                errorCount: errorCount
            };
            this.emit('end', stats);
            return stats;
        }).catch(e => {
            this.emit('error', e);
            throw e;
        });
    }

    _copyStatic(source, dest) {
        dest = _.trimEnd(Path.join(this._config.dest, dest), '/');
        source = Path.resolve(source);
        Log.debug(`Copying static asset directory '${source}' ==> '${dest}'`);
        return fs.copyAsync(source, dest, {
            clobber: true
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

    _buildRoutes() {
        const jobs = [];
        for (let target of this._targets) {
            const savePath = Path.join(this._config.dest, target.url, 'index.html');
            const pathInfo = Path.parse(savePath);
            const job = this._throttle(() => {
                return fs.ensureDirAsync(pathInfo.dir).then(() => {

                    this._theme.engine.setGlobal('web', {
                        server: null,
                        builder: {},
                        request: this._fakeRequest(target)
                    });

                    return this._theme.render(target.route.view, target.route.context).then(html => {
                        return fs.writeFileAsync(savePath, html).then(() => {
                            Log.debug(`Saved ${target.url} to ${savePath}`);
                        });
                    });

                }).catch(e => {
                    Log.error(`Failed to export url ${target.url} - ${e.message}`);
                    throw e;
                });
            });
            jobs.push(job);
        }
        return Promise.all(jobs);
    }

    _validate() {
        let ok = true;
        if (!this._config.dest) {
            Log.error('You need to specify a build destination in your configuration.');
            ok = false;
        }
        for (let stat of this._theme.static()) {
            if (stat.path == this._theme.dest) {
                Log.error(`Your build destination directory (${Path.resolve(stat.path)}) cannot be the same as any of your static assets directories.`);
                ok = false;
                break;
            }
        }
        return ok;
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
