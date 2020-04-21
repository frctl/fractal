'use strict';

const HighlightJs = require('highlight.js');
const _ = require('lodash');

module.exports = function highlighter(content, lang) {
    content = _.toString(content || '');
    lang = lang ? lang.toLowerCase() : lang;
    try {
        return lang ? HighlightJs.highlight(lang, content).value : HighlightJs.highlightAuto(content).value;
    } catch (e) {
        return HighlightJs.highlightAuto(content).value;
    }
};
