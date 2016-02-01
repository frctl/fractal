'use strict';

const Service  = require('../../../service');
const defaults = require('../config');
const server   = require('./server');
const build    = require('./build');
const theme    = require('./theme');

module.exports = class BrowserService extends Service {

    constructor(config) {
        super(config);
    }

    run(command, args, opts, app){
        this.config.port = opts.port || this.config.port;
        app.theme = this.loadTheme();
        if (command === 'browser' && args[0] === 'start') {
            server(this.config, app);
        } else if (command === 'browser' && args[0] === 'build') {
            build(this.config, app);
        }
    }

    loadTheme(){
        const conf = this.config;
        require(conf.theme)(theme);
        if (conf.static.path) {
            theme.static(conf.static.path, conf.static.mount);
        }
        return theme;
    }

    static getName(){
        return 'browser';
    }

    static getCommands(done, config) {

        return [{
            name: 'browser',
            description: 'Start a local browser server or generate a static build.',
            command: function (yargs, argv) {
                yargs.usage('\nUsage: $0 browser <command>');

                yargs.command('start', 'Start the component library browser server.', (yargs) => {
                    yargs.usage('\nUsage: $0 start [options]');
                    yargs.option('p', {
                        alias: 'port',
                        default: config.port,
                        description: 'The port to run the server on.',
                    });
                    done(yargs, 2);
                });

                yargs.command('build', 'Generate a static version of the component library browser.', (yargs) => {
                    yargs.usage('\nUsage: $0 build');
                    done(yargs, 2);
                });

                done(yargs, 2);
            }
        }];

    }

    static getDefaults() {
        return defaults;
    }


};
