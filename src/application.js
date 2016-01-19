/**
 * Module dependencies.
 */

var EventEmitter = require('events').EventEmitter;
var _            = require('lodash');
var chokidar     = require('chokidar');
var Promise      = require('bluebird');
var util         = require('util');
var path         = require('path');

var fractal      = require('./fractal');
var theme        = require('./theme/theme');

/*
 * Cache some values
 */

var components = null;
var pages = null;
var themePages = null;
var monitors = [];

module.exports = {

    events: new EventEmitter(),

    /*
     * Return a collection of components based on the config path.
     *
     * @api public
     */

    getComponents: function(){
        if (!components) {
            if (this.get('components.path')) {
                var self = this;
                components = require('./sources/components').build();
                this.createMonitor(this.get('components.path'), function(event, path) {
                    // TODO: make component tree rebuilding more refined rather than all or nothing.
                    components = null;
                    self.events.emit("component-tree-changed");
                });
            } else {
                components = require('./sources/components').emptySource();
            }
        }
        return components;
    },

    /*
     * Return a collection of pages based on the config path.
     *
     * @api public
     */

    getPages: function(){
        if (!pages) {
            if (this.get('pages.path')) {
                var self = this;
                themePages = this.getThemePages();
                pages = require('./sources/pages').build(this.get('pages.path'));
                pages = Promise.join(pages, themePages, function(pages, themePages){
                    pages.setDefaults(themePages);
                    return pages;
                });
                this.createMonitor(this.get('pages.path'), function(event, path) {
                    // TODO: make page tree rebuilding more refined rather than all or nothing.
                    pages = null;
                    self.events.emit("page-tree-changed");
                });
            } else {
                pages = this.getThemePages();
            }
        }
        return pages;
    },

    /*
     * Return a collection of default, theme-provided pages for fallbacks
     *
     * @api public
     */

    getThemePages: function(){
        if (!themePages) {
            themePages = require('./sources/pages').build(theme.pagesPath);
        }
        return themePages;
    },

    /*
     * Return the set of available statuses.
     *
     * @api public
     */

    getStatuses: function(){
        return this.get('status.options');
    },

    /*
     * Return a status object by key, or the default if not found.
     *
     * @api public
     */

    getStatus: function(status){
        var statuses = this.getStatuses();
        var status = status || this.get('status.default');
        return _.find(statuses, 'name', status) || _.find(statuses, 'name', this.get('status.default'));
    },

    /*
     * Create a directory monitor with callback.
     *
     * @api private
     */

    createMonitor: function(path, callback){
        var monitor = chokidar.watch(path, {
            ignored: /[\/\\]\./
        });
        monitor.on('ready', function(){
            monitor.on('all', callback);
        });
        monitors[path] = monitor;
    },

};

// Mix in fractal config methods for convenience

['get','set','enabled','disabled','enable','disable'].forEach(function(key){
    module.exports[key] = fractal[key];
});
