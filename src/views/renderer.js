/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var fs          = require('fs');
var path        = require('path');
var nunjucks    = require('nunjucks');

var highlighter = require('../highlighter');

/*
 * Instantiate and export the nunjucks instance.
 */

module.exports = function(viewsPath, opts){

    opts = opts || {};
    var nj = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(viewsPath),
        _.defaults(opts, {
            autoescape: false,
            watch: true
    }));

    nj.addGlobal('fractal', {
        highlight: function(str){
            str =  !_.isString(str) ? str.toString() : str; 
            return highlighter(str);
        }
    });

    return nj;
};