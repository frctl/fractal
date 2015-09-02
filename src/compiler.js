var Handlebars  = require('handlebars');
var promise     = require('bluebird');
var swag        = require('swag');
var _           = require('lodash');

var fractal     = require('../fractal');
var partials    = [];

var FractalCompiler = function(){
    Handlebars.JavaScriptCompiler.apply(this, arguments);
};
FractalCompiler.prototype = Object.create(Handlebars.JavaScriptCompiler.prototype);
FractalCompiler.prototype.nameLookup = function(parent, name, type) {
    if (type === 'partial') {
        // convert name to ID
        var searches = ['path', 'fsPath'];
        for (var i = 0; i < searches.length; i++) {
            var component = _.find(partials, searches[i], name);
            if (component) {
                name = component.id;
                break;
            }
        };
    }
    return Handlebars.JavaScriptCompiler.prototype.nameLookup.call(this, parent, name, type);
};
hbs = Handlebars.create();
hbs.JavaScriptCompiler = FractalCompiler;
swag.registerHelpers(hbs);

var compiler = null;

module.exports = {

    getCompiler: function(){
        if (compiler !== null) {
            return promise.resolve(compiler);
        }
        return fractal.getSources().then(function(sources){
            partials = [];
            sources.components.each(function(item){
                if (item.type === 'component') {
                    hbs.registerPartial(item.id, item.getTemplateMarkup().value());
                    partials.push(item);
                } 
            });
            compiler = hbs;
            return compiler;
        });
    },

    compile: function(content) {
        return this.getCompiler().then(function(c){
            return c.compile(content);
        });
    }
}