'use strict';

var nunjucks      = require('nunjucks');
var _             = require('lodash');

var viewCache = {};

/**
 * Create a custom string loader and instantiate a new Nunjucks environment object with it.
 * We don't want to use the FileSystemLoader as we already have
 * the contents of all files cached in the component file tree.
 */

var StringLoader = nunjucks.Loader.extend({
    getSource: function(name) {
        var view = _.find(viewCache, function(view){
            return (view.handle === name || view.alias === name);
        });
        if (view) {
            return {
                src: view.content,
                path: view.path,
                noCache: true
            };
        }
        throw new Error('Partial template not found.');
    }
});

var nj = new nunjucks.Environment(new StringLoader(), {
    autoescape: false
});

module.exports = {

    defaults: {
        ext: ".nunjucks",
        name: "nunjucks"
    },

    /**
     * Register any custom filters, globals and extensions set in the config.
     */

    configure: function(config){
        var extras = config.extend || {};
        _.each(extras.filters || {}, function(filter, name){
            nj.addFilter(name, filter);
        });
        _.each(extras.extensions || {}, function(ext, name){
            nj.addExtension(name, ext);
        });
        _.each(extras.globals || {}, function(value, name){
            nj.addGlobal(name, value);
        });
    },

    /**
     * Update view file cache.
     * Called every time the component file tree changes.
     */

    registerViews: function(views) {
        viewCache = views;
    },

    /**
     * Render the component view contents.
     */

    render: function(str, context, meta) {
        return nj.renderString(str, context);
    }

};
