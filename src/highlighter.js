/**
 * Module dependencies.
 */

var HighlightJs = require('highlight.js');
var _           = require('lodash');

/*
 * Export the highlighter.
 */

module.exports = function highlighter(content){

    var hi = HighlightJs.highlightAuto(content).value;
    return hi;
    // var lines = hi.split("\n");
    // return _.map(lines, function(line){
    //     return '<span class="hljs-line">' + line + '</span>';
    // }).join("\n");

};