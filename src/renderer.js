var Handlebars  = require('handlebars');
var promise     = require("bluebird");
var beautifyJS  = require('js-beautify').js;
var beautifyCSS = require('js-beautify').css;
var beautifyHTML = require('js-beautify').html;

var fractal     = require('../fractal');
var partials    = null;

var htmlStyle = {
    "preserve_newlines": false,
    "indent_size": 4
};

module.exports = {

    registerPartials: function(){
        // TODO: cache partial registration, add events to listen for component tree changes and refresh
        return fractal.getSources().then(function(sources){
            var comps = []
            sources.components.each(function(item){
                if (item.type === 'component') {
                    comps.push(item.getTemplateMarkup().then(function(markup){
                        return {
                            id: item.id,
                            path: item.path,
                            markup: markup
                        };
                    }));
                } 
            });
            return promise.all(comps).then(function(comps){
                comps.forEach(function(comp){
                    Handlebars.registerPartial(comp.id, comp.markup);
                    Handlebars.registerPartial(comp.path, comp.markup);    
                });
            });
        });
    },

    render: function(component, variant, withoutLayout){       
        
        var templateMarkup  = component.getTemplateMarkup();
        var layoutMarkup    = withoutLayout ? null : component.getLayoutMarkup();
        var partials        = this.registerPartials();
        return promise.join(templateMarkup, layoutMarkup, partials, function(tpl, layout, reg){
            var compiled = Handlebars.compile(tpl);
            var output = beautifyHTML(compiled(component.getPreviewData(variant)), htmlStyle);
            if (layout) {
                var layout = Handlebars.compile(layout);
                output = layout({
                    "content": output
                });
            }
            return output;
        });
    }

};