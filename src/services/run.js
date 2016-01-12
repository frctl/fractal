/**
 * Module dependencies.
 */

var logger = require('winston');

module.exports = function(command, args, opts) {
    switch (command) {
        case 'start':
            require('./server/server').start(opts);
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
            logger.error('Unrecognised command.');
            process.exit(1);
            break;
    }
};
