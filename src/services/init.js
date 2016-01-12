/**
 * Module dependencies.
 */

var logger      = require('winston');
var path        = require('path');
var chalk       = require('chalk');
var _           = require('lodash');
var Promise     = require('bluebird');
var fs          = Promise.promisifyAll(require('fs'));

module.exports = function(argv, app){

    var fractalFilePath = path.join(process.cwd(), 'fractal.js');

    return fs.statAsync(fractalFilePath).then(function(){
        logger.error('This project already has a fractal.js file created for it.');
    }).catch(function(){
        var content = "";
        content += "/*\n * Fractal configuration file\n */\n\n";
        content += "const app = require('@frctl/fractal');\n\n";
        content += "app.set('project:title', 'My new project');\n";
        content += "app.set('components:path', 'src/components');\n";
        content += "app.set('pages:path', 'src/pages');\n";
        return fs.writeFileAsync(fractalFilePath, content).then(function(){
            console.log(chalk.green('fractal.js file created at ' + fractalFilePath));
        });
    }).finally(function(){
        process.exit();
    });

};
