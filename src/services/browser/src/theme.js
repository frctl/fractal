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
        return this.set('name', name);
    },

    version(version) {
        return this.set('version', version);
    },

    root(path){
        if (arguments.length === 0) {
            return this.get('root') || '';
        }
        return this.set('root', path);
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

    export(callback) {
        exporter = callback;
        return this;
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
