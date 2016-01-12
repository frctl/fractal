/**
 * Module dependencies.
 */

var Handlebars = require('handlebars');
var Promise    = require('bluebird');
var _          = require('lodash');

var partials = null;

module.exports = {

    addPartials: function(partials) {
        partials.forEach(function(partial){
            Handlebars.registerPartial(partial.handle, partial.content);
            if (partial.alias) {
                Handlebars.registerPartial(partial.alias, partial.content);
            }
        });
    },

    addGlobals: function(globals) {
        
    },

    addHelpers: function(helpers) {

    },

    render: function(str, context) {
        var template = Handlebars.compile(str);
        return template(context);
    }

};
