'use strict';

module.exports = {
    command: 'build',

    config: {
        description: 'Build a static version of the web UI',
        options: [['-t, --theme <package-name>', 'The name of custom UI theme to use, if required']],
    },

    action(args) {
        const builder = this.fractal.web.builder(args.options);

        builder.on('start', () => {
            this.console.success('Build started...');
        });

        builder.on('progress', (completed, total) => {
            this.console.write(`Exported ${completed} of ${total} items`, 'info');
        });

        builder.on('error', (err) => {
            this.console.error(err.message, err);
        });

        return builder
            .build()
            .then((data) => {
                const e = data.errorCount;
                this.console[e ? 'warn' : 'success'](
                    `Build finished with ${e === 0 ? 'no' : e} error${e == 1 ? '' : 's'}.`,
                );
            })
            .catch((e) => {
                this.console.error(e).br();
            });
    },
};
