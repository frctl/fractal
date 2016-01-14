/**
 * Module dependencies.
 */

var nunjucks      = require('nunjucks');
var _             = require('lodash');

var NotFoundError = require('../errors/notfound');

var viewCache = {};

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
        throw new NotFoundError('Partial template not found.');
    }
});

var nj = new nunjucks.Environment(new StringLoader(), {
    autoescape: false
});

module.exports = {

    init: function(config){
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

    registerViews: function(views) {
        viewCache = views;
    },

    render: function(str, context) {
        return nj.renderString(str, context);
    }

};
