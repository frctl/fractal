/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var fs          = require('fs');
var path        = require('path');
var nunjucks    = require('nunjucks');

var highlighter = require('./highlighter');
var app         = require('./application');

/*
 * Instantiate and export the nunjucks instance.
 */

module.exports = function(viewsPath){

    var nj = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(viewsPath, {
            watch: true,
            noCache: true
        }), {
            autoescape: false
        }
    );

    nj.addGlobal('fractal', {
        highlight: function(str, lang){
            str =  !_.isString(str) ? str.toString() : str;
            return highlighter(str, lang);
        },
        statuses: app.getStatuses(),
        config: app.get(),
    });

    return nj;
};
