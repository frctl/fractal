'use strict';

const Path     = require('path');
const Promise  = require('bluebird');
const _        = require('lodash');
const fs       = Promise.promisifyAll(require('fs-extra'));
const pr       = require('path-to-regexp');

module.exports = function(){

    return {

        name:           null,
        title:          null,
        version:        null,
        favicon:        null,
        views:          null,
        build:          null,
        globals:        {},
        rootPath:       null,

        _config:         null,
        _defaults:       {},
        _routes:        new Map(),
        _staticPaths:   new Set(),
        _builder:       null,
        _errorTemplate: null,

        set error(err) {
            if (_.isString(err)) {
                err = {
                    view: err
                };
            } else if (!err.view) {
                err = null;
            }
            err.context = err.context || {};
            return this._errorTemplate = err;
        },

        get error() {
            return this._errorTemplate;
        },

        get config() {
            if (this._config) {
                return _.defaultsDeep(this._config, this._defaults);
            }
            return this._defaults;
        },

        // config(path, getter) {
        //     if (arguments.length == 1) {
        //         const result = _.get(this._config, path, _.get(this.defaults, path));
        //         return (_.isFunction(result)) ? result() : result;
        //     } else if (arguments.length == 2) {
        //         _.set(this._config, path, getter);
        //         return this;
        //     }
        // },

        config(conf) {
            this._config = conf;
        },

        defaults(def) {
            this._defaults = def;
            return this;
        },

        static(path, mount) {
            if (arguments.length === 0) {
                return Array.from(this._staticPaths.values());
            }
            this._staticPaths.add({
                path: path,
                mount: mount
            });
        },

        route(path, opts) {
            let keys = [];
            opts.path = path;
            opts.handle = opts.handle || path;
            opts.matcher = pr(path, keys);
            this._routes.set(opts.handle, opts);
            return this;
        },

        routes() {
            return Array.from(this._routes.values());
        },

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
        },

        urlFromRoute: function (handle, params, raw) {
            let route = this._routes.get(handle);
            if (route) {
                let compiler = pr.compile(route.path);
                let url = cleanUrlPath(compiler(params));
                return raw ? url : this.urlPath(url);
            }
            return null;
        },

        urlPath: function(path){
            path = path.replace(/^\//, '');
            if (this.rootPath) {
                const base = this.rootPath.replace(/^\//, '').replace(/\/$/, '');
                return `/${base}/${path}`;
            }
            return `/${path}`;
        },

        staticUrlPath: function(path){

            return path;
        },

        set builder(builder) {
            this._builder = builder;
        },

        get builder() {
            return this._builder;
        },

        hasBuilder(){
            return !! this._builder;
        }

    }

    function cleanUrlPath(urlPath) {
        return urlPath.replace(/\%2F/g, '/');
    }
};
