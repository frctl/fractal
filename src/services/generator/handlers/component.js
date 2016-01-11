/**
 * Module dependencies.
 */

var logger      = require('winston');
var Promise     = require('bluebird');
var path        = require('path');
var _           = require('lodash');
var fs          = Promise.promisifyAll(require('fs'));
var mkdirp      = Promise.promisify(require('mkdirp'));
var ncp         = Promise.promisify(require('ncp'));
var rimraf      = Promise.promisify(require('rimraf'));

var ExistsError = require('../../../errors/exists');
var utils = require('../../../utils');


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
        // var pathParts = path.parse(fullPath);
        // var title = utils.titlize(pathParts.name);
        //
        // var config = {
        //     handle: pathParts.name,
        //     label: utils.titlize(pathParts.name)
        //     context: {}
        // };
        //
        // var templatePath = path.join(fullPath, pathParts.name + self.app.getComponentViewEngine().ext);
        // var configPath = path.join(fullPath, self.app.get('generator:config:name').replace('{{name}}', pathParts.name));
        //
        // var writes = [
        //     fs.writeFileAsync(templatePath, '<p>' +  + ' component</p>'),
        //     fs.writeFileAsync(configPath, JSON.stringify(config, null, 4))
        // ];
        //
        // return Promise.all(writes);
    });
};

// /**
//  * Export the generator function
//  */
//
// module.exports = function(argv, app){
//
//     var type = argv._[1];
//     var relPath = argv._[2];
//
//     switch (type) {
//         case 'component':
//             var rootPath = app.get('components:path');
//             break;
//         case 'page':
//             var rootPath = app.get('pages:path');
//             break;
//         default:
//             logger.error("Entity type '%s' is not recognised. Try 'page' or 'component' instead.", type);
//             process.exit(1);
//             return;
//     }
//
//     var components = app.getComponents();
//     .findByPath(relPath.trim('/'));
//
//     // var entityPath = path.join(rootPath, relPath);
//
//     console.log(entityPath);
//
//     process.exit(0);
// };
