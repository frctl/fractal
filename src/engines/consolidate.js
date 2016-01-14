/**
 * Module dependencies.
 */

var consolidate = require('consolidate');
var path        = require('path');
var _           = require('lodash');

module.exports = {

    partials: {},

    config: null,

    init: function(config){
        this.config = config;
    },

    registerViews: function(views) {
        var self = this;
        views.forEach(function(view){
            self.partials[view.handle] = view.path;
            if (view.alias) {
                self.partials[view.alias] = view.path;
            }
        });
    },

    render: function(str, context, meta) {
        context.partials = {};
        var tplPath = meta.path;
        // consolidate needs some skanky partial path rewriting
        // to make them relative to the template being requested :-(
        _.each(this.partials, function(partialPath, partialKey){
            if (tplPath != partialPath) {
                var relPath = path.relative(tplPath, partialPath).replace('../', '');
                var parts = path.parse(relPath);
                if ( !_.isEmpty(parts.name) && (path.extname(tplPath) == path.extname(partialPath))) {
                    context.partials[partialKey] = path.join(parts.dir, parts.name);
                }
            }
        });
        return consolidate[this.config.name](meta.path, context);
    }

};
