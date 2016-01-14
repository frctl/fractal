/**
 * Module dependencies.
 */

var HighlightJs = require('highlight.js');
var _           = require('lodash');

var langMap = {
    'nunjucks': 'django',
    'nunj': 'django',
};

/*
 * Export the highlighter.
 */

module.exports = function highlighter(content, lang){

    if (lang) {
        lang = lang.replace(/^\./,'').toLowerCase();
        lang = langMap[lang] || lang;
    }
    try {
        return lang ? HighlightJs.highlight(lang, content).value : HighlightJs.highlightAuto(content).value;
    } catch(e) {
        return HighlightJs.highlightAuto(content).value;
    }

};
