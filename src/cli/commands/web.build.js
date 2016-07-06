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
            this.console.update(`Exported 0 of ${total} items`, 'info');
        });

        builder.on('exported', (builder) => {
            complete++;
            this.console.update(`Exported ${complete} of ${total} items`, 'info');
        });

        builder.on('error', (err, req) => {
            this.console.error(err.message, err).persist();
        });

        return builder.build().then(data => {
            this.console.persist();
            let e = data.errorCount;
            this.console[e ? 'warn' : 'success'](`Build finished with ${e === 0 ? 'no' : e} error${e == 1 ? '' : 's'}.`).unslog();
        }).catch(e => {
            this.console.error(e).unslog().br();
        });
    }

};
