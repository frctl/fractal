/**
 * Module dependencies.
 */

var logger  = require('winston');

/*
 * Export the exporter.
 */

module.exports = new Exporter;

/**
 * Initialize a new Exporter instance.
 *
 * @api private
 */

function Exporter(){

}

/**
 * Setup the Exporter
 *
 * @api private
 */

Exporter.prototype.init = function(fractal){

    fractal.getComponents().then(function(components){
        
    });

    return this;
};

/**
 * Run the exporter.
 *
 * @api public
 */

Exporter.prototype.export = function(){
    
};

