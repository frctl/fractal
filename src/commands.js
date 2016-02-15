'use strict';

const chalk = require('chalk');
const _     = require('lodash');

module.exports = {

    welcome(args, opts, app) {
        const commands = app._getCommands();
        const gr = chalk.green;
        console.log(`=========================================

Fractal - version ${app.version}

Usage: ${chalk.green('fractal <command> [args] [opts]')}

The following commands are available:
`);

        _.forEach(commands, (command, name) => {
            if (name !== 'welcome') {
                const description = command.opts && command.opts.description ? ' - ' + command.opts.description : '';
                console.log(` ★ ${chalk.green(command.name)}${description}`);
            }
        });
        console.log('\n=========================================');
        return;
    }

};
