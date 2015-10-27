/**
 * Module dependencies.
 */

var marked      = require('marked');
var _           = require('lodash');

var highlighter = require('./highlighter');

marked.setOptions({
    highlight: function (code, lang) {
        return highlighter(code, lang);
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
        return '<code><pre>' + code + '\n</pre></code>';
        // return highlighted ? code : '<code><pre>' + code + '\n</pre></code>';
    }
    return '<code class="'
        + this.options.langPrefix
        + escape(lang, true)
        + '"><pre>'
        + code
        + '\n</pre></code>\n';
};

/*
 * Export the markdown parser.
 */

module.exports = function markdown(content){

    return marked(content, {renderer: renderer});

};