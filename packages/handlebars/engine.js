'use strict';

var Handlebars = require('handlebars');
var _          = require('lodash');

module.exports = {

    /**
     * Initialise the Handlebars instance.
     * Register any custom helpers and partials set in the config.
     */

    init: function(config){
        var extras = config.extend || {};
        _.each(extras.helpers || {}, function(helper, name){
            Handlebars.registerHelper(name, helper);
        });
        _.each(extras.partials || {}, function(partial, name){
            Handlebars.registerPartial(name, partial);
        });
    },

    /**
     * Register component view templates as partials.
     * Called every time the component file tree changes.
     */

    registerViews: function(views) {
        views.forEach(function(view){
            Handlebars.registerPartial(view.handle, view.content);
            if (view.alias) {
                Handlebars.registerPartial(view.alias, view.content);
            }
        });
    },

    /**
     * Render the component view contents.
     */

    render: function(str, context, meta) {
        var template = Handlebars.compile(str);
        return template(context);
    }

};
