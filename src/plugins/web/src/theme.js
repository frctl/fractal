'use strict';

const Path        = require('path');
const _           = require('lodash');
const pr          = require('path-to-regexp');

const configs     = new Map();
const routes      = new Map();
const staticPaths = new Set();
let exporter      = null;

module.exports = {

    name(name) {
        return arguments.length ? this.set('name', name) : this.get('name');
    },

    title(name) {
        return arguments.length ? this.set('title', name) : this.get('title');
    },

    version(version) {
        return arguments.length ? this.set('version', version) : this.get('version');
    },

    favicon(favicon) {
        return arguments.length ? this.set('favicon', favicon) : this.get('favicon');
    },

    root(path){
        return arguments.length ? this.set('root', path) : this.get('root') || '';
    },

    error(err){
        if (arguments.length === 0) {
            return this.get('error');
        }
        if (_.isString(err)) {
            err = {
                view: err
            }
        } else if (!err.view) {
            err = null;
        }
        err.context = err.context || {};
        return this.set('error', err);
    },

    views(path){
        if (arguments.length === 0) {
            return this.path(this.get('views') || 'views');
        }
        return this.set('views', path);
    },

    static(path, mount){
        if (arguments.length === 0) {
            return Array.from(staticPaths.values());
        }
        staticPaths.add({
            path: path,
            mount: mount
        });
    },

    route(path, opts) {
        let keys = [];
        opts.path = path;
        opts.handle = opts.handle || path;
        opts.matcher = pr(path, keys);
        routes.set(opts.handle, opts);
        return this;
    },

    routes(){
        return Array.from(routes.values());
    },

    matchRoute(urlPath){
        for (let route of routes.values()) {
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
    },

    urlFromRoute: function(handle, params){
        let route = routes.get(handle);
        if (route) {
            let compiler = pr.compile(route.path);
            return cleanUrlPath(compiler(params));
        }
        return null;
    },

    exporter(exp) {
        if (arguments.length) {
            exporter = exp;
            return this;
        }
        return exp;
    },

    path(path){
        return Path.join(this.root(), path);
    },

    set(key, val) {
        configs.set(key, val);
        return this;
    },

    get(key) {
        return configs.get(key);
    }
};

function cleanUrlPath(urlPath){
    return urlPath.replace(/\%2F/g, '/');
}
