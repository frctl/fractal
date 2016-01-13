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

    registerExtras: function(extras) {
        _.each(extras.helpers || {}, function(helper, key){
            Handlebars.registerHelper(key, helper);
        });
        _.each(extras.partials || {}, function(partial, key){
            Handlebars.registerPartial(key, partial);
        });
    },

    render: function(str, context) {
        var template = Handlebars.compile(str);
        return template(context);
    }

};
