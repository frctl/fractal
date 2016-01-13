/**
 * Module dependencies.
 */

var path        = require('path');
var chalk       = require('chalk');

var ExistsError = require('../../../errors/exists');
var app         = require('../../../application');

module.exports = {

    generate: function(relPath, opts){
        var fullPath = path.join(app.get('components.path'), relPath);
        return app.getComponents().then(function(components){
            if (components.exists(relPath)) {
                throw new ExistsError('The component at ' + relPath +' already exists.');
            }
            return components;
        }).then(function(components){
            return components.create(relPath, opts);
        }).then(function(){
            console.log(chalk.green("Component created."));
        });
    }

};
