/**
 * Module dependencies.
 */

var path        = require('path');
var chalk       = require('chalk');

var ExistsError = require('../../../errors/exists');
var app         = require('../../../application');

module.exports = {

    generate: function(relPath, opts){
        var fullPath = path.join(app.get('pages:path'), relPath);
        return app.getPages().then(function(pages){
            if (pages.exists(relPath)) {
                throw new ExistsError('The page at ' + relPath +' already exists.');
            }
            return pages;
        }).then(function(pages){
            return pages.create(relPath, opts);
        }).then(function(){
            console.log(chalk.green("Page created."));
        });
    }

};
