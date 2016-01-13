/**
 * Module dependencies.
 */

var path        = require('path');
var logger      = require('winston');

module.exports = {

    start: function(args, opts){

        var type = args[0];
        var relPath = args[1].trim('/');

        try {
            var handler = require('./handlers/' + type);
        } catch(e) {
            logger.debug(e.message);
            logger.error("Entity type '%s' is not recognised. Try 'page' or 'component' instead.", type);
            process.exit(1);
            return;
        }

        handler.generate(relPath, opts).catch(function(e){
            logger.error(e.message);
            process.exit(1);
        }).finally(function(){
            process.exit(0);
        });

    }

};
