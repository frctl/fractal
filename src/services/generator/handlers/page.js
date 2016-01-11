/**
 * Module dependencies.
 */

var path        = require('path');

var ExistsError = require('../../../errors/exists');

module.exports = PageGenerator;

/*
 * PageGenerator constructor.
 *
 * @api private
 */

function PageGenerator(app){
    this.app = app;
};

/*
 * Run the generator.
 *
 * @api public
 */

PageGenerator.prototype.generate = function(relPath, opts){
    var self = this;
    var fullPath = path.join(self.app.get('pages:path'), relPath);
    return this.app.getPages().then(function(pages){
        if (pages.exists(relPath)) {
            throw new ExistsError('The page at ' + relPath +' already exists.');
        }
        return pages;
    }).then(function(pages){
        return pages.create(relPath, opts);
    });
};
