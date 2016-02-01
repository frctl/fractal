'use strict';

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

    set(key, val) {
        configs.set(key, val);
        return this;
    },

    get(key) {
        return configs.get(key);
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
        opts.path = path;
        opts.handle = opts.handle || path;
        routes.set(opts.handle, opts);
        return this;
    },

    routes(){
        return Array.from(routes.values());
    },

    export(callback) {
        exporter = callback;
        return this;
    },

};
