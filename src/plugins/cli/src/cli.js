'use strict';

const Path        = require('path');
const Table       = require('cli-table2');
const Promise     = require('bluebird');
const defaults    = require('../config');
const packageJSON = require('../package.json');

module.exports = function(plugin){

    plugin.name('cli');
    plugin.title('Fractal CLI plugin');
    plugin.version(packageJSON.version);

    plugin.defaults(defaults);

    plugin.register('list', 'List information about entities in your project', (yargs) => {

        yargs.usage(`\nUsage: $0 list <type>`);

        yargs.command('components', 'List all components', (yargs) => {
            yargs.usage('\nUsage: $0 components');
            plugin.wrap(yargs, 2);
        });

        yargs.updateStrings({
            'Commands:': 'Types:'
        });

        plugin.wrap(yargs, 2);
    });

    plugin.runner(function(command, args, opts, app){
        if (command === 'list' && args[0] === 'components') {
            return Promise.props(app()).then(function(app){
                const table = new Table({
                    head: ['Handle', '# of variants']
                });
                for (let component of app.components.flatten()) {
                    table.push([component.handle, component.variantCount])
                }
                console.log(table.toString());
            }).catch(err => {
                console.log(err);
            }).finally(() => {
                process.exit();
            });
        }
        throw new Error('Command not recognised');
    });

};
