/**
 * Module dependencies.
 */

var marked      = require('marked');
var _           = require('lodash');

/*
 * Export the markdown parser.
 */

module.exports = function markdown(content){

    return marked(content);

};