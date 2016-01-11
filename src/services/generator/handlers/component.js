/**
 * Module dependencies.
 */

var path        = require('path');

var ExistsError = require('../../../errors/exists');


module.exports = ComponentGenerator;

/*
 * ComponentGenerator constructor.
 *
 * @api private
 */

function ComponentGenerator(app){
    this.app = app;
};


/*
 * Run the generator.
 *
 * @api public
 */

ComponentGenerator.prototype.generate = function(relPath, opts){
    var self = this;
    var fullPath = path.join(self.app.get('components:path'), relPath);
    return this.app.getComponents().then(function(components){
        if (components.exists(relPath)) {
            throw new ExistsError('The component at ' + relPath +' already exists.');
        }
        return mkdirp(fullPath).then(function(){
            return components
        });
    }).then(function(components){
        return components.create(relPath)
    });
};
