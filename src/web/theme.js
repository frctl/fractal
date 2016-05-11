'use strict';

const mix          = require('../core/mixins/mix');
const Configurable = require('../core/mixins/configurable');

module.exports = class Theme extends mix(Configurable) {

    constructor(theme, app){
        super(app);
        this._staticPaths   = new Set();
        this._routes        = new Map();
        this._builder       = null;
        this._errorTemplate = null;
    }
    //
    // static(path, mount) {
    //     if (arguments.length === 0) {
    //         return Array.from(this._staticPaths.values());
    //     }
    //     this._staticPaths.add({
    //         path: path,
    //         mount: mount
    //     });
    // }
    //
    // route(path, opts) {
    //     let keys = [];
    //     opts.path = path;
    //     opts.handle = opts.handle || path;
    //     opts.matcher = pr(path, keys);
    //     this._routes.set(opts.handle, opts);
    //     return this;
    // }
    //
    // routes() {
    //     return Array.from(this._routes.values());
    // }
    //
    // matchRoute(urlPath) {
    //     for (let route of this._routes.values()) {
    //         let match = route.matcher.exec(urlPath);
    //         if (match) {
    //             match.shift();
    //             let params = {};
    //             for (let i = 0; i < route.matcher.keys.length; i++) {
    //                 params[route.matcher.keys[i].name] = match[i];
    //             }
    //             return {
    //                 route: route,
    //                 params: params
    //             };
    //         }
    //     }
    //     return false;
    // }
    //
    // urlFromRoute: function (handle, params, raw) {
    //     let route = this._routes.get(handle);
    //     if (route) {
    //         let compiler = pr.compile(route.path);
    //         let url = cleanUrlPath(compiler(params));
    //         return raw ? url : this.urlPath(url);
    //     }
    //     return null;
    // }
    //
    // urlPath(path) {
    //     path = path.replace(/^\//, '');
    //     if (this.rootPath) {
    //         const base = this.rootPath.replace(/^\//, '').replace(/\/$/, '');
    //         return `/${base}/${path}`;
    //     }
    //     return `/${path}`;
    // }
    //
    // staticUrlPath(path) {
    //     return path;
    // }
    //
    // set builder(builder) {
    //     this._builder = builder;
    // }
    //
    // get builder() {
    //     return this._builder;
    // }
    //
    // hasBuilder(){
    //     return !! this._builder;
    // }

}

function cleanUrlPath(urlPath) {
    return urlPath.replace(/\%2F/g, '/');
}
