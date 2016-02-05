'use strict';

var Handlebars = require('handlebars');
var _          = require('lodash');

module.exports = {

    defaults: {
        ext: '.hbs',
        name: 'handlebars'
    },

    /**
     * Extend the Handlebars instance.
     * Register any custom helpers and partials set in the config.
     */

    configure: function(config){
        const ext = config.extend || {}
        _.each(ext.helpers || {}, function(helper, name){
            Handlebars.registerHelper(name, helper);
        });
        _.each(ext.partials || {}, function(partial, name){
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
