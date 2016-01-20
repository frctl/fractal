/**
 * Module dependencies.
 */

var logger = require('winston');
var app    = require('../application');

module.exports = function(command, args, opts) {
    switch (command) {
        case 'start':
            require('./server').start(opts);
            break;
        case 'build':
            require('./builder/builder').start(opts);
            break;
        case 'create':
            require('./generator/generator').start(args, opts);
            break;
        case 'init':
            require('./init').start(opts);
            break;
        default:
            if (app.get('env') === 'test') {
                // do nothing
            } else {
                logger.error('Unrecognised command.');
                process.exit(1);
            }
            break;
    }
};
