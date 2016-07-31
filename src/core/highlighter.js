'use strict';

const HighlightJs = require('highlight.js');
const _ = require('lodash');

const langMap = new Map([
    ['nunjucks', 'django'],
    ['nunj', 'django'],
]);

module.exports = function highlighter(content, lang) {
    content = _.toString(content || '');
    lang = langMap.get(lang) || lang;
    lang = lang ? lang.toLowerCase() : lang;
    try {
        return lang ? HighlightJs.highlight(lang, content).value : HighlightJs.highlightAuto(content).value;
    } catch (e) {
        return HighlightJs.highlightAuto(content).value;
    }
};
