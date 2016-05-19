'use strict';

module.exports = {

    command: 'build',

    config: {
        description: 'Build a static version of the web UI',
        options: [
            ['-t, --theme <package-name>', 'The name of custom UI theme to use, if required'],
        ]
    },

    action: function (args, done) {
        const builder = this.fractal.web.builder(args.options);
        let total = 0;
        let complete = 0;

        builder.on('start', () => {
            this.console.success('Build started...');
        });

        builder.on('ready', (builder) => {
            total = builder.targets().length;
            this.console.slog().log(`Exported 0 of ${total} items`);
        });

        builder.on('exported', (builder) => {
            complete++;
            this.console.slog().log(`Exported ${complete} of ${total} items`);
        });

        builder.on('error', (err, req) => {
            this.console.error(err.message, err).slog();
        });

        return builder.build().then(data => {
            let e = data.errorCount;
            this.console[e ? 'warn' : 'success'](`Build finished with ${e === 0 ? 'no' : e} error${e == 1 ? '' : 's'}.`).unslog().br();
        }).catch(e => {
            this.console.error(e).unslog().br();
        });
    }

};
