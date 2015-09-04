var _           = require('lodash');
var promise     = require("bluebird");
var beautifyJS  = require('js-beautify').js;
var beautifyCSS = require('js-beautify').css;
var beautifyHTML = require('js-beautify').html;
var Highlights  = require('highlights');
var marked = require('marked');

var fractal     = require('../fractal');
var compiler    = require('./compiler');

var htmlStyle = {
    "preserve_newlines": true,
    "indent_size": 4
};

var highlighter = new Highlights();
highlighter.requireGrammarsSync({
    modulePath: require.resolve('atom-handlebars/package.json')
});

marked.setOptions({
    highlight: function (code, lang) {
        return module.exports.highlight(code, lang);
    }
});

var renderer = new marked.Renderer();

renderer.code = function(code, lang, escaped) {
    var highlighted = false;
    if (this.options.highlight) {
        var out = this.options.highlight(code, lang);
        if (out != null && out !== code) {
            escaped = true;
            code = out;
            highlighted = true;
        }
    }
    var code = escaped ? code : escape(code, true);
    if (!lang) {
        return highlighted ? code : '<pre><code>' + code + '\n</code></pre>';
    }
    return highlighted ? code : '<pre><code class="'
        + this.options.langPrefix
        + escape(lang, true)
        + '">'
        + code
        + '\n</code></pre>\n';
};

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
                        output += "<!-- " + v.title + " -->\n" + compiled(component.getTemplateContext(v.name)) + "\n";
                    });
                } else {
                    output = compiled(component.getTemplateContext(variant));
                }
                return beautifyHTML(output.trim(), htmlStyle);
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

    stringify: function(content){
        return JSON.stringify(content, null, 4);
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
            case 'css':
                scopeName = 'source.css';
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
    },

    markdown: function(str){
        return marked(str.toString(), {renderer: renderer});
    }

};

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}