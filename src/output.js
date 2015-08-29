var _           = require('lodash');
var promise     = require("bluebird");
var beautifyJS  = require('js-beautify').js;
var beautifyCSS = require('js-beautify').css;
var beautifyHTML = require('js-beautify').html;
var Highlights  = require('highlights');

var fractal     = require('../fractal');
var compiler    = require('./compiler');

var htmlStyle = {
    "preserve_newlines": false,
    "indent_size": 4
};

var highlighter = new Highlights();
highlighter.requireGrammarsSync({
    modulePath: require.resolve('atom-handlebars/package.json')
});

module.exports = {
    
    renderComponent: function(component, variant){
        var templateMarkup = component.getTemplateMarkup();
        return promise.join(templateMarkup, function(tpl){
            return compiler.compile(tpl).then(function(compiled){
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
        });
    },

    wrapWithLayout: function(contentMarkup, layoutMarkup){
        return promise.join(contentMarkup, layoutMarkup, function(content, layout){
            return compiler.compile(layout).then(function(compiled){
                return compiled({
                    "content": content
                });    
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