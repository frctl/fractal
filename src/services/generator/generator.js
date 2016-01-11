/**
 * Module dependencies.
 */

var path        = require('path');
var logger      = require('winston');

/**
 * Export the generator function
 */

module.exports = function(argv, app){

    var type = argv._[1];
    var relPath = argv._[2].trim('/');

    try {
        var Handler = require('./handlers/' + type);
    } catch(e) {
        logger.debug(e.message);
        logger.error("Entity type '%s' is not recognised. Try 'page' or 'component' instead.", type);
        process.exit(1);
        return;
    }

    var generator = new Handler(app);
    generator.generate(relPath, argv).catch(function(e){
        logger.error(e.message);
        process.exit(1);
    }).finally(function(){
        process.exit(0);
    });

};
