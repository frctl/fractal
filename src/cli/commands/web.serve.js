'use strict';

module.exports = {

    command: 'serve [path]',

    config: {
        description: 'Start a web preview server',
        options: [
            ['-p, --port <number>', `The port to run the server on. Defaults to 1000`],
            ['-t, --theme <package-name>', 'The name of custom UI theme to use, if required'],
            ['-s, --sync', 'Use BrowserSync to sync and reload pages when changes occur'],
            ['-w, --watch', 'Watch the filesystem for changes.']
        ]
    },

    action: function (args, done) {
        this.log('asdasd');
        done();
    }

};
