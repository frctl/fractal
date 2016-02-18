'use strict';

const chalk = require('chalk');
const _     = require('lodash');
const cli   = require('../cli');

module.exports = {

    name: 'welcome',

    opts: {
        description: 'Default command'
    },

    callback: function(args, opts, app) {

        const header   = app.get('project.title');
        const footer   = `Powered by Fractal v${app.version}`;
        const commands = app.commands.all();
        let usage      = '';

        usage += `
Usage: ${chalk.magenta('fractal <command>')} [args] [opts]

The following commands are available:
`;
        _.forEach(_.sortBy(commands, 'name'), command => {
            if (command.name !== 'welcome') {
                const description = command.opts && command.opts.description ? ' - ' + command.opts.description : '';
                usage +=`\n➜ ${chalk.magenta(command.name)}${description}`;
            }
        });

        usage += '\n';

        cli.box(header, usage, footer);
        return;
    }

};
