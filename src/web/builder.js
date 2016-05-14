'use strict';

const Promise = require('bluebird');
const Path    = require('path');
const co      = require('co');
const _       = require('lodash');
const throat  = require('throat')(Promise)
const fs      = Promise.promisifyAll(require('fs-extra'));
const Log     = require('../core/log');
const mix     = require('../core/mixins/mix');
const Emitter = require('../core/mixins/emitter');

module.exports = class Builder extends mix(Emitter) {

    constructor(theme, config, app) {
        super(app);
        this._app     = app;
        this._config  = config;
        this._theme   = theme;
        this._targets = [];
    }

    start() {
        if (!this._validate()) {
            return Promise.reject(false);
        }

        this.emit('start');

        let setup = fs.removeAsync(this._config.dest).then(() => fs.ensureDirAsync(this._config.dest));

        return setup.then(() => {
            this._theme.emit('build', this, this._app);
            let jobs = this._theme.static().map(p => this._copyStatic(p.path, p.mount));
            return Promise.all(jobs);
        });
    }

    stop() {

    }

    _copyStatic(source, dest) {
        dest = _.trimEnd(Path.join(this._config.dest, dest), '/');
        source = Path.resolve(source);
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
            isPjax:      false,
            segments:    _.compact(target.url.split('/')),
            params:      target.params,
            path:        target.url,
            error:       null,
            errorStatus: null,
            route:       target.route,
        }
    }

}
