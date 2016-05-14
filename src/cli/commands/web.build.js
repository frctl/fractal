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
        builder.on('start', () => {
            this.console.success('Build started...');
        });
        builder.start().then(() => {
            this.console.success('Build Finished!');
            done();
        }).catch(e => {
            this.console.error(e);
            done();
        });
    }

};
