'use strict';

const utils = require('util');

module.exports = {

    command: 'start',

    config: {
        description: 'Start a development server',
        options: [
            ['-p, --port <number>', 'The port to run the server on.'],
            ['-t, --theme <package-name>', 'The name of custom UI theme to use, if required'],
            ['-s, --sync', 'Use BrowserSync to sync and reload pages when changes occur'],
            ['-w, --watch', 'Watch the filesystem for changes.'],
        ],
    },

    action(args, done) {
        const server = this.fractal.web.server(args.options);

        server.on('ready', () => {
            const header = 'Fractal web UI server is running!';
            const footer = this.fractal.cli.isInteractive() ? 'Use the \'stop\' command to stop the server.' : 'Use ^C to stop the server.';
            const serverUrl = server.urls.server;
            const format = str => this.console.theme.format(str, 'success', true);
            let body = '';

            if (!server.isSynced) {
                body += `Local URL: ${format(serverUrl)}`;
            } else {
                const syncUrls = server.urls.sync;
                body += `Local URL:      ${format(syncUrls.local)}`;
                body += `\nNetwork URL:    ${format(syncUrls.external)}`;
                body += `\nBrowserSync UI: ${format(syncUrls.ui)}`;
            }

            return this.console.box(header, body, footer).persist();
        });

        server.on('error', (err, req) => {
            if (err.status === '404') {
                this.console.warn(`404: ${err.message}`);
            } else {
                this.console.error(err.message, err);
            }
        });

        return server.start(args.options.sync).catch(e => {
            this.console.error(e);
        });
    },

};
