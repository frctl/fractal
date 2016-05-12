'use strict';

const _            = require('lodash');
const Path         = require('path');
const Promise      = require('bluebird');
const fs           = Promise.promisifyAll(require('fs-extra'));
const pr           = require('path-to-regexp');
const mix          = require('../core/mixins/mix');
const Configurable = require('../core/mixins/configurable');

module.exports = class Theme extends mix(Configurable) {

    constructor(config){
        super();

        this.options = this.config.bind(this);
        this.setOption = this.set.bind(this);
        this.getOption = this.get.bind(this);

        this._staticPaths   = new Set();
        this._routes        = new Map();
        this._builder       = null;
        this._errorView     = null;
        this._viewsDir      = config.views || null;

        if (config.static) {
            this.static(config.static.path || './', config.static.mount || '/');
        }
        if (config.options) {
            this.options(config.options);
        }
        if (config.error) {
            this.error(config.error);
        }
    }

    error(err) {
        if (!arguments.length) {
            return this._errorView;
        }
        if (_.isString(err)) {
            err = {
                view: err
            };
        } else if (!err.view) {
            err = null;
        }
        err.context = err.context || {};
        return this._errorView = err;
    }

    static(path, mount) {
        if (arguments.length === 0) {
            return Array.from(this._staticPaths.values());
        }
        this._staticPaths.add({
            path: path,
            mount: mount
        });
    }

    route(path, opts) {
        let keys = [];
        opts.path = path;
        opts.handle = opts.handle || path;
        opts.matcher = pr(path, keys);
        this._routes.set(opts.handle, opts);
        return this;
    }

    routes() {
        return Array.from(this._routes.values());
    }

    matchRoute(urlPath) {
        for (let route of this._routes.values()) {
            let match = route.matcher.exec(urlPath);
            if (match) {
                match.shift();
                let params = {};
                for (let i = 0; i < route.matcher.keys.length; i++) {
                    params[route.matcher.keys[i].name] = match[i];
                }
                return {
                    route: route,
                    params: params
                };
            }
        }
        return false;
    }

    urlFromRoute(handle, params, raw) {
        let route = this._routes.get(handle);
        if (route) {
            let compiler = pr.compile(route.path);
            let url = cleanUrlPath(compiler(params));
            return raw ? url : this.urlPath(url);
        }
        return null;
    }

    urlPath(path) {
        path = path.replace(/^\//, '');
        if (this.rootPath) {
            const base = this.rootPath.replace(/^\//, '').replace(/\/$/, '');
            return `/${base}/${path}`;
        }
        return `/${path}`;
    }

    staticUrlPath(path) {
        return path;
    }

    onBuild(buildCallback) {
        this._builder = buildCallback;
    }

    hasBuilder(){
        return !! this._builder;
    }

}

function cleanUrlPath(urlPath) {
    return urlPath.replace(/\%2F/g, '/');
}
