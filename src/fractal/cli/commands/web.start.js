'use strict';

module.exports = {
    command: 'start',

    config: {
        description: 'Start a development server',
        options: [
            ['-p, --port <number>', 'The port to run the server on.'],
            ['-t, --theme <package-name>', 'The name of custom UI theme to use, if required'],
            ['-w, --watch', 'Watch the filesystem for changes.'],
        ],
    },

    action(args) {
        const server = this.fractal.web.server(args.options);

        server.on('ready', () => {
            const header = 'Fractal web UI server is running!';
            const footer = 'Use ^C to stop the server.';
            const serverUrl = server.urls.server;
            const format = (str) => this.console.theme.format(str, 'success', true);
            let body = `URL: ${format(serverUrl)}`;

            return this.console.box(header, body, footer);
        });

        server.on('error', (err) => {
            if (err.status === '404') {
                this.console.warn(`404: ${err.message}`);
            } else {
                this.console.error(err.message, err);
            }
        });

        server.start().catch((e) => {
            this.console.error(e);
        });
    },
};
