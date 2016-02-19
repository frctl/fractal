'use strict';

const chalk = require('chalk');
const _     = require('lodash');
const cli   = require('../cli');

module.exports = {

    name: 'welcome',

    opts: {
        description: 'Default command',
        private: true,
        scope: ['global','local']
    },

    callback: function (args, opts, app) {

        const header = 'Fractal CLI' + (app.global ? '' : ': ' + app.get('project.title'));
        const footer = `Powered by Fractal v${app.version}`;
        const scope  = app.global ? 'global' : 'local';
        let commands = _.filter(app.commands.all(), c => c.opts.private !== true);
        commands     = _.filter(commands, c => _.includes(c.opts.scope, scope));
        commands     = _.sortBy(commands, 'name');

        let usage      = '';

        usage += `
Usage: ${chalk.magenta('fractal <command>')} [args] [opts]
`

        if (commands.length) {
            usage += `\nThe following commands are available:\n`;

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
        }

        cli.box(header, usage, footer);
        return;
    }

};
