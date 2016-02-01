'use strict';

const Service = require('../../service');
const defaults = require('./config');

module.exports = class GeneratorService extends Service {

    constructor(config) {
        super(config);
    }

    run(command, args, opts){

    }

    static getName(){
        return 'generator';
    }

    static getCommands(done, config) {
        return [{
            name: 'create',
            description: 'Create a new page or component. See command help for details.',
            command: function (yargs, argv) {
                yargs.usage('\nUsage: $0 create <item>');

                /*
                 * Define component creation command
                 */

                yargs.command('component', 'Create a new empty component', function (yargs) {
                    yargs.usage('\nUsage: $0 create component <path>');
                    done(yargs, 3);
                });

                /*
                 * Define page creation command
                 */

                yargs.command('page', 'Create a new blank page', function (yargs) {
                    yargs.usage('\nUsage: $0 create page <path>');
                    // yargs.example('$0 create page styleguide/images', 'Create a new page');
                    done(yargs, 3);
                });

                yargs.updateStrings({
                    'Commands:': 'Items:'
                });

                done(yargs, 2);
            }
        }];
    }

    static getDefaults() {
        return defaults;
    }

};
