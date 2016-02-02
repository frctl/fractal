'use strict';

const chalk    = require('chalk');
const Path     = require('path');
const Service  = require('../../../service');
const defaults = require('../config');
const server   = require('./server');
const build    = require('./build');
const theme    = require('./theme');

module.exports = class WebService extends Service {

    constructor(config) {
        super(config);
    }

    run(command, args, opts, app){
        this.config.port = opts.port || this.config.port;
        app.theme = this.loadTheme();
        if (command === WebService.getName()) {
            if (args[0] === 'start') {
                const srv = server(this.config, app);
                return srv.start();
            } else if (args[0] === 'build') {
                return build(this.config, app);
            }
        }
        throw new Error('Command not recognised');
    }

    loadTheme(){
        const conf = this.config;
        theme.root(Path.parse(require.resolve(conf.theme)).dir);
        require(conf.theme)(theme);
        if (conf.static.path) {
            theme.static(conf.static.path, conf.static.mount);
        }
        return theme;
    }

    static getName(){
        return 'web';
    }

    static getCommands(done, config) {

        return [{
            name: WebService.getName(),
            description: 'Start a local web server or generate a static build.',
            command: function (yargs, argv) {
                yargs.usage('\nUsage: $0 browser <command>');

                yargs.command('start', 'Start the component library web interface server.', (yargs) => {
                    yargs.usage('\nUsage: $0 start [options]');
                    yargs.option('p', {
                        alias: 'port',
                        default: config.port,
                        description: 'The port to run the server on.',
                    });
                    done(yargs, 2);
                });

                yargs.command('build', 'Generate a static version of the component library web interface.', (yargs) => {
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
