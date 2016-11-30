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
        this._targets = [];
        this._throttle = require('throat')(Promise)(config.concurrency || 100);
        this._errorCount = 0;
        this._jobsCount = 0;
        this._progressCount = 0;
    }

    build() {
        return this._app.load().then(() => {
            try {
                this._validate();
            } catch (e) {
                return Promise.reject(e);
            }

            this._engine.setGlobal('env', {
                builder: true,
            });

            this.emit('start');

            const setup = fs.removeAsync(this._config.dest).then(() => fs.ensureDirAsync(this._config.dest));

            return setup.then(() => {
                this._addTargets();

                this.emit('ready', this);
                this._theme.emit('build', this, this._app);

                const copyStatic = this._theme.static().map(p => this._copyStatic(p.path, Path.join('/', p.mount)));

                const buildTargets = this._buildTargets();

                return Promise.all(copyStatic.concat(buildTargets));
            }).then(() => {
                const stats = {
                    errorCount: this._errorCount,
                };
                this.emit('end', stats);
                return stats;
            }).catch(e => {
                this.emit('error', e);
                throw e;
            }).finally(() => {
                this._errorCount = 0;
                this._jobsCount = 0;
                this._progressCount = 0;
            });
        });
    }

    targets() {
        return this._targets;
    }

    _copyStatic(source, dest) {
        dest = _.trimEnd(Path.join(this._config.dest, dest), '/');
        source = Path.resolve(source);
        this._jobsCount++;
        return fs.copyAsync(source, dest, {
            clobber: true,
        }).then(() => {
            this._updateProgress();
            Log.debug(`Copied static asset directory '${source}' ==> '${dest}'`);
        }).catch(e => {
            Log.debug(`Error copying static asset directory '${source}' ==> '${dest}'`);
            this._errorCount++;
        });
    }

    _updateProgress() {
        this._progressCount++;
        this.emit('progress', this._progressCount, this._jobsCount);
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
        this._theme.routes().filter(route => route.view || route.static).forEach(route => {
            try {
                if (route.params) {
                    const params = _.isFunction(route.params) ? route.params(this._app) : [].concat(route.params);
                    for (const p of params) {
                        this.addRoute(route.handle, p);
                    }
                } else {
                    this.addRoute(route.handle);
                }
            } catch (e) {
                throw new Error(`Could not add route '${route.path}' to builder: ${e.message}`);
            }
        });
    }

    _buildTargets() {
        const self = this;
        const ext = this._app.web.get('builder.ext');
        return this._targets.map(target => {
            const savePath = Path.join(this._config.dest, target.url) + (target.url == '/' ? `index${ext}` : ext);
            const pathInfo = Path.parse(savePath);
            this._jobsCount++;
            return this._throttle(() => {
                if (target.route.static) {
                    const staticPath = _.isFunction(target.route.static) ? target.route.static(target.params, this._app) : target.route.static;
                    const dest = Path.join(this._config.dest, unescape(target.url));

                    return fs.copyAsync(unescape(staticPath), dest, {
                        clobber: true,
                    }).then(() => {
                        this._updateProgress();
                    }).catch(e => {
                        Log.debug(`Error copying static asset '${staticPath}' ==> '${dest}'`);
                        this._errorCount++;
                    });
                }

                return fs.ensureDirAsync(pathInfo.dir).then(() => {
                    function write(html) {
                        return fs.writeFileAsync(savePath, html).then(() => {
                            self.emit('exported', target);
                            Log.debug(`Exported '${target.url}' ==> '${savePath}'`);
                        });
                    }

                    const context = target.route.context || {};
                    context.request = this._fakeRequest(target);
                    context.renderEnv = {
                        request: context.request,
                        builder: true,
                        server: false,
                    };

                    return this._engine.render(target.route.view, context).then(html => write(html)).catch(err => {
                        this._errorCount++;
                        this.emit('error', new Error(`Failed to export url ${target.url} - ${err.message}`));

                        return this._engine.render(this._theme.errorView(), { error: err }).then(html => write(html));
                    }).catch(err => {
                        this.emit('error', err);
                    });
                }).then(() => {
                    this._updateProgress();
                });
            });
        });
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

    _fakeRequest(target) {
        return {
            headers: {},
            query: {},
            url: target.url,
            segments: _.compact(target.url.split('/')),
            params: target.params,
            path: target.url,
            error: null,
            errorStatus: null,
            route: target.route,
        };
    }

};
