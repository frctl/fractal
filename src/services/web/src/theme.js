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

    version(version) {
        return arguments.length ? this.set('version', version) : this.get('version');
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

    // routeFromPath: function(urlPath){
    //     urlPath = '/' + cleanUrlPath(urlPath.replace(/^\//,''));
    //     for (let i = 0; i < config.routes.length; i++) {
    //         let route = config.routes[i];
    //         try {
    //             let re = pathToRegexp(route.path);
    //             if (re.test(urlPath)) {
    //                 return route;
    //             }
    //         } catch(e){
    //             logger.warn(e.message);
    //         }
    //     }
    //     return null;
    // },

    urlFromRoute: function(handle, params){
        let route = routes.get(handle);
        if (route) {
            let compiler = pr.compile(route.path);
            return compiler(params);
        }
        return null;
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
