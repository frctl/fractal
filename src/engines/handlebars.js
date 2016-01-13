/**
 * Module dependencies.
 */

var Handlebars = require('handlebars');
var _          = require('lodash');

module.exports = {

    registerViews: function(views) {
        views.forEach(function(view){
            Handlebars.registerPartial(view.handle, view.content);
            if (view.alias) {
                Handlebars.registerPartial(view.alias, view.content);
            }
        });
    },

    extend: function(extras) {
        _.each(extras.helpers || {}, function(helper, name){
            Handlebars.registerHelper(name, helper);
        });
        _.each(extras.partials || {}, function(partial, name){
            Handlebars.registerPartial(name, partial);
        });
    },

    render: function(str, context) {
        var template = Handlebars.compile(str);
        return template(context);
    }

};
