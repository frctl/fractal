'use strict';

const marked = require('marked');
const _ = require('lodash');
const highlighter = require('./highlighter');
const renderer = new marked.Renderer();

renderer.code = function (code, lang, escaped) {
    const output = highlighter(code, lang);
    if (output != null) {
        code = output;
    }
    if (!lang) {
        return `<code><pre>${code}</pre></code>`;
    }
    return `<code class="${this.options.langPrefix}${escape(lang, true)}"><pre>${code}</pre></code>`;
};

/*
 * Export the markdown parser.
 */

module.exports = function markdown(content, mdConfig) {
    mdConfig = (mdConfig && _.isObject(mdConfig)) ? mdConfig : {};
    mdConfig.renderer = renderer;

    return marked(_.toString(content), mdConfig);
};

module.exports.toc = function (content, maxDepth, mdConfig) {
    maxDepth = maxDepth || 6;
    mdConfig = (mdConfig && _.isObject(mdConfig)) ? mdConfig : {};
    mdConfig.renderer = renderer;

    const tokens = marked.lexer(_.toString(content));

    return tokens.filter(token => {
        return token.type === 'heading' && token.depth <= maxDepth;
    }).map(token => {
        token.id = token.text.toLowerCase().replace(/[^\w]+/g, '-');
        return token;
    });
};
