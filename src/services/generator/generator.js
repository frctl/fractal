/**
 * Module dependencies.
 */

var logger      = require('winston');
var Promise     = require('bluebird');
var chalk       = require('chalk');
var path        = require('path');
var fs          = require('fs');
var _           = require('lodash');
var mkdirp      = Promise.promisify(require('mkdirp'));
var ncp         = Promise.promisify(require('ncp'));
var rimraf      = Promise.promisify(require('rimraf'));

/**
 * Export the generator function
 */

module.exports = function(type, relPath, opts, app){
    var opts = opts || {};
    switch (type) {
        case 'component':
            var rootPath = app.get('components:path');
            break;
        case 'page':
            var rootPath = app.get('pages:path');
            break;
        default:
            logger.error("Entity type '%s' is not recognised. Try 'page' or 'component' instead.", type);
            process.exit(1);
            return;
    }

    var entityPath = path.join(rootPath, relPath);

    console.log(entityPath);

    process.exit(0);
};
