/**
 * Module dependencies.
 */

var HighlightJs = require('highlight.js');
var _           = require('lodash');

/*
 * Export the highlighter.
 */

module.exports = function highlighter(content, lang){

    if (lang) {
        lang = lang.replace(/^\./,'').toLowerCase();
    }
    try {
        return lang ? HighlightJs.highlight(lang, content).value : HighlightJs.highlightAuto(content).value;    
    } catch(e) {
        return HighlightJs.highlightAuto(content).value;    
    }

};