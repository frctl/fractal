var Handlebars  = require('handlebars');
var _           = require('lodash');
var promise     = require("bluebird");
var beautifyJS  = require('js-beautify').js;
var beautifyCSS = require('js-beautify').css;
var beautifyHTML = require('js-beautify').html;
var Highlights  = require('highlights');

var fractal     = require('../fractal');
var partials    = null;

var htmlStyle = {
    "preserve_newlines": false,
    "indent_size": 4
};

var highlighter = new Highlights();
highlighter.requireGrammarsSync({
    modulePath: require.resolve('atom-handlebars/package.json')
});

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
            var output = beautifyHTML(compiled(component.getTemplateContext(variant)), htmlStyle);
            if (layout) {
                var layout = Handlebars.compile(layout);
                output = layout({
                    "content": output
                });
            }
            return output;
        });
    },

    highlight: function(content, scope){
        var scopeName = 'text.html.basic';
        if (!content) {
            return null;
        }
        switch(scope) {
            case 'json':
                scopeName = 'source.json';
                if (!_.isString(content)) {
                    content = JSON.stringify(content, null, 4);
                }
                break;
            case 'js': 
                scopeName = 'source.js';
                break;
            case 'scss':
                scopeName = 'source.css.scss';
                break;
            case 'hbs':
                scopeName = 'text.html.handlebars';
                break;
        }
        if (!_.isString(content)) {
            content = content.toString();
        }
        return highlighter.highlightSync({
            fileContents: content,
            scopeName: scopeName
        });
    }

};