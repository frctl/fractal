/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var fs          = require('fs');
var path        = require('path');
// var swag        = require('swag');
var nunjucks    = require('nunjucks');

/*
 * Load helpers from disk.
 */

// var helpers = {};
// var helpersPath = path.join(__dirname, 'helpers');

// fs.readdirSync(helpersPath).forEach(function(fileName){
//     var helper = require(path.join(helpersPath, fileName));
//     helpers[helper.name] = helper.helper;
// });

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

    return nj;
};