'use strict';

module.exports = {

    command: 'build',

    config: {
        description: 'Build a static version of the web UI',
        options: [
            ['-t, --theme <package-name>', 'The name of custom UI theme to use, if required'],
        ],
    },

    action(args, done) {
        const builder = this.fractal.web.builder(args.options);
        const total = 0;

        builder.on('start', () => {
            this.console.success('Build started...');
        });

        builder.on('progress', (completed, total) => {
            this.console.update(`Exported ${completed} of ${total} items`, 'info');
        });

        builder.on('error', (err, req) => {
            this.console.error(err.message, err).persist();
        });

        return builder.build().then(data => {
            this.console.persist();
            const e = data.errorCount;
            this.console[e ? 'warn' : 'success'](`Build finished with ${e === 0 ? 'no' : e} error${e == 1 ? '' : 's'}.`).unslog();
        }).catch(e => {
            this.console.error(e).unslog().br();
        });
    },

};
