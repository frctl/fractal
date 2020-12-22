'use strict';

const _ = require('lodash');
const { pathToRegexp, compile } = require('path-to-regexp');
const mix = require('@frctl/core').mixins.mix;
const Configurable = require('@frctl/core').mixins.configurable;
const Emitter = require('@frctl/core').mixins.emitter;

module.exports = class Theme extends mix(Configurable, Emitter) {
    constructor(viewPaths, options) {
        super();

        this.options = this.config.bind(this);
        this.setOption = this.set.bind(this);
        this.getOption = this.get.bind(this);

        this.options(options || {});

        this._staticPaths = new Set();
        this._routes = new Map();
        this._resolvers = {};
        this._builder = null;
        this._views = [];

        this._filters = [];
        this._extensions = [];
        this._globals = {};

        this._errorView = {};
        this._redirectView = {};

        this.addLoadPath(viewPaths);
        this.setErrorView('__system/error.nunj');
        this.setRedirectView('__system/redirect.nunj');
    }

    addLoadPath(path) {
        path = [].concat(path);
        this._views = _.uniq(path.concat(this._views));
        return this;
    }

    loadPaths() {
        return this._views;
    }

    setErrorView(view) {
        this._errorView = view;
        return this;
    }

    errorView() {
        return this._errorView;
    }

    setRedirectView(view) {
        this._redirectView = view;
        return this;
    }

    redirectView() {
        return this._redirectView;
    }

    addStatic(path, mount) {
        for (const s of this._staticPaths) {
            if (path === s.path) {
                return;
            }
        }
        this._staticPaths.add({
            path: path,
            mount: mount,
        });
        return this;
    }

    static() {
        return Array.from(this._staticPaths.values());
    }

    addRoute(path, opts, resolvers) {
        const keys = [];
        opts.path = path;
        opts.handle = opts.handle || path;
        opts.matcher = pathToRegexp(path, keys);
        this.addResolver(opts.handle, resolvers || null);
        // pathToRegexp mutates keys variable
        opts.keys = keys;
        this._routes.set(opts.handle, _.clone(opts));
        return this;
    }

    addResolver(handle, resolver) {
        _.set(this._resolvers, handle, [].concat(resolver));
        return this;
    }

    routes() {
        return Array.from(this._routes.values());
    }

    resolvers() {
        return this._resolvers;
    }

    matchRoute(urlPath) {
        for (const route of this._routes.values()) {
            const match = route.matcher.exec(urlPath);
            if (match) {
                match.shift();
                const params = {};
                for (let i = 0; i < route.keys.length; i++) {
                    params[route.keys[i].name] = match[i];
                }
                return {
                    route: route,
                    params: params,
                };
            }
        }
        if (urlPath === '/') {
            return {
                route: {
                    handle: '__system-index',
                    view: '__system/index.nunj',
                },
                params: {},
            };
        }
        return false;
    }

    urlFromRoute(handle, params, noRedirect) {
        const route = this._routes.get(handle);
        if (route) {
            if (!noRedirect && route.redirect) {
                return route.redirect;
            }
            const compiler = compile(route.path);
            return cleanUrlPath(compiler(params));
        }
        return null;
    }
};

function cleanUrlPath(urlPath) {
    return urlPath.replace(/%2F/g, '/');
}
