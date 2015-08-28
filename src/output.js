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

    renderComponent: function(component, variant){
        var partials        = this.registerPartials();
        var templateMarkup  = component.getTemplateMarkup();
        return promise.join(templateMarkup, partials, function(tpl){
            var compiled = Handlebars.compile(tpl);
            var output = '';
            if (_.isArray(variant)) {
                var allVariants = component.getVariants();
                variant.forEach(function(v){
                    var v = _.find(allVariants, 'name', v);
                    output += "<!-- " + v.title + " -->\n\n" + compiled(component.getTemplateContext(v.name)) + "\n\n";
                });
            } else {
                output = compiled(component.getTemplateContext(variant));
            }
            return beautifyHTML(output, htmlStyle);
        });
    },

    wrapWithLayout: function(contentMarkup, layoutMarkup){
        return promise.join(contentMarkup, layoutMarkup, function(content, layout){
            var compiled = Handlebars.compile(layout);
            return compiled({
                "content": content
            });
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