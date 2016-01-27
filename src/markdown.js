'use strict';

const marked      = require('marked');
const _           = require('lodash');
const highlighter = require('./highlighter');

marked.setOptions({
    highlight: (code, lang) => highlighter(code, lang)
});

const renderer = new marked.Renderer();
renderer.code = function(code, lang, escaped) {
    const highlighted = false;
    if (this.options.highlight) {
        const out = this.options.highlight(code, lang);
        if (out != null && out !== code) {
            escaped = true;
            code = out;
            highlighted = true;
        }
    }
    const code = escaped ? code : escape(code, true);
    if (!lang) {
        return `<code><pre>${code}\n</pre></code>`;
    }
    return `<code class="${this.options.langPrefix}${escape(lang, true)}"><pre>${code}\n</pre></code>\n`;
};

/*
 * Export the markdown parser.
 */

module.exports = function markdown(content){

    return marked(content, {renderer: renderer});

};
