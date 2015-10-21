/**
 * Module dependencies.
 */

var Promise     = require('bluebird');
var _           = require('lodash');
var fs          = require('fs');
var path        = require('path');
var swag        = require('swag');
var exphbs      = require('express-handlebars');

/*
 * Export the handlebars instance.
 */

module.exports = function(partialsDir, helpers){

    var helpersPath = path.join(__dirname, 'helpers');
    var helpers = {};
    fs.readdirSync(helpersPath).forEach(function(fileName){
        var helper = require(path.join(helpersPath, fileName));
        helpers[helper.name] = helper.helper;
    });

    var hbs = exphbs.create({
        extname: 'hbs',
        partialsDir: partialsDir,
        helpers: helpers
    });
    
    swag.registerHelpers(hbs.handlebars);

    return hbs;
};