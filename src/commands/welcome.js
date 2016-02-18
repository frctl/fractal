'use strict';

const chalk = require('chalk');
const _     = require('lodash');
const cli   = require('../cli');

module.exports = {

    name: 'welcome',

    opts: {
        description: 'Default command',
        private: true
    },

    callback: function (args, opts, app) {

        const header   = app.get('project.title');
        const footer   = `Powered by Fractal v${app.version}`;
        const commands = _.sortBy(_.filter(app.commands.all(), c => c.opts.private !== true), 'name');
        let usage      = '';

        usage += `
Usage: ${chalk.magenta('fractal <command>')} [args] [opts]

The following commands are available:
`;
        let longest = 0;
        _.forEach(commands, command => {
            if (command.name.length > longest) {
                longest = command.name.length;
            }
        });

        _.forEach(commands, command => {
            const description = command.opts && command.opts.description ? command.opts.description : '';
            usage += `
➜ ${chalk.magenta(_.padEnd(command.name, longest + 2))}${description}`;
        });

        usage += '\n';

        cli.box(header, usage, footer);
        return;
    }

};
