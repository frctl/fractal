'use strict';

module.exports = {

    command: 'info',

    config: {
        description: 'Get information about your Fractal installation',
        options: [],
        scope: ['global', 'project'],
    },

    action(args, done) {
        const cli = this.fractal.cli;
        const header = 'Fractal install info';
        const footer = null;
        let body = '';

        if (cli.scope === 'project') {
            body += `Project Fractal version: ${this.fractal.version}\n`;
        }
        body += `CLI helper version:      ${this.fractal.cli.cliPackage.version}`;

        return this.console.box(header, body, footer).unslog();
    },

};
